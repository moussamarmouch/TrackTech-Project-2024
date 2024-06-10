namespace AnomalyTrackerBackend.API.Dto
{
    public class UpdateAnomalyDto
    {
        public bool IsSolved { get; set; }
        public bool IsFlagged { get; set; }
        public string Comment { get; set; }
    }
}
