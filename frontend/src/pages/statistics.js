import Topbar from '../components/topbar/topbar';
import StatisticsGraphs from '../components/statisticsGraphs/statisticsGraphs';
import './pages.css';
import { useRecoilState } from 'recoil';
import { isStatistics } from '../store/store';
import React from 'react';
import { useEffect } from 'react';

export default function Statistics() {  
  const isnormalMap = false;
  const [, setStatistics] = useRecoilState(isStatistics);
  useEffect(() => {
    setStatistics(true);
  }, []);
  
    return (
      <div>
        <Topbar isnormalMap={isnormalMap}/>
        <StatisticsGraphs />
      </div>
    );
  }