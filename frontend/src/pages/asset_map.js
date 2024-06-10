import './pages.css';
import AssetMapper from '../components/assetMapping/assetMapping';
import Topbar from '../components/topbar/topbar';
import { isStatistics } from '../store/store';
import { useRecoilState } from 'recoil';
import React from 'react';
import { useEffect } from 'react';
import { Toaster } from 'react-hot-toast';

export default function AssetMap() {  
  const isnormalMap = true;
  const isassetMap = true;
  const [, setStatistics] = useRecoilState(isStatistics);
  
  useEffect(() => {
    setStatistics(false);
  }, []);

    return (
      <div>
        <Topbar isnormalMap={isnormalMap} isassetMap={isassetMap}/>
        <Toaster 
          position="bottom-right"
          reverseOrder={false}
        />
        <AssetMapper />
      </div>
    );
  }