import React, { useRef, useState, useEffect } from 'react';
import './assetMapping.css';
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from 'leaflet';
import MarkerClusterGroup from 'react-leaflet-cluster'
import AssetsList from '../assetsList/assetsList'
import AssetPopup from '../assetPopup/assetPopup';
import useGetAllAssets from '../../hooks/use_get_all_assets';
import { FadeLoader } from 'react-spinners';
import InfoButton from '../InfoButton/InfoButton';
import { mapZoom, setHeatMap, isUpdated } from '../../store/store';
import { useRecoilState, useRecoilValue } from 'recoil';
import { latLong } from '../../store/store';
import announcement_beacon from '../../assets/images/announcement_beacon.png';
import kilometer_sign from '../../assets/images/kilometer_sign.png';
import triangle_sign from '../../assets/images/triangle_sign.png';
import traffic_light from '../../assets/images/traffic_light.png';
import toast from 'react-hot-toast';

function UseMap({sortedAssets, zoom, latitudeLongitude, isHeatMap, handlePopupClose}) {
  const mapRef = useRef(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [groupedAddressPoints, setGroupedAddressPoints] = useState([]);
  const radius = 100;
  const [heatmapLayer, setHeatmapLayer] = useState(null);
  const isassetMap = true;

  useEffect(() => {
    // Group anomalies and calculate intensity dynamically
    const groupedPoints = sortedAssets.map((asset) => {
      const intensity = calculateIntensity(sortedAssets, [asset.latitude, asset.longitude], radius);
      return [asset.latitude, asset.longitude, intensity];
    });

    setGroupedAddressPoints(groupedPoints);
  }, [sortedAssets, radius]);

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
  function getMarkerIcon(assettype) {
    let imagetype = '';
  
    switch (assettype) {
      case 'Stoplight':
        imagetype = traffic_light;
            break;
          
      case 'Announcement beacon':
        imagetype = announcement_beacon;
            break;
          
      case 'Kilometer pole':
        imagetype = kilometer_sign;
            break;
        
      case 'Triangular announcement sign':
        imagetype = triangle_sign;
            break;
      default:
        break;
    }
  
    return L.divIcon({
      className: 'custom-div-icon',
      html: `<div style='background-color: #4F6B9B;' class='marker-pin'></div><img src=${imagetype} class='marker-image' alt='Custom Marker Image' />`,
      iconSize: [30, 42],
      iconAnchor: [15, 42],
    });
  }
  
  
  
  const handleMarkerClick = (event) => {
    const clickedMarker = event.layer;
  
    // Check if the clicked object is an instance of L.Marker
    if (clickedMarker instanceof L.Marker) {
      // Find the matching marker in the markers array
      const matchingMarker = sortedAssets.find((marker) => {
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
        <div className="info-button-container"><InfoButton isassetMap={isassetMap}/></div>
        <MarkerClusterGroup 
          chunkedLoading 
          showCoverageOnHover={false}
          maxClusterRadius={50}
          eventHandlers={{ click: handleMarkerClick }}>
          {sortedAssets.map((marker) => (
            <Marker
              key={marker.id}
              data={marker}
              position={[marker.latitude, marker.longitude]}
              icon={getMarkerIcon(marker.assetType.name)}
            />

          ))}
        </MarkerClusterGroup>
        
      {isModalOpen && selectedMarker && (
        <AssetPopup asset={selectedMarker} closeModal={closeModal} />
      )}
    </MapContainer>
  );
}
// calculate the intensity for the heatmap
function calculateIntensity(assets, center, radius) {
  const filteredAnomalies = assets.filter((asset) => {
    const distance = getDistanceFromLatLonInKm(center[0], center[1], asset.latitude, asset.longitude);
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
    assets,
    loading,
    newAssetReceived,
    handlePopupClose,
  } = useGetAllAssets();
  const heatmap = useRecoilValue(setHeatMap);
  const [isUpdatedState, setIsUpdated] = useRecoilState(isUpdated);

  const isHeatMap = heatmap.isHeatMap;  
  const sortedAssets = [...assets].sort((a, b) => new Date(a.timeStamp) - new Date(b.timeStamp));

  const [isToastShown, setIsToastShown] = useState(false);
  // when a new asset is added
  useEffect(() => {
    if (newAssetReceived) {
      toast.success("New Asset Available");
  }
  }, [newAssetReceived]);

  useEffect(() => {
    if (isUpdatedState) {
      toast.success("Asset updated");
      setIsUpdated(false);
    }
  }, [isUpdatedState]);

  return (
    <div className="map-container">
      <div className="map-info" >
        
            <div className='titleAndReset'>
              <h2>Assets</h2>
              <i className="fas fa-redo-alt reset" onClick={resetZoomAndLatLong({ setZoom, setLatitudeLongitude })}></i>
            </div>
            <AssetsList />
          
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
          <UseMap sortedAssets={sortedAssets} latitudeLongitude={latitudeLongitude} zoom={zoom} isHeatMap={isHeatMap} handlePopupClose={handlePopupClose}/>
        )}
      </div>
    </div>
  );  
};
