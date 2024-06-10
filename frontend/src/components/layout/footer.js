import './layout.css';
import image from '../../assets/images/logo-transparent2.png';
import React from 'react';

export default function Footer() {  
    const currentYear = new Date().getFullYear();

    return (
      <footer className="rot-background">
        <span className='copyright'>&copy; {currentYear} TrackTech  </span>
        <img className='logo' src={image} alt='Logo' />
      </footer>
    );
}