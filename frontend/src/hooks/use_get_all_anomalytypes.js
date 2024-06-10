import { useEffect, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';

export default function useGetAllAnomalyTypes() {
    const [anomalyTypes, setAnomalyTypes] = useState([]);

    useEffect(() => {
        async function fetchData() {
        try {
            const result = await AnomalyTrackerApi.getAnomalyTypes();
            setAnomalyTypes(result.data);
        } catch (error) {
            console.log(error);
        }
        }
        fetchData();
    }, []);

    return {
        anomalyTypes
    };
}