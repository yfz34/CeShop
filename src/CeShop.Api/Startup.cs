using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using CeShop.Domain.Settings;
using CeShop.Data.EF.Contexts;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.Configurations;
using CeShop.Data.Service.IConfigurations;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Builder;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Http.Features;
using Microsoft.AspNetCore.HttpsPolicy;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.FileProviders;
using Microsoft.Extensions.Hosting;
using Microsoft.Extensions.Logging;
using Microsoft.IdentityModel.Tokens;
using Microsoft.OpenApi.Models;
using CeShop.Business.ILogics;
using CeShop.Business.Logics;
using CeShop.EmailService;
using CeShop.Api.CustomTokenProviders;
using System.Reflection;
using AwsS3.Services;
using CeShop.Data.Service.Services;
using Amazon.Extensions.NETCore.Setup;
using Amazon.Runtime;
using Amazon;
using Amazon.S3;

namespace CeShop.Api
{
    public class Startup
    {
        public Startup(IConfiguration configuration)
        {
            Configuration = configuration;
        }

        public IConfiguration Configuration { get; }

        // This method gets called by the runtime. Use this method to add services to the container.
        public void ConfigureServices(IServiceCollection services)
        {

            services.AddControllers();

            // Swagger設定
            services.AddSwaggerGen(c =>
            {
                c.SwaggerDoc("v1", new OpenApiInfo { Title = "CeShop.Api", Version = "v1" });

                c.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
                {
                    Description = "Input the JWT like: Bearer {your token}",
                    Name = "Authorization",
                    In = ParameterLocation.Header,
                    Type = SecuritySchemeType.ApiKey,
                    BearerFormat = "JWT",
                    Scheme = "Bearer"
                });

                c.AddSecurityRequirement(new OpenApiSecurityRequirement
                {
                    {
                        new OpenApiSecurityScheme
                        {
                            Reference = new OpenApiReference
                            {
                                Type = ReferenceType.SecurityScheme,
                                Id = "Bearer"
                            }
                        },
                        Array.Empty<string>()
                    }
                });

                var xmlFilename = $"{Assembly.GetExecutingAssembly().GetName().Name}.xml";
                c.IncludeXmlComments(Path.Combine(AppContext.BaseDirectory, xmlFilename));

                c.EnableAnnotations();
            });

            // EF Core設定
            services.AddDbContext<CeShopDbContext>(options =>
            {
                // options.UseSqlServer(Configuration.GetConnectionString("DefaultDbConnectionStrings"))
                options.UseNpgsql(Configuration.GetConnectionString("DefaultDbConnectionStrings"));
            });

            // UnitOfWork DI Register
            services.AddScoped<IUnitOfWork, UnitOfWork>();

            // Business Layer DI Register
            services.AddScoped<IAccountsLogic, AccountsLogic>();
            services.AddScoped<ICartsLogic, CartsLogic>();
            services.AddScoped<ICategoriesLogic, CategoriesLogic>();
            services.AddScoped<IGoodsLogic, GoodsLogic>();
            services.AddScoped<IGoodsTypesLogic, GoodsTypesLogic>();
            services.AddScoped<IItemsLogic, ItemsLogic>();
            services.AddScoped<IOrdersLogic, OrdersLogic>();
            services.AddScoped<IUsersLogic, UsersLogic>();
            services.AddScoped<IImagesLogic, ImagesLogic>();

            var awsSection = Configuration.GetSection(nameof(AwsConfiguration));
            services.Configure<AwsConfiguration>(awsSection);

            var awsConfigurationSettings = awsSection.Get<AwsConfiguration>();

            AWSOptions awsOptions = new AWSOptions
            {
                Credentials = new BasicAWSCredentials(awsConfigurationSettings.AwsAccessKey, awsConfigurationSettings.AwsSecretKey),
                Region = RegionEndpoint.APNortheast1
            };
            services.AddDefaultAWSOptions(awsOptions);
            services.AddAWSService<IAmazonS3>();

