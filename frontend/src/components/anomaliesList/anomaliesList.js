import React, { useState } from 'react';
import moment from 'moment';
import './anomaliesList.css';
import useGetAllAnomalies from '../../hooks/use_get_all_anomalies';
import { FadeLoader } from 'react-spinners';
import { useRecoilState } from 'recoil';
import { mapZoom } from '../../store/store';
import { latLong } from '../../store/store';
import { dateSorting } from '../../store/store';
import vegetation_marker from '../../assets/images/vegetation_marker.png';
import weather_marker from '../../assets/images/weather_marker.png';
import track_deviation_marker from '../../assets/images/track_deviation_marker.png';
import track_infrastructure_marker from '../../assets/images/track_infrastructure_marker.png';
import tunnel_damage_marker from '../../assets/images/tunnel_damage_marker.png';

function getSeverityColor(severityLevel) {
  switch (severityLevel) {
    case 'Low':
      return 'green';
    case 'Medium':
      return 'yellow';
    case 'High':
      return 'orange';
    case 'Extreme':
      return 'red';
    default:
      return 'green';
  }
};

// change the timeformat
function formatTime(timestamp) {
  const formattedTime = moment(timestamp).format('DD/MM/YYYY<br/>hh:mm:ss');

  return (
    <div dangerouslySetInnerHTML={{ __html: formattedTime }} />
  );
}

