import React from 'react';
import './statisticsGraphs.css';
import useGetAllAnomaliesStatistics from '../../hooks/use_get_all_anomalies_statistics';
import { FadeLoader } from 'react-spinners';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Line, ComposedChart, PieChart, Pie, Cell } from 'recharts';
import { useState } from 'react';



const monthNames = [
  'jan', 'feb', 'mar', 'apr', 'may', 'jun', 'jul', 'aug', 'sep', 'oct', 'nov', 'dec'
];

function FalsePositivesPerMonthChart({ anomalies }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const filteredAnomalies = anomalies.filter((anomaly) => anomaly.isFlagged);

  // Group anomalies by month and count occurrences
  const data = filteredAnomalies.reduce((acc, anomaly) => {
    const year = new Date(anomaly.timeStamp).getFullYear();
    if (!selectedYear || year === selectedYear) {
      const month = new Date(anomaly.timeStamp).getMonth(); // Month is 0-indexed
      const monthKey = `${month}`;
      acc[monthKey] = (acc[monthKey] || 0) + 1;
    }
    return acc;
  }, {});

  // Ensure all months have a corresponding entry, with a count of 0 if no data
  for (let i = 0; i < 12; i++) {
    const monthKey = `${i}`;
    if (!data[monthKey]) {
      data[monthKey] = 0
    }
  }

  // Convert data to an array of objects for Recharts
  const chartData = Object.keys(data).map((monthKey) => ({
    month: monthNames[parseInt(monthKey, 10)],
    count: data[monthKey],
  }));

  const uniqueYears = Array.from(
    new Set(anomalies.map((anomaly) => new Date(anomaly.timeStamp).getFullYear()))
  );


  return (
    <div className="chart">
      <h2>Amount of flags</h2>
      <label htmlFor="yearFilter">Select Year: </label>
      <select
        id="yearFilter"
        className="yearfilter"
        onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null)}
        value={selectedYear || ''}
      >
        <option value="">All Years</option>
        {uniqueYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <BarChart width={650} height={300} data={chartData}>
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="month" />
      <YAxis />
      <Tooltip />
      <Bar dataKey="count" fill="#4F6B9B" />
    </BarChart>
    </div>
  );
}


function AnomalyPerTypeBarChart({ anomalies }) {
  const calculateCasesPerType = () => {
    const casesPerType = {};

    anomalies.forEach(anomaly => {
      const { anomalyType } = anomaly;
      const typeName = anomalyType.name;
      casesPerType[typeName] = (casesPerType[typeName] || 0) + 1;
    });

    return Object.keys(casesPerType).map(typeName => ({
      typeName,
      count: casesPerType[typeName],
    }));
  };

  const data = calculateCasesPerType();

  const maxYValue = Math.max(...data.map(entry => entry.count));
  return (
    <div className="chart">
      <h2>Amount per anomaly type</h2>
      <BarChart width={650} height={300} data={data}>
        <CartesianGrid strokeDasharray='3 3'/>
        <XAxis dataKey='typeName' type="category" />
        <YAxis
          domain={[0, maxYValue + 1]}
        />
        <Tooltip />
        <Bar dataKey='count' fill='#4F6B9B' />
      </BarChart>
    </div>
  );
}

