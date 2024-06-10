using AnomalyTrackerBackend.DAL.Entity;
using Microsoft.EntityFrameworkCore;

namespace AnomalyTrackerBackend.DAL.Initializer
{
    public class DBInitializer
    {
        public static void Initialize(AnomalyTrackerDbContext context)
        {

            // add timeout 1 minute
            int milliseconds = 105000;
            Thread.Sleep(milliseconds);

            // Ensure that the tables are created
            context.Database.EnsureCreated();

            // Create dummy data for the Anomaly Types
            if (!context.AnomalyTypes.Any())
            {
                var anomalytypes = new AnomalyType[]
                {
                new AnomalyType { Name = "Vegetation overgrowth", Level = Severity.Medium },
                new AnomalyType { Name = "Weather", Level = Severity.Low },
                new AnomalyType { Name = "Track deviation", Level = Severity.Medium },
                new AnomalyType { Name = "Track infrastructure", Level = Severity.High },
                new AnomalyType { Name = "Tunnel damage", Level = Severity.Extreme },
               };

                foreach (AnomalyType a in anomalytypes)
                {
                    context.AnomalyTypes.Add(a);
                }

                context.SaveChanges();
            }

            // Create dummy data for the anomalies
            if (!context.Anomalies.Any())
            {
                context.Database.EnsureCreated();

                var anomalies = new Anomaly[]
                {
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-17 15:00:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=false, Latitude=50.870105353376104, Longitude=4.368645769919571},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-01-17 17:00:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=false, IsFlagged=false, Latitude=50.44955816988471, Longitude=4.489123228125461 },
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-01-16 15:00:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=false, Latitude=50.851086114067236, Longitude=5.234467645818389 },
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-01-16 15:00:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=false, Latitude=50.988599116013724, Longitude=4.826837048286648 },
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-01-12 12:00:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=true, IsFlagged=false, Latitude=51.2700270182381, Longitude=3.204586514800804, Comment = "Cleared debris from the train track." },
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-20 11:00:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=true, Latitude=51.174030366482604, Longitude=4.151423947595634},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-20 10:00:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=true, Latitude=50.607716235178486, Longitude=5.5736080241283945},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-20 09:00:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=true, Latitude=50.755944177553694, Longitude=4.262935033350031},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-20 08:00:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=true, Latitude=51.24386947749115, Longitude=4.263828243147137},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-20 07:00:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=true, Latitude=51.18342520035514, Longitude=4.832842297790211},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-01-07 08:45:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=false, Latitude=50.74736274914116, Longitude=5.089237178446515 },
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-01-12 12:30:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=false, IsFlagged=false, Latitude=50.54613884514196, Longitude=4.2174747056911475 },
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-01-05 17:20:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=false, IsFlagged=false, Latitude=51.17413179481733, Longitude=4.151355959976775 },
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-10 09:15:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=false, Latitude=51.31830204760382, Longitude=4.339325213905446 },
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-01-15 14:05:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=false, IsFlagged=false, Latitude=51.243708805441926, Longitude=4.382591509909619 },
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-01-03 11:50:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=false, IsFlagged=false, Latitude=50.70419574924201, Longitude=4.21241056795299 },
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-01-18 16:30:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=false, IsFlagged=false, Latitude=51.08249555982274, Longitude=4.345282304877434 },
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-01-09 10:25:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=false, Latitude=50.74546796251118, Longitude=5.767251307987796 },
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-01-13 13:40:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=false, Latitude=51.118210743239935, Longitude=4.346562034526411 },
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-01-02 07:55:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=false, IsFlagged=false, Latitude=50.40609972761006, Longitude=4.4273521047612965 },
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-02-15 14:30:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=true, IsFlagged=false, Latitude=51.208772559234944, Longitude=4.424497987328848, Comment = "Temporary repairs completed." },
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-03-20 09:45:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=false, IsFlagged=true, Latitude=50.973662708967574, Longitude=3.9800978874270663 },
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-05-10 18:20:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=true, IsFlagged=false, Latitude=50.45461601746983, Longitude=4.5793993373582484, Comment = "Inspected and reinforced the damaged area." },
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-04-15 14:30:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=true, IsFlagged=false, Latitude=51.297459305403905, Longitude=4.348682643290357, Comment = "Scheduled maintenance for track repair."},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-07-20 10:45:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=false, IsFlagged=true, Latitude=50.52632679475918, Longitude=5.226778418301167},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-09-05 18:20:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=true, IsFlagged=false, Latitude=50.53889101614782, Longitude=4.1864518231351, Comment = "Coordinated with maintenance team for urgent repair."},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2024-01-10 09:12:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=false, Latitude=50.575837366484784, Longitude=5.833238277139712},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-06-28 16:55:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=true, IsFlagged=false, Latitude=50.87335881464994, Longitude=4.370231387961276, Comment = "Implemented speed restrictions in the affected area."},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-02-17 11:40:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=true, Latitude=51.19160705981359, Longitude=4.365254398588565},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-02-17 11:40:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=true, Latitude=50.419710259147614, Longitude=4.39780748720203},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-05-03 20:05:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=false, IsFlagged=false, Latitude=49.61370342039094, Longitude=5.482455840739187},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-08-22 15:22:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=true, IsFlagged=false, Latitude=50.913979738275835, Longitude=5.498231228721392, Comment = "Notified relevant authorities about the track obstruction."},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-03-12 08:48:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=false, IsFlagged=true, Latitude=50.71022113593947, Longitude=6.043208612398269},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-12-01 17:30:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=true, IsFlagged=false, Latitude=51.16326409615897, Longitude=3.2460668784921083, Comment = "Deployed emergency response team for immediate action."},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-04-05 12:10:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=false, IsFlagged=false, Latitude=4.717757365982413, Longitude=50.879472550849606},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-09-18 09:55:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=true, IsFlagged=false, Latitude=51.296975328142814, Longitude=4.380219909865471, Comment = "Issued caution alerts to train operators."},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-07-10 14:45:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=false, IsFlagged=true, Latitude=50.88630746540571, Longitude=4.40630930649897},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-02-25 21:20:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=true, IsFlagged=false, Latitude=51.2705331538748, Longitude=4.276533394258824, Comment = "Applied safety measures to prevent further damage."},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-10-14 16:05:00"), Photo="https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved=false, IsFlagged=false, Latitude=51.10211903770601, Longitude=3.70395105082449},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-06-02 10:30:00"), Photo="https://i.ibb.co/qC8VRw9/weather.png", IsSolved=true, IsFlagged=false, Latitude=51.25797530607078, Longitude=4.2029078272453955, Comment = "Collaborated with engineering team to plan long-term repairs."},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-01-28 18:45:00"), Photo="https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved=false, IsFlagged=true, Latitude=50.606866802736135, Longitude=3.504373428574992},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-11-25 07:12:00"), Photo="https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved=true, IsFlagged=false, Latitude=51.080365443897826, Longitude=3.502552851081846},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-05-16 13:38:00"), Photo="https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved=false, IsFlagged=false, Latitude=50.82851012796444, Longitude=4.324562039901935},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-04-15 14:20:00"), Photo = "https://i.ibb.co/qC8VRw9/weather.png", IsSolved = true, IsFlagged = false, Latitude = 51.300341027026285, Longitude = 4.3607161762216275, Comment = "Conducted thorough inspection of the affected train infrastructure."},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-07-08 11:45:00"), Photo = "https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved = false, IsFlagged = true, Latitude = 50.32854634047934, Longitude = 4.404590193315715},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-09-20 18:30:00"), Photo = "https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved = false, IsFlagged = false, Latitude = 51.26468804072209, Longitude = 4.381035374188951},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-05-05 06:40:00"), Photo = "https://i.ibb.co/qC8VRw9/weather.png", IsSolved = false, IsFlagged = true, Latitude = 50.59714427501085, Longitude = 5.471423425220722},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-12-18 16:50:00"), Photo = "https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved = false, IsFlagged = false, Latitude = 51.29737645422704, Longitude = 4.374724191357244},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-02-28 12:05:00"), Photo = "https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved = true, IsFlagged = false, Latitude = 50.89190625378278, Longitude = 3.864866053041805, Comment = "Coordinated with local authorities for traffic management."},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-08-22 03:30:00"), Photo = "https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved = false, IsFlagged = true, Latitude = 50.60541012315157, Longitude = 5.567013543893675},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2024-01-05 21:20:00"), Photo = "https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved = false, IsFlagged = false, Latitude = 51.001201549057086, Longitude = 4.998294080280826},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-06-11 08:10:00"), Photo = "https://i.ibb.co/qC8VRw9/weather.png", IsSolved = true, IsFlagged = false, Latitude = 51.285930615078655, Longitude = 4.353457046277687, Comment = "Initiated emergency repairs to ensure uninterrupted train services."},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-04-03 14:45:00"), Photo = "https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved = false, IsFlagged = true, Latitude = 51.21046351857441, Longitude = 4.283851476877017},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-11-30 19:35:00"), Photo = "https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved = false, IsFlagged = false, Latitude = 50.53889101614782, Longitude = 4.1864518231351},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-03-17 22:00:00"), Photo = "https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved = true, IsFlagged = false, Latitude = 50.35751459185149, Longitude = 5.036664766873056, Comment = "Executed maintenance tasks to address the reported anomaly."},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-09-08 05:15:00"), Photo = "https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved = false, IsFlagged = true, Latitude = 50.12410038589318, Longitude = 5.282570970927175},
                    new Anomaly(){AnomalyTypeId = 2, TimeStamp = ParseUtc("2023-07-25 10:30:00"), Photo = "https://i.ibb.co/qC8VRw9/weather.png", IsSolved = false, IsFlagged = false, Latitude = 50.82412187366853, Longitude = 4.319359912236561},
                    new Anomaly(){AnomalyTypeId = 4, TimeStamp = ParseUtc("2023-10-14 17:50:00"), Photo = "https://i.ibb.co/ws9XYdF/track-infrastructure.png", IsSolved = true, IsFlagged = false, Latitude = 50.83727185870428, Longitude = 4.338592444708221, Comment = "Verified the reported obstruction and cleared the track."},
                    new Anomaly(){AnomalyTypeId = 1, TimeStamp = ParseUtc("2023-05-30 13:25:00"), Photo = "https://i.ibb.co/SVzPDsV/vegetation-overgrowth.png", IsSolved = false, IsFlagged = true, Latitude = 50.43833821057946, Longitude = 4.392522965936162},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-12-02 20:15:00"), Photo = "https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved = false, IsFlagged = false, Latitude = 51.15352212195077, Longitude = 3.7473573623737195},
                    new Anomaly(){AnomalyTypeId = 5, TimeStamp = ParseUtc("2023-02-10 09:40:00"), Photo = "https://i.ibb.co/HTVDL0T/tunnel-damage.jpg", IsSolved = true, IsFlagged = false, Latitude = 50.467587503565106, Longitude = 4.904570436525707, Comment = "Communicated with affected train operators for rerouting."},
                    new Anomaly(){AnomalyTypeId = 3, TimeStamp = ParseUtc("2023-05-12 14:30:00"), Photo = "https://i.ibb.co/0GF2PHv/track-deviation.png", IsSolved = false, IsFlagged = true, Latitude = 50.77501538159256, Longitude = 4.43924178695387},


                };

                foreach (Anomaly a in anomalies)
                {
                    context.Anomalies.Add(a);
                }
                context.SaveChanges();
            }

            // Create dummy data for the asset types
            if (!context.AssetTypes.Any())
            {
                var assettypes = new AssetType[]
                {
                new AssetType { Name = "Stoplight" },
                new AssetType { Name = "Announcement beacon" },
                new AssetType { Name = "Kilometer pole" },
                new AssetType { Name = "Triangular announcement sign" },
               };

                foreach (AssetType a in assettypes)
                {
                    context.AssetTypes.Add(a);
                }

                context.SaveChanges();
            }

            // Create dummy data for the assets
            if (!context.Assets.Any())
            {
                context.Database.EnsureCreated();

                var assets = new Asset[]
                {
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-01-17 15:00:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude=50.870105353376104, Longitude=4.368645769919571},
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-01-17 17:00:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude=50.44955816988471, Longitude=4.489123228125461 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-01-16 15:00:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude=50.851086114067236, Longitude=5.234467645818389 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2023-01-16 15:00:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=false, Latitude=50.988599116013724, Longitude=4.826837048286648 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-05-21 10:30:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 51.220060929739496, Longitude = 5.2505401669938373 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-07-12 14:45:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=true,  Latitude = 50.791078118364865, Longitude = 3.6156031201261896 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2023-09-02 09:15:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=false, Latitude = 50.81311626794304, Longitude = 3.236884133468954 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-10-18 18:20:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude = 50.45328734425108, Longitude = 5.726642355893542 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-11-05 12:30:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 50.606293959146136, Longitude = 5.568392692588471 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-11-20 16:45:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 50.610660297116084, Longitude = 5.5818748642527325 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-12-07 08:10:00"), Photo="https://i.ibb.co/ZNHgrSS/rectangular-sign.jpg", IsFlagged=false, Latitude = 50.87943706062829, Longitude = 4.411512859144152 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2024-01-05 14:00:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=false, Latitude = 50.68297199906759, Longitude = 4.189195314045881 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2024-01-22 11:45:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 49.55844514080527, Longitude = 5.825657700203637 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2024-01-28 17:30:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 51.29051551669275, Longitude = 4.354254394110281 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-03-14 08:45:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude = 50.89134655079725, Longitude = 4.410132683639211 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2023-04-25 13:20:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=false, Latitude = 50.82142492334715, Longitude = 4.823114435289133 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-06-09 16:30:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 51.13556586791714, Longitude = 3.649526979851878  },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-08-03 11:15:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 50.90115202270448, Longitude = 4.710791191763958 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-09-19 14:50:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 50.86279638198538, Longitude = 4.362863751627966 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2023-10-22 09:00:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=true, Latitude = 51.290780872865575, Longitude = 4.395769740651066 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-11-11 12:45:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude = 51.27082051220256, Longitude = 4.276851264087476 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-12-05 17:10:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 51.195204708144985, Longitude = 4.3673890210404025 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2024-01-09 10:30:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 50.819689932590194, Longitude = 4.316168093724415 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2024-01-27 14:15:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude = 50.45585257803365, Longitude = 4.825489335903817 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-03-28 09:30:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 50.567076653404136, Longitude = 5.756529232040205 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-05-15 15:20:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 51.211081948327774, Longitude = 4.422704672208247 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2023-07-02 11:45:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=false, Latitude = 50.40003270883759, Longitude = 4.45533174275212 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-08-19 14:10:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude = 51.2700270182381, Longitude = 3.204586514800804 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2023-09-28 17:30:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 50.66435364467416, Longitude = 4.372639329669036 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2023-11-14 10:45:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=true, Latitude = 51.30473610682347, Longitude = 3.1917087437136296 },
                    new Asset(){AssetTypeId = 2, TimeStamp = ParseUtc("2023-12-10 13:15:00"), Photo="https://i.ibb.co/Gp4Dk7w/rectangular-sign.jpg", IsFlagged=false, Latitude = 50.60539895397002, Longitude = 5.554288875988638 },
                    new Asset(){AssetTypeId = 4, TimeStamp = ParseUtc("2024-01-04 16:40:00"), Photo="https://i.ibb.co/bzs87hM/triangular-sign.jpg", IsFlagged=false, Latitude = 51.223982831046854, Longitude = 4.441183885277723 },
                    new Asset(){AssetTypeId = 1, TimeStamp = ParseUtc("2024-01-19 09:00:00"), Photo="https://i.ibb.co/ZNHgrSS/stoplight.jpg", IsFlagged=false, Latitude = 51.25668814537448, Longitude = 4.38267491935946 },
                    new Asset(){AssetTypeId = 3, TimeStamp = ParseUtc("2024-01-29 14:25:00"), Photo="https://i.ibb.co/XJGY9D1/kilometer-pole.jpg", IsFlagged=false, Latitude = 50.63971254710622, Longitude = 4.359712059022106 },
                };

                foreach (Asset a in assets)
                {
                    context.Assets.Add(a);
                }
                context.SaveChanges();
            }

        }



        // Function to convert DateTimes to a format that postgres can use
        public static DateTime ParseUtc(string dateTimeString)
        {
            return DateTime.SpecifyKind(DateTime.Parse(dateTimeString), DateTimeKind.Utc);
        }
    }
}

