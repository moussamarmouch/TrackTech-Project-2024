import './App.css';
import React from 'react';
import { Routes, Route, BrowserRouter } from 'react-router-dom';
import AppSelection from './pages/app_selection';
import AssetMap from './pages/asset_map';
import NormalMap from './pages/normal_map';
import Statistics from './pages/statistics';
import ToolSelection from './pages/tool_selection';
import { RecoilRoot } from 'recoil';

function Main(){
  return(
    <div>
      <Routes>
        <Route path={'/'} element={<AppSelection/>}></Route>
        <Route path={'/normalmap'} element={<NormalMap/>}></Route>
        <Route path={'/assetmap'} element={<AssetMap/>}></Route>
        <Route path={'/statistics'} element={<Statistics/>}></Route>
        <Route path={'/toolselector'} element={<ToolSelection/>}></Route>
      </Routes>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <RecoilRoot>
        <Main/>
      </RecoilRoot>
    </BrowserRouter>
  );
}

export default App;
