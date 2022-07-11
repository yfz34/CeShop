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
    /// 商品類型管理邏輯處理實作
    /// </summary>
    public class GoodsTypesLogic : IGoodsTypesLogic
    {
        private readonly IUnitOfWork _unitOfWork;

        public GoodsTypesLogic(IUnitOfWork unitOfWork)
        {
            _unitOfWork = unitOfWork;
        }

        /// <summary>
        /// 取得所有商品類型資料邏輯處理
        /// </summary>
        /// <returns></returns>
        public async Task<List<GoodsType>> GetAllAsync()
        {
            var goodsTypes = await _unitOfWork.GoodsTypes.GetAll();
            return goodsTypes;
        }

        /// <summary>
        /// 透過Id取得商品類型詳細資料邏輯處理
        /// </summary>
        /// <param name="id">商品類型Id</param>
        /// <returns></returns>
        public async Task<GoodsType> GetByIdAsync(int id)
        {
            var goodsType = await _unitOfWork.GoodsTypes.GetDtail(id);
            return goodsType;
        }

        /// <summary>
        /// 新增商品類型資料邏輯處理
        /// </summary>
        /// <param name="goodsTypePostRequestDto">新增商品類型物件</param>
        /// <returns></returns>
        public async Task CreateAsync(GoodsTypePostRequestDto goodsTypePostRequestDto)
        {
            var goodsType = new GoodsType
            {
                Name = goodsTypePostRequestDto.Name,
                TypeAttributes = goodsTypePostRequestDto.TypeAttributes?.Select(p => new TypeAttribute
                {
                    Name = p.Name,
                    TypeAttributeOptions = p.TypeAttributeOptions?.Select(o => new TypeAttributeOption
                    {
                        Value = o.Value,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow
                    }).ToList(),
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                }).ToList(),
                TypeSpecifications = goodsTypePostRequestDto.TypeSpecifications?.Select(p => new TypeSpecification
                {
                    Name = p.Name,
                    TypeSpecificationOptions = p.TypeSpecificationOptions?.Select(o => new TypeSpecificationOption
                    {
                        Value = o.Value,
                        CreateTime = DateTime.UtcNow,
                        UpdateTime = DateTime.UtcNow
                    }).ToList(),
                    CreateTime = DateTime.UtcNow,
                    UpdateTime = DateTime.UtcNow
                }).ToList(),
            };

            await _unitOfWork.GoodsTypes.CreateAsync(goodsType);
            await _unitOfWork.CompleteAsync();
            return;
        }

        /// <summary>
        /// 透過Id刪除商品類型資料邏輯處理
        /// </summary>
        /// <param name="id">商品類型Id</param>
        /// <returns></returns>
        public async Task DeleteAsync(int id)
        {
            var goodsType = await _unitOfWork.GoodsTypes.ReadAsync(gt => gt.Id == id);

            if (goodsType == null)
                throw new NullReferenceException();

            await _unitOfWork.GoodsTypes.DeleteRelated(id);
            await _unitOfWork.CompleteAsync();
            return;
        }
    }
}