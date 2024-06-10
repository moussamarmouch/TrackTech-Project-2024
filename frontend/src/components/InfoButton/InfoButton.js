import './InfoButton.css';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import vegetation_marker from '../../assets/images/vegetation_marker.png';
import weather_marker from '../../assets/images/weather_marker.png';
import track_deviation_marker from '../../assets/images/track_deviation_marker.png';
import track_infrastructure_marker from '../../assets/images/track_infrastructure_marker.png';
import tunnel_damage_marker from '../../assets/images/tunnel_damage_marker.png';
import announcement_beacon from '../../assets/images/announcement_beacon.png';
import kilometer_sign from '../../assets/images/kilometer_sign.png';
import triangle_sign from '../../assets/images/triangle_sign.png';
import traffic_light from '../../assets/images/traffic_light.png';
import { useRecoilValue } from 'recoil';
import { setHeatMap } from '../../store/store';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #333',
    zIndex: 9999,
  },
  overlay: {
    zIndex: 9997,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
};

Modal.setAppElement(document.getElementById('root'));

function Header({closeModal}) {
  return (
    <div className='header'>
      <div className='left'>
        <i className="fa-solid fa-circle-info fa-3x icon"></i>
        &nbsp;
        <span className='text'>Info</span>
      </div>
      <div className='right'>
        <span
          onClick={closeModal}
          className='button'>
          <i className="fa-solid fa-x"></i>
        </span>
      </div>
    </div>
  );
}

// Title changes dynamically based on which page is open
function Title({name}){
  return (
    <div className='title'>
      <span className='titleText'>{name}</span>
    </div>
  );
}

// different body depending on the type or if it is the assetmap
function Body({ type, isassetMap }) {
  return (
        <>
        <div style={{...(type && {display: 'flex', justifyContent: 'space-evenly', alignItems: 'flex-start'})}}>
        <div className='bolls'>
          <div className='body'>
            <div className='red-circle'></div>
            <span className='text'>Extreme</span>
          </div>
          <div className='body'>
            <div className='orange-circle'></div>
            <span className='text'>High</span>
          </div>
          <div className='body'>
            <div className='yellow-circle'></div>
            <span className='text'>Moderate</span>
          </div>
          <div className='body'>
            <div className='green-circle'></div>
            <span className='text'>Low</span>
          </div>
        </div>
        {type && ( 
        <div className='squares'>
        <div className='body'>
            <div className='red-rectangle'></div>
            <span className='text'>&gt; 10 cases</span>
          </div>
          <div className='body'>
            <div className='yellow-rectangle'></div>
            <span className='text'>3-10 cases</span>
          </div>
          <div className='body'>
            <div className='green-rectangle'></div>
            <span className='text'>&lt; 3 cases</span>
          </div>
        </div>
        )}
        </div>
          <hr></hr>
          <div className='title'>
            <span className='titleText'>Icons</span>
          </div>
          <hr></hr>
          {isassetMap ? (
            <><div className='body'>
          <div className='imagebox'><img className='infoimages' src={traffic_light} alt='traffic_light' /></div>
          <span className='text'>Stoplight</span>
        </div><div className='body'>
            <div className='imagebox'><img className='infoimages' src={announcement_beacon} alt='announcement_beacon' /></div>
            <span className='text'>Announcement beacon</span>
          </div><div className='body'>
            <div className='imagebox'><img className='infoimages' src={kilometer_sign} alt='kilometer_sign' /></div>
            <span className='text'>Kilometer pole</span>
          </div><div className='body'>
            <div className='imagebox'><img className='infoimages' src={triangle_sign} alt='triangle_sign' /></div>
            <span className='text'>Triangular announcement sign</span>
          </div></>
          ) : (
            <><div className='body'>
            <div className='imagebox'><img className='infoimages' src={vegetation_marker} alt='vegetation_marker' /></div>
            <span className='text'>Vegetation overgrowth</span>
          </div><div className='body'>
              <div className='imagebox'><img className='infoimages' src={weather_marker} alt='weather_marker' /></div>
              <span className='text'>Weather</span>
            </div><div className='body'>
              <div className='imagebox'><img className='infoimages' src={track_deviation_marker} alt='track_deviation_marker' /></div>
              <span className='text'>Track deviation</span>
            </div><div className='body'>
              <div className='imagebox'><img className='infoimages' src={track_infrastructure_marker} alt='track_infrastructure_marker' /></div>
              <span className='text'>Track infrastructure</span>
            </div><div className='body'>
              <div className='imagebox'><img className='infoimages' src={tunnel_damage_marker} alt='tunnel_damage_marker' /></div>
              <span className='text'>Tunnel damage</span>
            </div></>
          )}
        </>
  );
}

function Footer({closeModal}) {
  return (
    <div className='footer'>
      <span
        className='button-close'
        onClick={closeModal}>
        Close
      </span>
    </div>
  );
}

export default function InfoButton({isassetMap}) {
  const subtitleRef = React.useRef();
  const [modalIsOpen, setIsOpen] = React.useState(false);
  const heatmap = useRecoilValue(setHeatMap);
  const name = heatmap.name;
  const type = heatmap.isHeatMap;

  useEffect(() => {
    if (subtitleRef.current) {
      // references are now sync'd and can be accessed.
      subtitleRef.current.style.color = '#f00';
    }
  }, [modalIsOpen]);

  function openModal() {
    setIsOpen(true);
  }

  function closeModal() {
    setIsOpen(false);
  }
  
  return (
    <div className="InfoButton">
      <button onClick={openModal} className='btn-leaflet'>
        <i className="fas fa-info text-dark"></i>
      </button>
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customStyles}
        contentLabel="Example Modal"
      >
        <div className='modal'>
          <Header closeModal={closeModal}/>
          <hr/>
          <Title name={name} />
          <hr/>
          <Body type={type} isassetMap={isassetMap}/>
          <hr/>
          <Footer closeModal={closeModal} />
        </div>
      </Modal>    
      </div>
  );
}
