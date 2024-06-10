using AutoMapper;
using AnomalyTrackerBackend.API.Dto;
using AnomalyTrackerBackend.DAL.Entity;

namespace AnomalyTrackerBackend.API.Mapper
{
    public class AutoMapper : Profile
    {
        public AutoMapper()
        {
            CreateMap<GetAnomalyDto, Anomaly>();
            CreateMap<GetAnomalyTypeDto, AnomalyType>();

            CreateMap<Anomaly, GetAnomalyDto>();
            // Convert the numerical value of the severity enum, to the string value (low, medium, ...)
            CreateMap<AnomalyType, GetAnomalyTypeDto>().ForMember(dest => dest.Level, opt => opt.MapFrom(src => src.Level.ToString()));

            CreateMap<GetAssetDto, Asset>();
            CreateMap<GetAssetTypeDto, AssetType>();
            
            CreateMap<Asset, GetAssetDto>();
            CreateMap<AssetType, GetAssetTypeDto>();

        }
    }
}
