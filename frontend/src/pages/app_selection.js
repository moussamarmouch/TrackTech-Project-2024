import './pages.css';
import { Link } from 'react-router-dom';
import  image  from '../assets/images/codiTrack-icon.webp';
import Header from '../components/layout/header';
import Footer from '../components/layout/footer';
import React from 'react';

function Card(){
  return (
    <div className='card'>
      <div className='card-header'>
        <img className='img' src={image} alt='codiTrack' />
      </div>
      <div className='card-body'>
        <span className='text'>TrackTech</span>
      </div>
      <div className='card-footer'>
        <span className='text'>Condition-Based Maintenance Monitoring for Railways.</span>
      </div>
    </div>
  );
}

export default function AppSelection() {
    return (
      <>
      <Header />
      <div className='app-selection rot-bg-lines-left-bottom'>
        <div className='middle'>
          <h1 className='text'>App selection</h1>
          <div className="spacer"></div>
          <Link to="/toolselector" className='link'>
            <Card />
          </Link>
        </div>
      </div>
      <Footer />
      </>
    );
}