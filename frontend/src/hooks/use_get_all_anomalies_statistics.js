import { useEffect, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';
import { useRecoilValue } from 'recoil';
import { dateSorting, anomalyTypeFilterState, anomalyStatusFilterStateStatistics, anomalyFlagFilterStateStatistics, anomalySeverityFilterState, anomalyStartDateFilterState, anomalyEndDateFilterState } from '../store/store';

export default function useGetAllAnomaliesStatistics() {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const selectedType = useRecoilValue(anomalyTypeFilterState);
    const selectedStatus = useRecoilValue(anomalyStatusFilterStateStatistics);
    const selectedFlag = useRecoilValue(anomalyFlagFilterStateStatistics);
    const selectedSeverity = useRecoilValue(anomalySeverityFilterState);
    const selectedStartDate = useRecoilValue(anomalyStartDateFilterState);
    const selectedEndDate = useRecoilValue(anomalyEndDateFilterState);
    const selectedDateSorting = useRecoilValue(dateSorting);

    useEffect(() => {
        async function fetchData() {
        setLoading(true);
        try {
            const result = await AnomalyTrackerApi.getAnomaliesFiltered(selectedType, selectedStatus, selectedFlag, selectedSeverity, selectedStartDate, selectedEndDate, selectedDateSorting);
            setAnomalies(result.data);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        }
        fetchData();
    }, [selectedType, selectedStatus, selectedFlag, selectedSeverity, selectedStartDate, selectedEndDate, selectedDateSorting]);

    return {
        anomalies,
        loading
    };
}