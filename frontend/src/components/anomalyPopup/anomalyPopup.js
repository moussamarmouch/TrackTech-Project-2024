import './anomalyPopup.css';
import React, { useEffect } from 'react';
import Modal from 'react-modal';
import moment from 'moment';
import { useState } from 'react';
import vegetation_marker from '../../assets/images/vegetation_marker.png';
import weather_marker from '../../assets/images/weather_marker.png';
import track_deviation_marker from '../../assets/images/track_deviation_marker.png';
import track_infrastructure_marker from '../../assets/images/track_infrastructure_marker.png';
import tunnel_damage_marker from '../../assets/images/tunnel_damage_marker.png';
import { useAnomalies } from '../../context/AnomaliesContext';
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
// give the severitylevel its corresponding color
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
function LeftSide({anomaly, remark, setRemark, address}) {
  const [isEditMode, setEditMode] = useState(false);

  function RemarkChange(event) {
    setRemark(event.target.value);
  }

  function saveRemark() {
    setEditMode(false)
  }
  // fill the remark with the comment of the anomaly, if it doesn't have a comment, fill it with an empty string
  useEffect(() => {
    setRemark(anomaly.comment || "");
  }, [anomaly.comment, setRemark]);

  return(
    <div className='left-side'>
      <h3>Type:</h3>
      <div className="severity">
      <div className="severity-circle" style={{ backgroundColor: getSeverityColor(anomaly.anomalyType.level) }}>
        {anomaly.anomalyType.name === 'Vegetation overgrowth' ? (
            <img src={vegetation_marker} alt="vegetation_marker" className="severity-image" />
          ): anomaly.anomalyType.name === 'Weather' ? (
            <img src={weather_marker} alt="weather_marker" className="severity-image" />
          ) : anomaly.anomalyType.name === 'Track deviation' ? (
            <img src={track_deviation_marker} alt="track_deviation_marker" className="severity-image" />
          ) : anomaly.anomalyType.name === 'Track infrastructure' ? (
            <img src={track_infrastructure_marker} alt="track_infrastructure_marker" className="severity-image" />
          ) : anomaly.anomalyType.name === 'Tunnel damage' ? (
            <img src={tunnel_damage_marker} alt="tunnel_damage_marker" className="severity-image" />
          ) : (<div></div>)
        }
        </div>
      <p>{anomaly.anomalyType.name}</p>
      </div>
      
      <h3>Location:</h3>
      <span>{address}</span>
      <div className="coordinates">
        <span className="latlong">{anomaly.latitude.toFixed(6)}"N &nbsp; {anomaly.longitude.toFixed(6)}"E</span>
      </div>

      <h3>Time:</h3>
      <span>{formatTime(anomaly.timeStamp)}</span>
      <h3>Remarks:</h3>
      <textarea
        id='remarks'
        name='remarks'
        rows='4'
        cols='25'
        onChange={RemarkChange}
        value={remark}
        style={{resize: 'both', maxWidth: '12rem', width: '90%'}}
        readOnly={!isEditMode}
      ></textarea>
      
      {isEditMode ? (
          <span className='button-close' onClick={saveRemark}>
            Save
          </span>
        ) : (
          <span
          className='button-close'
          onClick={() => setEditMode(true)}>
          Edit
          </span>
        )}
    </div>
  );
}
// right side of the pop-up with the picture and buttons
function RightSide({anomaly, isFlagged, setIsFlagged, isSolved, setIsSolved}) {

  const toggleIsSolved = () => {
    setIsSolved(!isSolved);
  };

  const toggleIsFlagged = () => {
    setIsFlagged(!isFlagged);
  };

  return (
    <div className="right-side">
      <img src={anomaly.photo} alt="Anomaly" />
      <div className="buttons">
        <button
          className="solvedFlagged"
          style={{ backgroundColor: isSolved ? "green" : "red" }}
          onClick={toggleIsSolved}
        >
          {isSolved ? "Solved" : "Not Solved"}
        </button>
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

function Body({anomaly, remark, setRemark, isFlagged, setIsFlagged, isSolved, setIsSolved, address}) {
  return (
    <div className='body-container'>
      <LeftSide anomaly={anomaly} remark={remark} setRemark={setRemark} address={address} />
      <RightSide anomaly={anomaly} isFlagged={isFlagged} setIsFlagged={setIsFlagged} isSolved={isSolved} setIsSolved={setIsSolved} />
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

export default function AnomalyPopup({anomaly, closeModal}) {
  const { updateAnomaly } = useAnomalies();
  const subtitleRef = React.useRef();
  const [modalIsOpen, setIsOpen] = React.useState(true);

  const [isSolved, setIsSolved] = useState(anomaly.isSolved);
  const [isFlagged, setIsFlagged] = useState(anomaly.isFlagged);
  const [remark, setRemark] = useState("");
  const [address, setAddress] = useState("");
  const [isUpdatedState, setIsUpdated] = useRecoilState(isUpdated);
  const initialRemark = anomaly.comment;

  useEffect(() => {
    reverseGeocode(anomaly.latitude, anomaly.longitude);
  }, [anomaly.latitude, anomaly.longitude]);

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

  // update the anomaly if anything has changed
  function closeModalAndParent() {
    if (isSolved !== anomaly.isSolved || isFlagged !== anomaly.isFlagged || (remark !== initialRemark && initialRemark !== null)) {
      setIsUpdated(true);
    }
    updateAnomaly(anomaly.id, {
      IsSolved: isSolved,
      IsFlagged: isFlagged,
      Comment: remark,
    }); 
    closeModal();
    setIsOpen(false);
  }

  
  return (
    <div className="anomalyPopup">
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModalAndParent}
        style={customStyles}
        contentLabel="Anomaly Modal"
      >
        <div className='modal'>
          <Header closeModal={closeModalAndParent}/>
          <Body anomaly={anomaly}
                remark={remark}
                setRemark={setRemark}
                isFlagged={isFlagged}
                setIsFlagged={setIsFlagged}
                isSolved={isSolved}
                setIsSolved={setIsSolved}
                address={address}
                />
          <Footer closeModal={closeModalAndParent} />
        </div>
      </Modal>    
    </div>
  );
}
