import './pages.css';
import { Link } from 'react-router-dom';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import React from 'react';

function Card({ icon, text, smallText, route }) {
  return (
    <div className='card'>
      <div className='card-header'>
        <i className={icon + " fa-4x icon"}></i>
      </div>
      <div className='card-body'>
        <span className='text'>{text}</span>
        <p className='smallText'>{smallText}</p>
      </div>
      <div className='card-footer'>
        <Link to={`/${route}`} className='link card-button'>VIEW</Link>
      </div>
    </div>
  );
}

export default function ToolSelection() {  
    return (
      <>
      <Header />
      <div className='tool-selection rot-bg-lines-right-bottom'>
        <div className='middle'>
          <h1 className='text'>Select Tool</h1>
          <div className="spacer"></div>
          <div className='wrapper'>
            <Card 
              icon={"fas fa-globe-europe"} 
              text={"Normal Map"} 
              smallText={"Data-driven maps for analysis and live visualization of anomalies on a map"} 
              route={"normalmap"} />
            <Card 
              icon={"fa-solid fa-map"} 
              text={"Asset Mapping"} 
              smallText={"Data-driven asset mapping for analysis and live visualization of assets on a map"} 
              route={"assetmap"} />
            <Card 
              icon={"fa-solid fa-chart-line"} 
              text={"Statistics"} 
              smallText={"Data-driven charts for analysis and live visualization of anomalies on charts"} 
              route={"statistics"} />
          </div>
        </div>
      </div>
      <Footer />
      </>
    );
  }