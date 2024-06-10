namespace AnomalyTrackerBackend.API.Dto
{
    public class GetAssetDto
    {
        public int Id { get; set; }
        public GetAssetTypeDto AssetType { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Photo { get; set; }
        public bool IsFlagged { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
    }
}
