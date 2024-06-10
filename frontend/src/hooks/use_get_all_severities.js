import { useEffect, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';

export default function useGetAllSeverities() {
    const [anomalySeverities, setAnomalySeverities] = useState([]);

    useEffect(() => {
        async function fetchData() {
        try {
            const result = await AnomalyTrackerApi.getSeverityEnumerations();
            setAnomalySeverities(result.data);
        } catch (error) {
            console.log(error);
        }
        }
        fetchData();
    }, []);

    return {
        anomalySeverities,
    };
}