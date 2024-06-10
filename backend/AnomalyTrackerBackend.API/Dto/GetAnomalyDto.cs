namespace AnomalyTrackerBackend.API.Dto
{
    public class GetAnomalyDto
    {
        public int Id { get; set; }
        public GetAnomalyTypeDto AnomalyType { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Photo { get; set; }
        public bool IsSolved { get; set; }
        public bool IsFlagged { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public string Comment { get; set; }
    }
}
