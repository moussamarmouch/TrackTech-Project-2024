// AnomaliesContext.js

import React, { createContext, useContext, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';

// Create a context to manage the state related to anomalies
const AnomaliesContext = createContext();

// Create a provider component that will wrap the application and manage the anomalies state
export const AnomaliesProvider = ({ children }) => {
  const [anomalies, setAnomalies] = useState([]);

  const updateAnomaly = (id, updatedData) => {
    AnomalyTrackerApi.updateAnomaly(id, updatedData)
      .then(response => {
        // Update the local state with the updated anomaly data
        setAnomalies((prevAnomalies) =>
          prevAnomalies.map((anomaly) =>
            anomaly.id === id ? { ...anomaly, ...updatedData } : anomaly
          )
        );
      })
      .catch(error => {
        // Handle errors, such as network issues or server errors
        console.error("Error updating anomaly:", error);
      });
  };

  return (
    <AnomaliesContext.Provider value={{ anomalies, updateAnomaly }}>
      {children}
    </AnomaliesContext.Provider>
  );
};
// Custom hook to access the anomalies context and its values
export const useAnomalies = () => {
  return useContext(AnomaliesContext);
};