            services.AddScoped<IS3StorageService, S3StorageService>();

            // 身分驗證設定
            services.AddIdentityCore<AppUser>(options =>
            {
                options.Stores.MaxLengthForKeys = 128;
                options.SignIn.RequireConfirmedAccount = true;

                // 密碼設定
                options.Password.RequireNonAlphanumeric = false;

                // Email不能重覆使用
                options.User.RequireUniqueEmail = true;

                options.Tokens.EmailConfirmationTokenProvider = "emailconfirmation";
            })
            .AddRoles<AppRole>()
            .AddEntityFrameworkStores<CeShopDbContext>()
            .AddTokenProvider<EmailConfirmationTokenProvider<AppUser>>("emailconfirmation");

            // configure strongly typed settings objects
            var jwtSection = Configuration.GetSection(nameof(JwtSetting));

            // 註冊 JwtSetting
            services.Configure<JwtSetting>(jwtSection);

            var jwtBearerTokenSettings = jwtSection.Get<JwtSetting>();
            var key = Encoding.ASCII.GetBytes(jwtBearerTokenSettings.SecurityKey);

            services.AddAuthentication(options =>
            {
                options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
                options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
            })
            .AddJwtBearer(options =>
            {
                var tokenValidationParameters = new TokenValidationParameters
                {
                    ValidateIssuerSigningKey = true,
                    IssuerSigningKey = new SymmetricSecurityKey(key),
                    ValidateLifetime = true,
                    ClockSkew = TimeSpan.Zero, // To immediately reject the access token

                    RequireExpirationTime = true,

                    // 驗證發行人
                    ValidateIssuer = true,
                    ValidIssuer = jwtBearerTokenSettings.Issuer,

                    ValidateAudience = false,
                    //ValidAudience = "JwtAuthDemo",
                };

                options.RequireHttpsMetadata = false;
                options.SaveToken = true;
                options.TokenValidationParameters = tokenValidationParameters;
            });

            // 上傳檔案設定
            services.Configure<FormOptions>(o =>
            {
                o.ValueLengthLimit = int.MaxValue;
                o.MultipartBodyLengthLimit = int.MaxValue;
                o.MemoryBufferThreshold = int.MaxValue;
            });

            // 設定Spa靜態檔案路徑
            services.AddSpaStaticFiles(config =>
            {
                config.RootPath = "build";
            });

            // email service
            var emailConfig = Configuration
                .GetSection("EmailConfiguration")
                .Get<EmailConfiguration>();
            services.AddSingleton(emailConfig);
            services.AddScoped<IEmailSender, EmailSender>();
        }

        // This method gets called by the runtime. Use this method to configure the HTTP request pipeline.
        public void Configure(IApplicationBuilder app, IWebHostEnvironment env)
        {
            if (env.IsDevelopment())
            {
                app.UseDeveloperExceptionPage();

                // 加入跨域功能
                // app.UseCors(builder => builder.AllowAnyHeader().AllowAnyMethod().AllowAnyOrigin());
            }

            app.UseSwagger();
            app.UseSwaggerUI(c => c.SwaggerEndpoint("/swagger/v1/swagger.json", "CeShop.Api v1"));

            // app.UseHttpsRedirection();

            app.UseRouting();

            app.UseAuthentication();

            app.UseAuthorization();

            app.UseEndpoints(endpoints =>
            {
                endpoints.MapControllers();
            });

            // Static Image File Server
            app.UseStaticFiles(new StaticFileOptions()
            {
                FileProvider = new PhysicalFileProvider(Path.Combine(Directory.GetCurrentDirectory(), @"Resources")),
                RequestPath = new PathString("/Resources")
            });

            // Spa靜態檔案
            app.UseSpaStaticFiles();

            // Host node server spa
            app.UseSpa(builder =>
            {
                if (env.IsDevelopment())
                {
                    builder.UseProxyToSpaDevelopmentServer("http://localhost:3000/");
                }
            });
        }
    }
}
