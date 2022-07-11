using System;
using System.ComponentModel.DataAnnotations;

namespace CeShop.Data.EF.Entities
{
    /// <summary>
    /// 通用欄位
    /// </summary>
    public class BaseEntity
    {
        [Key]
        public int Id { get; set; }

        /// <summary>
        /// 建立時間
        /// </summary>
        /// <value></value>
        public DateTime CreateTime { get; set; }

        /// <summary>
        /// 更新時間
        /// </summary>
        /// <value></value>
        public DateTime UpdateTime { get; set; }
    }
}