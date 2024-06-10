using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using AnomalyTrackerBackend.API.Dto;
using AnomalyTrackerBackend.DAL;
using AnomalyTrackerBackend.DAL.Entity;
using AutoMapper;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;
using AnomalyTrackerBackend.DAL.Initializer;
using System.Globalization;

namespace AnomalyTrackerBackend.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AnomalyController : Controller
    {
        private readonly AnomalyTrackerDbContext _context;
        private readonly IMapper _mapper;

        public AnomalyController(AnomalyTrackerDbContext context, IMapper mapper)
        {
            _context = context;
            _mapper = mapper;
        }

        // Get Anomalies
        [HttpGet]
        public async Task<ActionResult<List<GetAnomalyDto>>> GetAnomalies()
        {
            var anomalies = await _context.Anomalies
                .Include(a => a.AnomalyType)
                .ToListAsync();

            if (anomalies == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetAnomalyDto>>(anomalies);
        }

        // Get anomaly with ID
        [HttpGet("{id}")]
        public async Task<ActionResult<GetAnomalyDto>> GetAnomaly(int id)
        {
            var anomaly = await _context.Anomalies
                    .Include(a => a.AnomalyType)
                    .SingleAsync(a => a.Id == id);

            if (anomaly == null)
            {
                return NotFound();
            }

            return _mapper.Map<GetAnomalyDto>(anomaly);
        }

        // Get Anomalytypes
        [HttpGet("anomalytypes")]
        public async Task<ActionResult<List<GetAnomalyTypeDto>>> GetAnomalyTypes()
        {
            var anomalyTypes = await _context.AnomalyTypes.ToListAsync();

            if (anomalyTypes == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetAnomalyTypeDto>>(anomalyTypes);
        }

        // Get enum of severities
        [HttpGet("enum/severity")]
        public ActionResult<IEnumerable<string>> GetSeverityEnumerations()
        {
            var severityEnumerations = Enum.GetNames(typeof(Severity));
            return Ok(severityEnumerations);
        }

        // Filter on anomaly 
        [HttpGet("filteranomaly")]
        public async Task<ActionResult<List<GetAnomalyDto>>> GetFilterAnomalies(
            string? anomalyTypes = null,
            string? anomalyStatus = null, 
            string? selectedFlag = null, 
            string? selectedSeverities = null, 
            bool anomalyFlag = false,
            bool selectedDateSorting = true,
            DateTime? selectedStartDate = null, 
            DateTime? selectedEndDate = null)
        {
            // make a list of the string that is reiceved by splitsing it based on the ','
            List<string> anomalyTypesList = !string.IsNullOrEmpty(anomalyTypes) ? anomalyTypes.Split(',').ToList() : null;
            List<string> selectedSeveritiesList = !string.IsNullOrEmpty(selectedSeverities) ? selectedSeverities.Split(',').ToList() : null;

            var anomalies = await _context.Anomalies
                .Include(a => a.AnomalyType)
                // default orders the anomalies from highest level to lowest level
                .OrderByDescending(a => a.AnomalyType.Level)
                .ToListAsync();

            // anomalies are sorted by date
            if (selectedDateSorting)
            {
                anomalies = anomalies
                    .OrderByDescending(a => a.TimeStamp)
                    .ToList();
            }
            else
            {
                anomalies = anomalies
                    .OrderBy(a => a.TimeStamp)
                    .ToList();
            }

            // if a startdate is selected, it will return only the anomalies detected after this date
            if (selectedStartDate != null)
            {
                DateTimeOffset utcStartDateTime = TimeZoneInfo.ConvertTimeToUtc((DateTime)selectedStartDate.Value);
                anomalies = anomalies
                    .Where(a => a.TimeStamp >= utcStartDateTime)
                    .ToList();
            }

            // if an enddate is selected, it will return only the anomalies detected before this date
            if (selectedEndDate != null)
            {
                DateTimeOffset utcEndDateTime = TimeZoneInfo.ConvertTimeToUtc((DateTime)selectedEndDate.Value);
                anomalies = anomalies
                    .Where(a => a.TimeStamp <= utcEndDateTime.AddDays(1).AddTicks(-1))
                    .ToList();
            }

            // filter the anomalies on their status: false, true or all(true and false)
            if (anomalyStatus == "false")
            {
                anomalies = anomalies.Where(a => a.IsSolved == false).ToList();
            }

            if (anomalyStatus == "true")
            {
                anomalies = anomalies.Where(a => a.IsSolved == true).ToList();
            }

            if (anomalyStatus == "all")
            {
                anomalies = anomalies.ToList();
            }

            // filter the anomalies on their flag status: false, true or all(true and false)
            if (selectedFlag == "false")
            {
                anomalies = anomalies.Where(a => a.IsFlagged == false).ToList();
            }

            if (selectedFlag == "true")
            {
                anomalies = anomalies.Where(a => a.IsFlagged == true).ToList();
            }

            if (selectedFlag == "all")
            {
                anomalies = anomalies.ToList();
            }

            // filter the anomalies on the types from the list
            if (anomalyTypes != null && anomalyTypes.Any())
            {
                anomalies = anomalies
                    .Where(a => anomalyTypes.Contains(a.AnomalyType.Name))
                    .ToList();
            }

            // filter the anomalies on the severities from the list
            if (selectedSeverities != null && selectedSeverities.Any())
            {
                anomalies = anomalies
                    .Where(a => selectedSeverities.Contains(a.AnomalyType.Level.ToString()))
                    .ToList();
            }

            if (anomalies == null)
            {
                return NotFound();
            }

            return _mapper.Map<List<GetAnomalyDto>>(anomalies);
        }

        [HttpPatch("{id}")]
        public async Task<ActionResult<GetAnomalyDto>> UpdateAnomaly(int id, [FromBody] UpdateAnomalyDto updateAnomalyDto)
        {
            var anomaly = await _context.Anomalies.FindAsync(id);
            if (anomaly == null)
            {
                return NotFound();
            }

            // Ensure that IsSolved and IsFlagged cannot both be true
            if (updateAnomalyDto.IsSolved && updateAnomalyDto.IsFlagged)
            {
                ModelState.AddModelError(nameof(updateAnomalyDto.IsFlagged), "IsSolved and IsFlagged cannot both be true.");
                return BadRequest(ModelState);
            }

            anomaly.IsSolved = updateAnomalyDto.IsSolved;
            anomaly.IsFlagged = updateAnomalyDto.IsFlagged;
            anomaly.Comment = updateAnomalyDto.Comment;

            _context.Entry(anomaly).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                return NotFound();
            }

            return _mapper.Map<GetAnomalyDto>(anomaly);
        }
    }
}
