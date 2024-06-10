import React, { useState } from 'react';
import moment from 'moment';
import './assetsList.css';
import useGetAllAssets from '../../hooks/use_get_all_assets';
import { FadeLoader } from 'react-spinners';
import { useRecoilState } from 'recoil';
import { mapZoom } from '../../store/store';
import { latLong } from '../../store/store';
import { assetDateSorting } from '../../store/store';
import announcement_beacon from '../../assets/images/announcement_beacon.png';
import kilometer_sign from '../../assets/images/kilometer_sign.png';
import triangle_sign from '../../assets/images/triangle_sign.png';
import traffic_light from '../../assets/images/traffic_light.png';
// change the timeformat
function formatTime(timestamp) {
  const formattedTime = moment(timestamp).format('DD/MM/YYYY<br/>hh:mm:ss');

  return (
    <div dangerouslySetInnerHTML={{ __html: formattedTime }} />
  );
}

function List({ assets }) {
  const [, setZoom] = useRecoilState(mapZoom);
  const [, setLongLang] = useRecoilState(latLong);
  const [extremeDropdownVisible, setExtremeDropdownVisible] = useState(false);
  const [highDropdownVisible, setHighDropdownVisible] = useState(false);
  const [mediumDropdownVisible, setMediumDropdownVisible] = useState(false);
  const [lowDropdownVisible, setLowDropdownVisible] = useState(false);
  const [dateDescending, setDateDescending] = useRecoilState(assetDateSorting);

  // seperate the assets based on type
  const stoplightassets = assets.filter((asset) => asset.assetType.name === 'Stoplight');
  const announcementassets = assets.filter((asset) => asset.assetType.name === 'Announcement beacon');
  const kilometerassets = assets.filter((asset) => asset.assetType.name === 'Kilometer pole');
  const triangularassets = assets.filter((asset) => asset.assetType.name === 'Triangular announcement sign');
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
  // change sorting order based on date
  const setSortOrder = () => {
    setDateDescending(!dateDescending);
  };

  return (
    <>
    <div className='anomalyList'>
    <div className='sort-button' onClick={setSortOrder}>
      Sort by Date {dateDescending === true ? '▼' : '▲'}
    </div>
        {assets.length === 0 ? (
          <p>No anomalies found.</p>
        ) : (
          <>
            {/* Stoplight  */}
            {stoplightassets.length === 0 ? (
              <span></span>
            ) : (
              <div style={{ width: '100%' }}>
                <div onClick={toggleExtremeDropdown} className='severity-dropdown'>
                  <span>Stoplight</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {extremeDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {stoplightassets.map((asset) => (
                      <li key={asset.id} onClick={() => getCordinatesToMap({ asset, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: '#4F6B9B' }}>
                              <img src={traffic_light} alt="traffic light" className="severity-image" />
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(asset.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
            {/* Announcement beacon */}
            {announcementassets.length === 0 ? (
              <span></span>
            ) : (
              <div>
                <div onClick={toggleHighDropdown} className='severity-dropdown'>
                  <span>Announcement beacon</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {highDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {announcementassets.map((asset) => (
                      <li key={asset.id} onClick={() => getCordinatesToMap({ asset, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: '#4F6B9B' }}>
                              <img src={announcement_beacon} alt="announcement beacon" className="severity-image" />
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(asset.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
            {/* Kilometer pole  */}
            {kilometerassets.length === 0 ? (
              <span></span>
            ) : (
              <div>
                <div onClick={toggleMediumDropdown} className='severity-dropdown'>
                  <span>Kilometer pole</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {mediumDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {kilometerassets.map((asset) => (
                      <li key={asset.id} onClick={() => getCordinatesToMap({ asset, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: '#4F6B9B' }}>
                              <img src={kilometer_sign} alt="kilometer sign" className="severity-image" />
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(asset.timeStamp)}</span>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>)}
            {/* Triangular announcement sign */}
            {triangularassets.length === 0 ? (
              <span></span>
            ) : (
              <div>
                <div onClick={toggleLowDropdown} className='severity-dropdown'>
                  <span>Triangular announcement sign</span>
                  <span><i className="fa-solid fa-caret-down"></i></span>
                </div>
                {lowDropdownVisible && (
                  <ul style={{ listStyleType: 'none', padding: 0 }}>
                    {triangularassets.map((asset) => (
                      <li key={asset.id} onClick={() => getCordinatesToMap({ asset, setZoom, setLongLang })} className='anomalyList'>
                        <div className="severity">
                          <div className="severity-circle" style={{ backgroundColor: '#4F6B9B' }}>
                              <img src={triangle_sign} alt="triangle sign" className="severity-image" />
                          </div>
                          <span style={{ marginLeft: '2rem' }}>{formatTime(asset.timeStamp)}</span>
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
// zooming in on asset when clicked in list
function getCordinatesToMap({asset, setZoom, setLongLang}) {
  setZoom(13);
  setLongLang([asset.latitude, asset.longitude])
}

export default function AnomaliesList() {
  const {
    assets,
    loading,
  } = useGetAllAssets();

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
         <List assets={assets}/>
      )}
  </div>
  );
};
