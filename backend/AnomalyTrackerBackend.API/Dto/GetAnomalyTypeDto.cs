using AnomalyTrackerBackend.DAL.Entity;

namespace AnomalyTrackerBackend.API.Dto
{
    public class GetAnomalyTypeDto
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Level { get; set; }

         
    }
}