function List({ anomalies }) {
  const [, setZoom] = useRecoilState(mapZoom);
  const [, setLongLang] = useRecoilState(latLong);
  const [extremeDropdownVisible, setExtremeDropdownVisible] = useState(false);
  const [highDropdownVisible, setHighDropdownVisible] = useState(false);
  const [mediumDropdownVisible, setMediumDropdownVisible] = useState(false);
  const [lowDropdownVisible, setLowDropdownVisible] = useState(false);
  const [dateDescending, setDateDescending] = useRecoilState(dateSorting);

  // seperate the anomalies based on severitylevel
  const extremeAnomalies = anomalies.filter((anomaly) => anomaly.anomalyType.level === 'Extreme');
  const highAnomalies = anomalies.filter((anomaly) => anomaly.anomalyType.level === 'High');
  const mediumAnomalies = anomalies.filter((anomaly) => anomaly.anomalyType.level === 'Medium');
  const lowAnomalies = anomalies.filter((anomaly) => anomaly.anomalyType.level === 'Low');

  // when clicking the dropdown the status, open or closed, becomes the opposite
  const toggleExtremeDropdown = () => {
    setExtremeDropdownVisible(!extremeDropdownVisible);
  };

  const toggleHighDropdown = () => {
    setHighDropdownVisible(!highDropdownVisible);
  };

  const toggleMediumDropdown = () => {
    setMediumDropdownVisible(!mediumDropdownVisible);
  };

  const toggleLowDropdown = () => {
    setLowDropdownVisible(!lowDropdownVisible);
  };
  //change sorting order based on date
  const setSortOrder = () => {
    setDateDescending(!dateDescending);
  };

  return (
    <>
    <div className='anomalyList'>
    <div className='sort-button' onClick={setSortOrder}>
      Sort by Date {dateDescending === true ? '▼' : '▲'}
    </div>
        {anomalies.length === 0 ? (
          <p>No anomalies found.</p>
        ) : (
          <>
            {/* extreme  */}
            {extremeAnomalies.length === 0 ? (
              <span></span>
            ) : (
              <div style={{ width: '100%' }}>
                <div onClick={toggleExtremeDropdown} className='severity-dropdown'>
                  <span>Extreme severity</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {extremeDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {extremeAnomalies.map((anomaly) => (
                      <li key={anomaly.id} onClick={() => getCordinatesToMap({ anomaly, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: getSeverityColor(anomaly.anomalyType.level) }}>
                            {anomaly.anomalyType.name === 'Vegetation overgrowth' ? (
                              <img src={vegetation_marker} alt="vegetation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Weather' ? (
                              <img src={weather_marker} alt="weather_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track deviation' ? (
                              <img src={track_deviation_marker} alt="track_deviation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track infrastructure' ? (
                              <img src={track_infrastructure_marker} alt="track_infrastructure_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Tunnel damage' ? (
                              <img src={tunnel_damage_marker} alt="tunnel_damage_marker" className="severity-image" />
                            ) : (<div></div>)}
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(anomaly.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
            {/* high  */}
            {highAnomalies.length === 0 ? (
              <span></span>
            ) : (
              <div>
                <div onClick={toggleHighDropdown} className='severity-dropdown'>
                  <span>High severity</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {highDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {highAnomalies.map((anomaly) => (
                      <li key={anomaly.id} onClick={() => getCordinatesToMap({ anomaly, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: getSeverityColor(anomaly.anomalyType.level) }}>
                            {anomaly.anomalyType.name === 'Vegetation overgrowth' ? (
                              <img src={vegetation_marker} alt="vegetation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Weather' ? (
                              <img src={weather_marker} alt="weather_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track deviation' ? (
                              <img src={track_deviation_marker} alt="track_deviation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track infrastructure' ? (
                              <img src={track_infrastructure_marker} alt="track_infrastructure_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Tunnel damage' ? (
                              <img src={tunnel_damage_marker} alt="tunnel_damage_marker" className="severity-image" />
                            ) : (<div></div>)}
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(anomaly.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
            {/* Medium  */}
            {mediumAnomalies.length === 0 ? (
              <span></span>
            ) : (
              <div>
                <div onClick={toggleMediumDropdown} className='severity-dropdown'>
                  <span>Medium severity</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {mediumDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {mediumAnomalies.map((anomaly) => (
                      <li key={anomaly.id} onClick={() => getCordinatesToMap({ anomaly, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: getSeverityColor(anomaly.anomalyType.level) }}>
                            {anomaly.anomalyType.name === 'Vegetation overgrowth' ? (
                              <img src={vegetation_marker} alt="vegetation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Weather' ? (
                              <img src={weather_marker} alt="weather_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track deviation' ? (
                              <img src={track_deviation_marker} alt="track_deviation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track infrastructure' ? (
                              <img src={track_infrastructure_marker} alt="track_infrastructure_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Tunnel damage' ? (
                              <img src={tunnel_damage_marker} alt="tunnel_damage_marker" className="severity-image" />
                            ) : (<div></div>)}
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(anomaly.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
            {/* low  */}
            {lowAnomalies.length === 0 ? (
              <span></span>
            ) : (
              <div>
                <div onClick={toggleLowDropdown} className='severity-dropdown'>
                  <span>Low severity</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {lowDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {lowAnomalies.map((anomaly) => (
                      <li key={anomaly.id} onClick={() => getCordinatesToMap({ anomaly, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: getSeverityColor(anomaly.anomalyType.level) }}>
                            {anomaly.anomalyType.name === 'Vegetation overgrowth' ? (
                              <img src={vegetation_marker} alt="vegetation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Weather' ? (
                              <img src={weather_marker} alt="weather_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track deviation' ? (
                              <img src={track_deviation_marker} alt="track_deviation_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Track infrastructure' ? (
                              <img src={track_infrastructure_marker} alt="track_infrastructure_marker" className="severity-image" />
                            ) : anomaly.anomalyType.name === 'Tunnel damage' ? (
                              <img src={tunnel_damage_marker} alt="tunnel_damage_marker" className="severity-image" />
                            ) : (<div></div>)}
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(anomaly.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
          </>
        )}
      </div></>
  );
}
// zooming in on anomaly when clicked in list
function getCordinatesToMap({anomaly, setZoom, setLongLang}) {
  setZoom(13);
  setLongLang([anomaly.latitude, anomaly.longitude])
}

export default function AnomaliesList() {
  const {
    anomalies,
    loading,
  } = useGetAllAnomalies();

  return ( 
    <div className='anomalieslist'>
      {loading && (
        <div className='center'>
          <FadeLoader 
            size={20}
            loading={true}
          />
        </div>
      )}
      {!loading && (
         <List anomalies={anomalies}/>
      )}
  </div>
  );
};
