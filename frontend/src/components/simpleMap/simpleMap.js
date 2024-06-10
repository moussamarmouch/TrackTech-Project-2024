import React, { useRef, useState, useEffect } from 'react';
import './simpleMap.css';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'
import AnomaliesList from '../anomaliesList/anomaliesList';
import AnomalyPopup from '../anomalyPopup/anomalyPopup';
import useGetAllAnomalies from '../../hooks/use_get_all_anomalies';
import { FadeLoader } from 'react-spinners';
import InfoButton from '../InfoButton/InfoButton';
import { isModelOpen, mapZoom, newAnomaly, setHeatMap, isUpdated } from '../../store/store';
import { useRecoilState, useRecoilValue } from 'recoil';
import { latLong } from '../../store/store';
import vegetation_marker from '../../assets/images/vegetation_marker.png';
import weather_marker from '../../assets/images/weather_marker.png';
import track_deviation_marker from '../../assets/images/track_deviation_marker.png';
import track_infrastructure_marker from '../../assets/images/track_infrastructure_marker.png';
import tunnel_damage_marker from '../../assets/images/tunnel_damage_marker.png';
import toast from 'react-hot-toast';
import "leaflet.heat/dist/leaflet-heat.js";

function UseMap({sortedAnomalies, zoom, latitudeLongitude, isHeatMap, handlePopupClose}) {
  const mapRef = useRef(null);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [groupedAddressPoints, setGroupedAddressPoints] = useState([]);
  const radius = 100;
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const [ismodalOpen, setIsModalOpen] = useRecoilState(isModelOpen);

  useEffect(() => {
    // Group anomalies and calculate intensity dynamically
    const groupedPoints = sortedAnomalies.map((anomaly) => {
      const intensity = calculateIntensity(sortedAnomalies, [anomaly.latitude, anomaly.longitude], radius);
      return [anomaly.latitude, anomaly.longitude, intensity];
    });

    setGroupedAddressPoints(groupedPoints);
  }, [sortedAnomalies, radius]);

  useEffect(() => {
    // Cleanup function
    return () => {
      if (heatmapLayer) {
        heatmapLayer.remove();
        setHeatmapLayer(null);
      }
    };
  }, []); // Empty dependency array means this effect will only run on mount and unmount

  useEffect(() => {
    // Remove the existing heatmap layer if it exists
    if (heatmapLayer) {
      heatmapLayer.remove();
      setHeatmapLayer(null);
    }
  
    if (mapRef.current && isHeatMap) {
      const points = groupedAddressPoints ? groupedAddressPoints.map((p) => [p[0], p[1], p[2]]) : [];
      const heatmap = L.heatLayer(points);
  
      // Check if the mapRef is not null before adding the heatmap layer
      if (mapRef.current) {
        heatmap.addTo(mapRef.current);
      }
  
      setHeatmapLayer(heatmap);
    }
  
    // Cleanup the heatmap layer when switching to a normal map
    if (!isHeatMap && heatmapLayer) {
      if (mapRef.current) {
        heatmapLayer.remove();
      }
      setHeatmapLayer(null);
    }
  }, [isHeatMap, groupedAddressPoints]);

  // Function to get marker
  function getMarkerIcon(severity, anomalytype) {
    let backgroundColor = '';
    let imagetype = '';
  
    switch (severity) {
      case 'Low':
        switch (anomalytype.name) {
          case 'Vegetation overgrowth':
            imagetype = vegetation_marker;
            backgroundColor = 'green';
            break;
          case 'Weather':
            imagetype = weather_marker;
            backgroundColor = 'green';
            break;
          case 'Track deviation':
            imagetype = track_deviation_marker;
            backgroundColor = 'green';
            break;
          case 'Track infrastructure':
            imagetype = track_infrastructure_marker;
            backgroundColor = 'green';
            break;
          case 'Tunnel damage':
            imagetype = tunnel_damage_marker;
            backgroundColor = 'green';
            break;
          default:
            break;
        }
        break;
      case 'Medium':
        switch (anomalytype.name) {
          case 'Vegetation overgrowth':
            imagetype = vegetation_marker;
            backgroundColor = 'yellow';
            break;
          case 'Weather':
            imagetype = weather_marker;
            backgroundColor = 'yellow';
            break;
          case 'Track deviation':
            imagetype = track_deviation_marker;
            backgroundColor = 'yellow';
            break;
          case 'Track infrastructure':
            imagetype = track_infrastructure_marker;
            backgroundColor = 'yellow';
            break;
          case 'Tunnel damage':
            imagetype = tunnel_damage_marker;
            backgroundColor = 'yellow';
            break;
          default:
            break;
        }
        break;
      case 'High':
        switch (anomalytype.name) {
          case 'Vegetation overgrowth':
            imagetype = vegetation_marker;
            backgroundColor = 'orange';
            break;
          case 'Weather':
            imagetype = weather_marker;
            backgroundColor = 'orange';
            break;
          case 'Track deviation':
            imagetype = track_deviation_marker;
            backgroundColor = 'orange';
            break;
          case 'Track infrastructure':
            imagetype = track_infrastructure_marker;
            backgroundColor = 'orange';
            break;
          case 'Tunnel damage':
            imagetype = tunnel_damage_marker;
            backgroundColor = 'orange';
            break;
          default:
            break;
        }
        break;
      case 'Extreme':
        switch (anomalytype.name) {
          case 'Vegetation overgrowth':
            imagetype = vegetation_marker;
            backgroundColor = 'red';
            break;
          case 'Weather':
            imagetype = weather_marker;
            backgroundColor = 'red';
            break;
          case 'Track deviation':
            imagetype = track_deviation_marker;
            backgroundColor = 'red';
            break;
          case 'Track infrastructure':
            imagetype = track_infrastructure_marker;
            backgroundColor = 'red';
            break;
          case 'Tunnel damage':
            imagetype = tunnel_damage_marker;
            backgroundColor = 'red';
            break;
          default:
            break;
        }
        break;
      default:
        break;
    }
  
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style='background-color: ${backgroundColor};' class='marker-pin'></div><img src=${imagetype} class='marker-image' alt='Custom Marker Image' />`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  }
  
  

  const handleMarkerClick = (event) => {
    const clickedMarker = event.layer;
  
    // Check if the clicked object is an instance of L.Marker
    if (clickedMarker instanceof L.Marker) {
      // Find the matching marker in the markers array
      const matchingMarker = sortedAnomalies.find((marker) => {
        const [lat, lng] = [marker.latitude, marker.longitude];
        return lat === clickedMarker.getLatLng().lat && lng === clickedMarker.getLatLng().lng;
      });
  
      if (matchingMarker) {        
        setSelectedMarker(matchingMarker);
        setIsModalOpen(true);
      }
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    handlePopupClose();
  };

  return (
    <MapContainer 
      key={`${latitudeLongitude[0]}-${latitudeLongitude[1]}-${zoom}`}
      center={[latitudeLongitude[0], latitudeLongitude[1]]} 
      zoom={zoom} 
      ref={mapRef} 
      style={{ height: '100%', width: '100%', overflow: 'hidden', margin: "auto",maxWidth: '100%' }}>
        <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
        <div className="info-button-container"><InfoButton /></div>
        <MarkerClusterGroup 
          chunkedLoading 
          showCoverageOnHover={false}
          maxClusterRadius={50}
          eventHandlers={{ click: handleMarkerClick }}>
          {sortedAnomalies.map((marker) => (
            <Marker
              key={marker.id}
              data={marker}
              position={[marker.latitude, marker.longitude]}
              icon={getMarkerIcon(marker.anomalyType.level, marker.anomalyType)}
            />
          ))}
        </MarkerClusterGroup>
        
      {ismodalOpen && selectedMarker && (
        <AnomalyPopup anomaly={selectedMarker} closeModal={closeModal} />
      )}
    </MapContainer>
  );
}
// calculate the intensity for the heatmap
function calculateIntensity(anomalies, center, radius) {
  const filteredAnomalies = anomalies.filter((anomaly) => {
    const distance = getDistanceFromLatLonInKm(center[0], center[1], anomaly.latitude, anomaly.longitude);
    return distance <= radius;
  });

  return filteredAnomalies.length + 200;
};
// function to calculate the distance between two points on the earth's surface using the Haversine formula
function getDistanceFromLatLonInKm(lat1, lon1, lat2, lon2) {
  const R = 6371; // Radius of the earth in km
  const dLat = deg2rad(lat2 - lat1); // deg2rad below
  const dLon = deg2rad(lon2 - lon1);
  // Haversine formula
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const distance = R * c; // Distance in km
  return distance;
};

// change degrees to radians
function deg2rad(deg) {
  return deg * (Math.PI / 180);
};
// reset to the initial map settings
function resetZoomAndLatLong({setZoom, setLatitudeLongitude}) {
  return () => {
    setLatitudeLongitude([50.8503, 4.3517]);
    setZoom(8);
  };
}

export default function SimpleMap() {
  const [latitudeLongitude, setLatitudeLongitude] = useRecoilState(latLong);
  const [zoom, setZoom] = useRecoilState(mapZoom);
  const {
    anomalies,
    loading,
    newAnomalyReceived,
    handlePopupClose,
  } = useGetAllAnomalies();
  const heatmap = useRecoilValue(setHeatMap);
  const isHeatMap = heatmap.isHeatMap;
  const [isUpdatedState, setIsUpdated] = useRecoilState(isUpdated);

  const [isToastShown, setIsToastShown] = useState(false);
  const sortedAnomalies = [...anomalies].sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));
  // when a new anomaly is added
  useEffect(() => {
    if (newAnomalyReceived) {
      toast.success("New Anomaly Available");
  }
  }, [newAnomalyReceived]);
  
  useEffect(() => {
    if (isUpdatedState) {
      toast.success("Anomaly updated");
      setIsUpdated(false);
    }
  }, [isUpdatedState]);

  return (
    <div className="map-container">
      <div className="map-info" >
        
            <div className='titleAndReset'>
              <h2>Anomalies</h2>
              <i className="fas fa-redo-alt reset" onClick={resetZoomAndLatLong({ setZoom, setLatitudeLongitude })}></i>
            </div>
            <AnomaliesList />
          
      </div>
      <div className="map-image">
        {loading && (
          <div className='center'>
            <FadeLoader 
              size={20}
              loading={true}
            />
          </div>
        )}
        {!loading && (
          <UseMap sortedAnomalies={sortedAnomalies} latitudeLongitude={latitudeLongitude} zoom={zoom} isHeatMap={isHeatMap} handlePopupClose={handlePopupClose} />
        )}
      </div>
    </div>
  );  
};
