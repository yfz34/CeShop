using System;
using System.Collections.Generic;
using System.Drawing;
using System.Drawing.Drawing2D;
using System.Drawing.Imaging;
using System.IO;
using System.Linq;
using System.Net.Http.Headers;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Domain.Settings;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.Options;

namespace CeShop.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ImagesController : ControllerBase
    {
        private readonly IConfiguration _config;
        private static readonly string[] _fileExtentions = new string[] { ".jpg", ".jpeg", ".gif", ".png" };
        private IImagesLogic _imagesLogic;

        public ImagesController(IConfiguration config, IImagesLogic imagesLogic)
        {
            _config = config;
            _imagesLogic = imagesLogic;
        }

        /// <summary>
        /// 上傳照片
        /// </summary>
        [HttpPost, DisableRequestSizeLimit]
        public async Task<IActionResult> Upload([FromForm] Dictionary<string, string> fields)
        {
            var result = new List<string>();

            try
            {
                var formCollection = await Request.ReadFormAsync();

                var files = formCollection.Files;
                if (files.Any(f => f.Length == 0))
                {
                    return BadRequest();
                }

                var folderPath = GetFolderPath();

                foreach (var file in files)
                {
                    string fileExtension = Path.GetExtension(file.FileName);

                    if (!_fileExtentions.Contains(fileExtension.ToLower()))
                    {
                        throw new FileLoadException("不合法的副檔名");
                    }

                    var s3Response = await _imagesLogic.UploadS3ImageFileAsync(file);
                    if (s3Response.StatusCode != 200)
                        throw new Exception("上傳至S3失敗: " + s3Response.Message);

                    var fullFilePath = Path.Combine(folderPath, s3Response.FileName + "." + s3Response.FileExtension);
                    // var dbPath = Path.Combine(folderName, s3Response.FileName);

                    using (var stream = new FileStream(fullFilePath, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    result.Add(s3Response.FileName);
                }
                return Ok(result);
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        /// <summary>
        /// 顯示照片
        /// </summary>
        [HttpGet("Show")]
        public async Task<IActionResult> Show(string name, int? pixel)
        {
            if (string.IsNullOrEmpty(name))
                return NotFound();

            try
            {
                var folderPath = GetFolderPath();

                var fullFilePath = Path.Combine(folderPath, name + ".jpeg");

                Image sourceImage = null;

                if (!System.IO.File.Exists(fullFilePath))
                {
                    var s3File = await _imagesLogic.GetS3ImageFileAsync(name);
                    if (s3File == null)
                        throw new Exception("S3 Bucket Not Found File");

                    using (var stream = new FileStream(fullFilePath, FileMode.Create))
                    {
                        await s3File.CopyToAsync(stream);
                        sourceImage = Image.FromStream(stream);
                    }

                    await s3File.DisposeAsync();
                }
                else
                {
                    sourceImage = Image.FromFile(fullFilePath);
                }

                if (sourceImage == null)
                    return NotFound();

                if (pixel != null || pixel > 0)
                    sourceImage = ResizeImage(sourceImage, new Size(pixel.Value, pixel.Value));

                var file = ImageToByteArray(sourceImage);

                return File(file, "image/jpeg");
            }
            catch (Exception ex)
            {
                Console.WriteLine(ex.ToString());
                return BadRequest();
            }
        }

        /// <summary>
        /// 取得存放檔案資料夾路徑
        /// </summary>
        /// <returns></returns>
        private string GetFolderPath()
        {
            // string folderName = Path.Combine("Resources", "Images");
            string folderName = _config["Image:Path"];
            var folderPath = Path.Combine(Directory.GetCurrentDirectory(), folderName);
            return folderPath;
        }

        private byte[] ImageToByteArray(Image imageIn)
        {
            using var ms = new MemoryStream();
            imageIn.Save(ms, ImageFormat.Jpeg);
            return ms.ToArray();
        }

        private static Image ResizeImage(Image imgToResize, Size size)
        {
            //Get the image current width  
            int sourceWidth = imgToResize.Width;
            //Get the image current height  
            int sourceHeight = imgToResize.Height;
            float nPercent = 0;
            float nPercentW = 0;
            float nPercentH = 0;
            //Calulate  width with new desired size  
            nPercentW = ((float)size.Width / (float)sourceWidth);
            //Calculate height with new desired size  
            nPercentH = ((float)size.Height / (float)sourceHeight);
            if (nPercentH < nPercentW)
                nPercent = nPercentH;
            else
                nPercent = nPercentW;
            //New Width  
            int destWidth = (int)(sourceWidth * nPercent);
            //New Height  
            int destHeight = (int)(sourceHeight * nPercent);
            Bitmap b = new Bitmap(destWidth, destHeight);
            Graphics g = Graphics.FromImage((System.Drawing.Image)b);
            g.InterpolationMode = InterpolationMode.HighQualityBicubic;
            // Draw image with new width and height  
            g.DrawImage(imgToResize, 0, 0, destWidth, destHeight);
            g.Dispose();
            return (System.Drawing.Image)b;
        }
    }
}