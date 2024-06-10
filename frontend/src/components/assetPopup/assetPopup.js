import './assetPopup.css';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { useState } from 'react';
import AnomalyTrackerApi from '../../apis/anomalytrackerapi';
import announcement_beacon from '../../assets/images/announcement_beacon.png';
import kilometer_sign from '../../assets/images/kilometer_sign.png';
import triangle_sign from '../../assets/images/triangle_sign.png';
import traffic_light from '../../assets/images/traffic_light.png';
import { useRecoilState } from 'recoil';
import { isUpdated } from '../../store/store';

const customStyles = {
  content: {
    top: '50%',
    left: '50%',
    right: 'auto',
    bottom: 'auto',
    transform: 'translate(-50%, -50%)',
    border: '1px solid #333',
    width: "60%",
    zIndex: 9999,
  },
  overlay: {
    zIndex: 9997,
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
  },
};

Modal.setAppElement(document.getElementById('root'));
// change the timeformat
function formatTime(timestamp) {
  const formattedTime = moment(timestamp).format('DD/MM/YYYY<br/>hh:mm:ss');

  return (
    <div dangerouslySetInnerHTML={{ __html: formattedTime }} />
  );
}


function Header({closeModal}) {
  return (
    <div className='header'>
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
// left side of the pop-up with all the information
function LeftSide({asset, address}) {

  return(
    <div className='left-side'>
      <h3>Type:</h3>
      <div className="severity">
      <div className="severity-circle" style={{ backgroundColor: '#4F6B9B' }} >
        {asset.assetType.name === 'Announcement beacon' ? (
            <img src={announcement_beacon} alt="announcement_beacon" className="severity-image" />
          ): asset.assetType.name === 'Stoplight' ? (
            <img src={traffic_light} alt="stoplight" className="severity-image" />
          ) : asset.assetType.name === 'Kilometer pole' ? (
            <img src={kilometer_sign} alt="kilometer_pole" className="severity-image" />
          ) : asset.assetType.name === 'Triangle announcement sign' ? (
            <img src={triangle_sign} alt="triangle_sign" className="severity-image" />
          ) : (<div></div>)
        }
        </div>
      <p>{asset.assetType.name}</p>
      </div>
      
      <h3>Location:</h3>
      <span>{address}</span>
      <div className="coordinates">
        <span className="latlong">{asset.latitude.toFixed(6)}"N &nbsp; {asset.longitude.toFixed(6)}"E</span>
      </div>

      <h3>Time:</h3>
      <span>{formatTime(asset.timeStamp)}</span>
    </div>
  );
}
// right side of the pop-up with the picture and buttons
function RightSide({asset, isFlagged, setIsFlagged}) {

  const toggleIsFlagged = () => {
    setIsFlagged(!isFlagged);
  };

  console.log(asset);
  return (
    <div className="right-side">
      <img src={asset.photo} alt="Asset" />
      <div className="buttons2">
        <button
          className="solvedFlagged"
          style={{ backgroundColor: isFlagged ? "blue" : "grey" }}
          onClick={toggleIsFlagged}
        >
          {isFlagged ? "Flag" : "Not Flagged"}
        </button>
      </div>
    </div>
  );
}

function Body({asset, isFlagged, setIsFlagged, address}) {
  return (
    <div className='body-container'>
      <LeftSide asset={asset} address={address} />
      <RightSide asset={asset} isFlagged={isFlagged} setIsFlagged={setIsFlagged} />
    </div>
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

export default function AssetPopup({asset, closeModal}) {

  const subtitleRef = React.useRef();
  const [modalIsOpen, setIsOpen] = React.useState(true);

  const [isFlagged, setIsFlagged] = useState(asset.isFlagged);
  const [address, setAddress] = useState("");
  const [isUpdatedState, setIsUpdated] = useRecoilState(isUpdated);

  useEffect(() => {
    reverseGeocode(asset.latitude, asset.longitude);
  }, [asset.latitude, asset.longitude]);
  // reverse geocode the latitude and longitude to get specific placenames
  function reverseGeocode(latitude, longitude) {
    const apiKey = "6fc6ed7cccae4c02a5d16e74a08c2c1b";
    const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${latitude},+${longitude}&key=${apiKey}&language=en&pretty=1`

    fetch(apiUrl)
    .then(response => response.json())
    .then(data => {
      var address = data.results[0].formatted;
      setAddress(address);
    })
  } 

  useEffect(() => {
    if (subtitleRef.current) {
      // references are now sync'd and can be accessed.
      subtitleRef.current.style.color = '#f00';
    }
  }, [modalIsOpen]);

  function closeModalAndParent() {

    AnomalyTrackerApi.updateAsset(asset.id, {
      IsFlagged: isFlagged,
    })
      .then(response => {
        // Handle the successful response if needed
        console.log("Asset updated successfully:", response.data);
      })
      .catch(error => {
        // Handle errors, such as network issues or server errors
        console.error("Error updating anomaly:", error);
      });
      
    
    if (isFlagged != asset.isFlagged) {
      setIsUpdated(true);
    }
    closeModal();
    setIsOpen(false);
  }

  
  return (
    <div className="assetPopup">
      <Modal
        isOpen={true}
        onRequestClose={closeModalAndParent}
        style={customStyles}
        contentLabel="Asset Modal"
      >
        <div className='modal'>
          <Header closeModal={closeModalAndParent}/>
          <Body asset={asset}
                isFlagged={isFlagged}
                setIsFlagged={setIsFlagged}
                address={address}
                />
          <Footer closeModal={closeModalAndParent} />
        </div>
      </Modal>    
    </div>
  );
}
