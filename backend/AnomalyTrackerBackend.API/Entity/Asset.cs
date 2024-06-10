using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnomalyTrackerBackend.DAL.Entity
{
    public class Asset
    {
        public int Id { get; set; }
        public int AssetTypeId { get; set; }
        public DateTime TimeStamp { get; set; }
        public string Photo { get; set; }
        public bool IsFlagged { get; set; }
        public double Latitude { get; set; }
        public double Longitude { get; set; }
        public AssetType AssetType { get; set; }

    }
}
