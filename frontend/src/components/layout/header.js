import './layout.css';
import { Link } from 'react-router-dom';
import image from '../../assets/images/logo-transparent2.png';
import React from 'react';

export default function Header() {  
    return (
      <nav className="nav rot-coditrack-background">
        <img className='logo' src={image} alt='Logo' />
        <Link to={'/'} className='link icon'><i className="fa-solid fa-house fa-3x icon"></i></Link>
      </nav>
    );
}