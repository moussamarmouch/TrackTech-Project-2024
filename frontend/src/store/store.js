import { atom } from 'recoil';

export const anomalyTypeFilterState = atom({
    key: 'anomalyTypeFilterState',
    default: [],
});

export const anomalyStatusFilterState = atom({
    key: 'anomalyStatusFilterState',
    default: 'false',
});

export const anomalyFlagFilterState = atom({
    key: 'anomalyFlagFilterState',
    default: 'false',
});

export const anomalySeverityFilterState = atom({
    key: 'anomalySeverityFilterState',
    default: [],
});

export const anomalyStartDateFilterState = atom({
    key: 'anomalyStartDateFilterState',
    default: '',
});

export const anomalyEndDateFilterState = atom({
    key: 'anomalyEndDateFilterState',
    default: '',
});

export const mapZoom = atom({
    key: 'mapZoom',
    default: 8,
});

export const latLong = atom({
    key: 'latLong',
    default: [50.5503, 4.3517],
});

export const anomalyStatusFilterStateStatistics = atom({
    key: 'anomalyStatusFilterStateStatistics',
    default: 'all',
});

export const anomalyFlagFilterStateStatistics = atom({
    key: 'anomalyFlagFilterStateStatistics',
    default: 'all',
});

export const setHeatMap = atom({
    key: 'setHeatMap',
    default: {
                name: "normal map",
                isHeatMap: false
            },
});

export const isStatistics = atom({
    key: 'isStatistics',
    default: false,
});

export const dateSorting = atom({
    key: 'dateSorting',
    default: true,
});

export const assetDateSorting = atom({
    key: 'assetDateSorting',
    default: true,
});

export const assetTypeFilterState = atom({
    key: 'assetTypeFilterState',
    default: [],
});

export const assetFlagFilterState = atom({
    key: 'assetFlagFilterState',
    default: 'false',
});

export const assetStartDateFilterState = atom({
    key: 'assetStartDateFilterState',
    default: '',
});

export const assetEndDateFilterState = atom({
    key: 'assetEndDateFilterState',
    default: '',
});

export const isModelOpen = atom({
    key: 'isModelOpen',
    default: false,
});

export const newAnomaly = atom({
    key: 'newAnomaly',
    default: false,
});

export const isUpdated = atom({
    key: 'isUpdated',
    default: false,
});