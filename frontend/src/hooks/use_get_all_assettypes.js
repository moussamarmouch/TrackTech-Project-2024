import { useEffect, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';

export default function useGetAllAssetTypes() {
    const [assetTypes, setAssetTypes] = useState([]);

    useEffect(() => {
        async function fetchData() {
        try {
            const result = await AnomalyTrackerApi.getAssetTypes();
            setAssetTypes(result.data);
        } catch (error) {
            console.log(error);
        }
        }
        fetchData();
    }, []);

    return {
        assetTypes
    };
}