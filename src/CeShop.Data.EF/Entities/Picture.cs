using System.ComponentModel.DataAnnotations.Schema;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 照片
    /// </summary>
    public class Picture : BaseEntity
    {
        /// <summary>
        /// 照片檔案名稱
        /// </summary>
        /// <value></value>
        public string Name { get; set; }

        /// <summary>
        /// 照片副檔名
        /// </summary>
        /// <value></value>
        public string FileExtension { get; set; }
    }
}