function ProblemsVsFixedProblemsBarChart({ anomalies }) {
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  // Calculate counts for isSolved and isNotSolved anomalies for each month
  const data = anomalies.reduce((acc, anomaly) => {
    const year = new Date(anomaly.timeStamp).getFullYear();
    if (!selectedYear || year === selectedYear) {
      const month = new Date(anomaly.timeStamp).getMonth(); // Month is 0-indexed
      const monthKey = `${month}`;
      acc[monthKey] = acc[monthKey] || {isSolved: 0, total: 0};
      if (anomaly.isSolved) {
        acc[monthKey].isSolved += 1;
        acc[monthKey].total += 1;
      } else {
        acc[monthKey].total += 1;
      }
    }
    return acc;
  }, {});

  // Ensure all months have a corresponding entry, with a count of 0 if no data
  for (let i = 0; i < 12; i++) {
    const monthKey = `${i}`;
    if (!data[monthKey]) {
      data[monthKey] = { isSolved: 0, total: 0 };
    }
  }

  // Convert data to an array of objects for Recharts
  const chartData = Object.keys(data).map((monthKey) => ({
    month: monthNames[parseInt(monthKey, 10)],
    isSolved: data[monthKey].isSolved,
    total: data[monthKey].total,
  }));

  const uniqueYears = Array.from(
    new Set(anomalies.map((anomaly) => new Date(anomaly.timeStamp).getFullYear()))
  );


  return (
    <div className="chart">
      <h2>Anomalies Count by Month</h2>
      <label htmlFor="yearFilter">Select Year: </label>
      <select
        id="yearFilter"
        className = "yearfilter"
        onChange={(e) => setSelectedYear(e.target.value ? parseInt(e.target.value, 10) : null)}
        value={selectedYear || ''}
      >
        <option value="">All Years</option>
        {uniqueYears.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
      <ComposedChart width={650} height={300} data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="month" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Bar dataKey="total" fill="#4F6B9B" />
        <Line type="monotone" dataKey="isSolved" stroke="#66A5AD" />
      </ComposedChart>
    </div>
  );
}

function AnomalyStatusPieChart({ anomalies }) {
  // Count the number of unsolved and unflagged, flagged, and solved anomalies
  const countByStatus = anomalies.reduce((acc, anomaly) => {
    if (anomaly.isSolved) {
      acc.solved += 1
    } else if (anomaly.isFlagged) {
      acc.flagged += 1;
    } else {
      acc.unsolvedUnflagged += 1;
    }
    return acc;
  }, { unsolvedUnflagged: 0, flagged: 0, solved: 0 });

  const data = [
    { name: 'Unsolved', value: countByStatus.unsolvedUnflagged, color: '#4F6B9B'  },
    { name: 'Flagged', value: countByStatus.flagged, color: '#66A5AD' },
    { name: 'Solved', value: countByStatus.solved, color: '#B6D4E0' },
  ];

  return (
    <div className="chart">
      <h2>Anomaly Status</h2>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

function AnomalySeverityPieChart({ anomalies }) {
  // Count the number of each severity level
  const countBySeverity = anomalies.reduce((acc, anomaly) => {
    const severityLevel = anomaly.anomalyType.level || 'Unknown';
    acc[severityLevel] = (acc[severityLevel] || 0) + 1;
    return acc;
  }, {});

  const data = Object.keys(countBySeverity).map(severityLevel => ({
    name: severityLevel,
    value: countBySeverity[severityLevel],
    color: getColorForSeverity(severityLevel),
  }));

  function getColorForSeverity(severityLevel) {
    switch (severityLevel.toLowerCase()) {
      case 'low':
        return '#00A651';
      case 'medium':
        return '#FFD700';
      case 'high':
        return '#FF8C00';
      case 'extreme':
        return '#FF0000'
      default:
        return '#CCCCCC'; // Default color for unknown or undefined severity
    }
  }

  return (
    <div className="chart">
      <h2>Anomaly Severities</h2>
      <PieChart width={400} height={300}>
        <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} label fill="#8884d8">
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.color} />
          ))}
        </Pie>
        <Tooltip />
        <Legend />
      </PieChart>
    </div>
  );
}

export default function StatisticsGraphs() {
  const {
    anomalies,
    loading,
  } = useGetAllAnomaliesStatistics();

  return ( 
    <div>
      {loading && (
        <div className='center'>
          <FadeLoader 
            size={20}
            loading={true}
          />
        </div>
      )}
      {!loading && (
         <div className='charts'>
          <AnomalySeverityPieChart anomalies={ anomalies } />
          <ProblemsVsFixedProblemsBarChart anomalies={ anomalies } />
          <AnomalyStatusPieChart anomalies={ anomalies } />
          <AnomalyPerTypeBarChart anomalies={ anomalies } />
          <FalsePositivesPerMonthChart anomalies={ anomalies } />
         </div>
      )}
  </div>
  );
};