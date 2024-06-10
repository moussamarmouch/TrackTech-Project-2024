using Microsoft.EntityFrameworkCore;
using AnomalyTrackerBackend.DAL.Entity;

namespace AnomalyTrackerBackend.DAL
{
    public class AnomalyTrackerDbContext : DbContext
    {
        public AnomalyTrackerDbContext()
        {

        }

        public AnomalyTrackerDbContext(DbContextOptions<AnomalyTrackerDbContext> options) : base(options)
        {
        }
        public DbSet<AnomalyType> AnomalyTypes => Set<AnomalyType>();
        public DbSet<Anomaly> Anomalies => Set<Anomaly>();
        public DbSet<AssetType> AssetTypes => Set<AssetType>();
        public DbSet<Asset> Assets => Set<Asset>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Anomaly>()
               .HasOne(a => a.AnomalyType)
               .WithMany(at => at.Anomalies)
               .HasForeignKey(a => a.AnomalyTypeId)
               .IsRequired();


            modelBuilder.Entity<AnomalyType>().ToTable("AnomalyType");
            modelBuilder.Entity<Anomaly>().ToTable("Anomaly");
            modelBuilder.Entity<AssetType>().ToTable("AssetType");
            modelBuilder.Entity<Asset>().ToTable("Asset");
        }
    }
}