using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using CeShop.Business.ILogics;
using CeShop.Data.EF.Entities;
using CeShop.Data.Service.IConfigurations;
using CeShop.Domain.Dtos.Requests;

namespace CeShop.Business.Logics
{
    /// <summary>
    /// 商品管理邏輯處理實作
    /// </summary>
    public class GoodsLogic : IGoodsLogic
    {
        private readonly IUnitOfWork _unitOfWork;

        public GoodsLogic(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 取得所有商品資料邏輯處理
        /// </summary>
        /// <returns></returns>
        public async Task<IReadOnlyCollection<Goods>> GetAllAsync()
        {
            var goodsList = await _unitOfWork.Goods.ReadsAsync(g => g.Status >= 0);
            return goodsList;
        }

        /// <summary>
        /// 透過GoodsId取的商品詳細資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        public async Task<Goods> GetByIdAsync(int id)
        {
            var goods = await _unitOfWork.Goods.GetDtail(id);
            return goods;
        }

        /// <summary>
        /// 新增商品資料邏輯處理
        /// </summary>
        /// <param name="goodsPostRequestDto">新增商品物件</param>
        /// <returns></returns>
        public async Task CreateAsync(GoodsPostRequestDto goodsPostRequestDto)
        {
            // 商品分類
            var categoryGoodsList = new List<CategoryGoods>();
            if (goodsPostRequestDto.CategoryLevel1Id != null)
            {
                categoryGoodsList.Add(new CategoryGoods
                {
                    CategoryId = goodsPostRequestDto.CategoryLevel1Id.Value,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                });

                if (goodsPostRequestDto.CategoryLevel2Id != null)
                {
                    categoryGoodsList.Add(new CategoryGoods
                    {
                        CategoryId = goodsPostRequestDto.CategoryLevel2Id.Value,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow
                    });

                    if (goodsPostRequestDto.CategoryLevel3Id != null)
                    {
                        categoryGoodsList.Add(new CategoryGoods
                        {
                            CategoryId = goodsPostRequestDto.CategoryLevel3Id.Value,
                            CreateTime = DateTime.UtcNow,
                            UpdateTime = DateTime.UtcNow
                        });
                    }
                }
            }

            // 規格
            var goodsSpecifications = goodsPostRequestDto.GoodsSpecifications.Select((specification, index) => new GoodsSpecification
            {
                Name = specification.Name,
                Sequence = index + 1,
                GoodsSpecificationOptions = specification.GoodsSpecificationOptions.Select((option, optionIndex) => new GoodsSpecificationOption
                {
                    Value = option.Name,
                    Seqence = optionIndex + 1,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                    Picture = option.PictureName == "" ? null : new Picture
                    {
                        Name = option.PictureName,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    },
                }).ToList(),
                CreateTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow,
            }).ToList();

            // 商品
            var goods = new Goods
            {
                Code = goodsPostRequestDto.Code,
                Name = goodsPostRequestDto.Name,
                Description = goodsPostRequestDto.Description,
                Status = goodsPostRequestDto.Status,
                Unit = goodsPostRequestDto.Unit,
                OriginPrice = goodsPostRequestDto.Price,
                SellPrice = goodsPostRequestDto.Price,
                Stock = goodsPostRequestDto.Stock,
                CategoryGoodsList = categoryGoodsList,
                GoodsTypeId = goodsPostRequestDto.GoodsTypeId,
                MainPictureName = goodsPostRequestDto.MainPicture,
                CreateTime = DateTime.UtcNow,
                UpdateTime = DateTime.UtcNow,

                GoodsPictures = goodsPostRequestDto.Pictures.Where(p => !String.IsNullOrEmpty(p)).Select((p, index) => new GoodsPicture
                {
                    Sequence = index + 1,
                    IsMain = index == 0 ? true : false,
                    Picture = new Picture
                    {
                        Name = p,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    },
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                }).ToList(),

                GoodsAttributes = goodsPostRequestDto.GoodsAttributes.Select((attribute, index) => new GoodsAttribute
                {
                    Name = attribute.Name,
                    Value = attribute.Value,
                    Sequence = index + 1,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                }).ToList(),

                GoodsSpecifications = goodsSpecifications,

                GoodsSkus = goodsPostRequestDto.GoodsSkus.Select((sku, index) => new GoodsSku
                {
                    Name = goodsPostRequestDto.Name,
                    SkuCode = sku.Code,
                    Sequence = index + 1,
                    OriginPrice = sku.Price,
                    SellPrice = sku.Price,
                    Status = sku.Status,
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow,
                    Inventory = new Inventory
                    {
                        Quantity = sku.Quantity,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow,
                    },
                    GoodsSkuSpecifications = sku.GoodsSkuSpecifications.Select(skuSpecification =>
                    {
                        var goodsSpecification = goodsSpecifications.Where(goodsSpecification => goodsSpecification.Name == skuSpecification.Name).SingleOrDefault();
                        return new GoodsSkuSpecification
                        {
                            GoodsSpecification = goodsSpecification,
                            GoodsSpecificationOption = goodsSpecification?.GoodsSpecificationOptions.Where(o => o.Value == skuSpecification.Value).First()
                        };
                    }).ToList()
                }).ToList()
            };

            await _unitOfWork.Goods.CreateAsync(goods);
            await _unitOfWork.CompleteAsync();

            return;
        }

        /// <summary>
        /// 更新商品上下架邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <param name="isShelf">是否上架</param>
        /// <returns></returns>
        public async Task UpdateStatusAsync(int id, bool isShelf)
        {
            var goods = await _unitOfWork.Goods.GetByIdAsync(id);

            if (goods == null)
                throw new NullReferenceException();

            goods.Status = isShelf ? 1 : 0;
            _unitOfWork.Goods.UpdateByProperty(goods, x => x.Status);
            await _unitOfWork.CompleteAsync();
            return;
        }

        /// <summary>
        /// 透過GoodsId刪除資料邏輯處理
        /// </summary>
        /// <param name="id">GoodsId</param>
        /// <returns></returns>
        public async Task DeleteAsync(int id)
        {
            var existingGoods = await _unitOfWork.Goods.GetByIdAsync(id);

            if (existingGoods == null)
                throw new NullReferenceException();

            existingGoods.Status = -1;
            _unitOfWork.Goods.UpdateByProperty(existingGoods, x => x.Status);
            await _unitOfWork.CompleteAsync();
            return;
        }
    }
}