using System;
using System.Collections.Generic;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using Microsoft.EntityFrameworkCore;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 商品查找邏輯處理實作
    /// </summary>
    public class ItemsLogic : IItemsLogic
    {
        private readonly IUnitOfWork _unitOfWork;

        public ItemsLogic(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 商品分頁搜索邏輯處理
        /// </summary>
        /// <param name="page">頁碼</param>
        /// <param name="size">一頁多少筆</param>
        /// <param name="order">排序方式(desc or asc)</param>
        /// <param name="categoryId">分類ID</param>
        /// <param name="keyword">關鍵字</param>
        /// <returns></returns>
        public async Task<Tuple<int, IReadOnlyCollection<Goods>>> GetGoodsListOfPagingAsync(int page, int size, string order, int? categoryId, string keyword)
        {
            int total = 0;

            IReadOnlyCollection<Goods> goodsList = new List<Goods>();

            if (categoryId == null && keyword == null)
            {
                total = await _unitOfWork.Goods.GetCountAsync(g => g.Status == 1);
                goodsList = await _unitOfWork.Goods.GetGoodsPaging(page, size, order == "desc");
            }
            else if (categoryId != null)
            {
                goodsList = await _unitOfWork.Goods.GetGoodsPagingInCategory(page, size, order == "desc", categoryId.Value);
                total = await _unitOfWork.Goods.GetGoodsCountInCategory(categoryId.Value);
            }
            else if (keyword != null)
            {
                total = await _unitOfWork.Goods.GetCountAsync(g => g.Status == 1 && EF.Functions.Like(g.Name, $"%{keyword}%"));
                goodsList = await _unitOfWork.Goods.GetGoodsPagingInKeyword(page, size, order == "desc", keyword);
            }

            return new Tuple<int, IReadOnlyCollection<Goods>>(total, goodsList);
        }

        /// <summary>
        /// 透過GoodsSkuId取得貨品資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsSkuId</param>
        /// <returns></returns>
        public async Task<GoodsSku> GetGoodsSkuByIdAsync(int id)
        {
            var goodsSku = await _unitOfWork.GoodsSkus.GetDetail(id);
            return goodsSku;
        }

        /// <summary>
        /// 透過GoodsId取得商品資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        public async Task<Goods> GetGoodsById(int id)
        {
            var goods = await _unitOfWork.Goods.GetDtail(id);
            return goods;
        }
    }
}