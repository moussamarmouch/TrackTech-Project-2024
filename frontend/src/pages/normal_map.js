import './pages.css';
import SimpleMap from '../components/simpleMap/simpleMap';
import Topbar from '../components/topbar/topbar';
import { useRecoilState } from 'recoil';
import { isStatistics } from '../store/store';
import { useEffect } from 'react';
import React from 'react';
import { AnomaliesProvider } from '../context/AnomaliesContext';
import { Toaster } from 'react-hot-toast';

export default function NormalMap() { 
  const isnormalMap = true;
  const [, setStatistics] = useRecoilState(isStatistics);
  
  useEffect(() => {
    setStatistics(false);
  }, []);

    return (
      <div className='normal-map'>
        <AnomaliesProvider>
          <Topbar isnormalMap={isnormalMap}/>
        <Toaster 
          position="bottom-right"
          reverseOrder={false}
        />
        <SimpleMap />
        </AnomaliesProvider>
      </div>
    );
  }