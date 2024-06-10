import { useEffect, useState } from 'react';
import AnomalyTrackerApi from '../apis/anomalytrackerapi';
import { useRecoilValue } from 'recoil';
import { assetTypeFilterState, assetFlagFilterState, assetStartDateFilterState, assetEndDateFilterState, assetDateSorting } from '../store/store';


export default function useGetAllAssets() {
    const [assets, setAssets] = useState([]);
    const [loading, setLoading] = useState(true);
    const assetTypes = useRecoilValue(assetTypeFilterState);
    const selectedFlag = useRecoilValue(assetFlagFilterState);
    const selectedStartDate = useRecoilValue(assetStartDateFilterState);
    const selectedEndDate = useRecoilValue(assetEndDateFilterState);
    const selectedDateSorting = useRecoilValue(assetDateSorting);
    const [newAssetReceived, setnewAssetReceived] = useState(false);
    const [socket, setSocket] = useState(null);
    const [popupClosed, setPopupClosed] = useState(false);

    const handlePopupClose = () => {
        setPopupClosed(true);
    };

    useEffect(() => {
        if (popupClosed) {
            fetchData();
            setPopupClosed(false)
        }
    }, [popupClosed]);

    const handleSocketMessage = (event) => {
        if(event.data === "asset"){
            setnewAssetReceived(true);
            fetchData()
        };
    };

    useEffect(() => {
        // Create a new WebSocket connection
        const newSocket = new WebSocket("ws://54.82.124.29:8000/ws/assets");

        newSocket.onmessage = handleSocketMessage;

        newSocket.onclose = () => {
            // Reconnect on socket closure
            setSocket(new WebSocket("ws://54.82.124.29:8000/ws/assets"));
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
            const result = await AnomalyTrackerApi.getAssetsFiltered(assetTypes, selectedFlag, selectedStartDate, selectedEndDate, selectedDateSorting);
            setAssets(result.data);
            setnewAssetReceived(false);
        } catch (error) {
            console.log(error);
        }
        setLoading(false);
        }

    useEffect(() => {
        fetchData();
        setnewAssetReceived(false);
    }, [assetTypes, selectedFlag, selectedStartDate, selectedEndDate, selectedDateSorting, newAssetReceived]);

    
    return {
        assets,
        loading,
        newAssetReceived,
        handlePopupClose
    };
}