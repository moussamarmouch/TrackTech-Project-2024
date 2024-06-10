import { useEffect, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';
import { useRecoilState, useRecoilValue } from 'recoil';
import { anomalyTypeFilterState, anomalyStatusFilterState, anomalyFlagFilterState, anomalySeverityFilterState, anomalyStartDateFilterState, anomalyEndDateFilterState, dateSorting, newAnomaly } from '../store/store';
import toast from 'react-hot-toast';

export default function useGetAllAnomalies() {
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const selectedTypes = useRecoilValue(anomalyTypeFilterState);
    const selectedStatus = useRecoilValue(anomalyStatusFilterState);
    const selectedFlag = useRecoilValue(anomalyFlagFilterState);
    const selectedSeverities = useRecoilValue(anomalySeverityFilterState);
    const selectedStartDate = useRecoilValue(anomalyStartDateFilterState);
    const selectedEndDate = useRecoilValue(anomalyEndDateFilterState);
    const selectedDateSorting = useRecoilValue(dateSorting);
    const [socket, setSocket] = useState(null);
    const [newAnomalyReceived, setNewAnomalyReceived] = useState(false);
    const [popupClosed, setPopupClosed] = useState(false);

    const handlePopupClose = () => {
        setPopupClosed(true)
    };

    useEffect(() => {
        if (popupClosed) {
            fetchData();
            setPopupClosed(false);
        }
    }, [popupClosed]);

    const handleSocketMessage = (event) => {
        if (event.data === 'anomaly'){
            setNewAnomalyReceived(true);
            fetchData();
        }
    };

    useEffect(() => {
        // Create a new WebSocket connection
        const newSocket = new WebSocket("ws://54.82.124.29:8000/ws/anomalies");

        newSocket.onmessage = handleSocketMessage;

        newSocket.onclose = () => {
            // Reconnect on socket closure
            setSocket(new WebSocket("ws://54.82.124.29:8000/ws/anomalies"));
        };

        // Set the new socket in the state
        setSocket(newSocket);
        // Clean up the socket connection when the component unmounts
        return () => {
            newSocket.close();
        };
    }, []);

    async function fetchData() {
        setLoading(true);
        try {
            const result = await AnomalyTrackerApi.getAnomaliesFiltered(selectedTypes, selectedStatus, selectedFlag, selectedSeverities, selectedStartDate, selectedEndDate, selectedDateSorting);
            setAnomalies(result.data);
            setNewAnomalyReceived(false);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
    }

    useEffect(() => {
        fetchData();
        setNewAnomalyReceived(false);
    }, [selectedTypes, selectedStatus, selectedFlag, selectedSeverities, selectedStartDate, selectedEndDate, selectedDateSorting, newAnomalyReceived]);

    return {
        anomalies,
        loading,
        newAnomalyReceived,
        handlePopupClose,
    };
}
