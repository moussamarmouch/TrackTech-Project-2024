using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnomalyTrackerBackend.DAL.Entity
{
    public class AnomalyType
    {
        public int Id { get; set; }

        public string Name { get; set; }
        public Severity Level { get; set; }

        public ICollection<Anomaly> Anomalies { get; set; }
        

    }
}
