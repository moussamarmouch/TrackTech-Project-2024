import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import './topbar.css';
import { useNavigate, Link } from 'react-router-dom';
import image from '../../assets/images/logo-transparent2.png';
import Filterdropdown from '../filterdropdown/filterdropdown';
import Switch from '@mui/material/Switch';
import { setHeatMap } from '../../store/store';
import { useRecoilState } from 'recoil';
import AssetFilterdropdown from '../assetFilterDropdown/assetFilterDropdown';

export default function Topbar({isnormalMap, isassetMap}) {  
  const navigate = useNavigate();
  const [heatmap, setHeatmap] = useRecoilState(setHeatMap);
  const [windowWidth, setWindowWidth] = useState(window.innerWidth);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);

    // Cleanup the event listener on component unmount
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // change between normal map and heatmap
  const onClick = () => {
    setHeatmap({
        name: heatmap.isHeatMap ? 'normal map' : 'heat map',
        isHeatMap: !heatmap.isHeatMap
    });
};

  return (
    <nav className="topbar">
      <Link to="/" className="top rot-coditrack-background">
        <img className='logo' src={image} alt='Logo' />
      </Link>
      {isnormalMap && (
        <>
          <p className='switch'>Heatmap</p>
          <Switch className='switch' onClick={onClick}/>
        </>
      )}
      <div className='topbuttons'>
        {isassetMap ? (
        <>
          <AssetFilterdropdown className='iconfilter'/>
        </>
      ) : (
      <Filterdropdown className='iconfilter'/>
      )}
        <Link className='iconback' onClick={() => {
          setHeatmap({
            name: 'normal map',
            isHeatMap: false
          });
          navigate(-1);
        }}><i className={`fas fa-backward icon ${windowWidth < 700 ? 'fa-1x' : 'fa-2x'}`}></i></Link>
      </div>
      
    </nav>
  );
}
