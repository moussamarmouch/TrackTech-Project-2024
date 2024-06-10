using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnomalyTrackerBackend.DAL.Entity
{
    public class AssetType
    {
        public int Id { get; set; }

        public string Name { get; set; }

        public ICollection<Asset> Assets { get; set; }


    }
}
