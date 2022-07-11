FROM mcr.microsoft.com/dotnet/aspnet:5.0

RUN apt-get update && apt-get install -y libgdiplus

WORKDIR /app

COPY publish .

EXPOSE 5000

CMD ["dotnet", "CeShop.Api.dll"]