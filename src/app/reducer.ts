import {
    createAction,
    createAsyncThunk,
    createSlice,
    PayloadAction,
    Slice,
} from '@reduxjs/toolkit';
import axios, {AxiosResponse} from 'axios';
import {persistReducer} from 'redux-persist';
import localStorage from 'redux-persist/lib/storage';
import {ROOT_URL} from '../constant';
import {
    DataResponse,
    LayoutView,
    LoadingState,
    State,
} from '../types';
import {RootState} from './store';

const initialState = {
    views: [],
    components: [],
    loading: {
        state: LoadingState.IDLE,
    },
};

/* --------------- Actions ---------------*/
export const fetchData = createAsyncThunk('fetchData', async () => {
    const {data}: AxiosResponse = await axios.get(`${ROOT_URL}/views-manager`);
    return data;
});

export const setLayoutView = createAction<LayoutView>('setLayoutView');

/* --------------- Selectors ---------------*/
const getLoading = (state: RootState) => state.loading;
const getViews = (state: RootState) => state.views;
const getComponents = (state: RootState) => state.components;
const getViewById = (id: string) => (state: RootState) => state.views.find((view: LayoutView) => view.id === id);

export const selectors = {
    getViews,
    getViewById,
    getComponents,
    getLoading,
};

/* --------------- Reducer ---------------*/
const fetchDataPendingReducer = (state: any) => {
    state.loading = {state: LoadingState.REQUEST};
};

const fetchDataFulfilledReducer = (state: any, action: PayloadAction<DataResponse>) => {
    state.views = action.payload.views;
    state.components = action.payload.components;
    state.loading = {state: LoadingState.SUCCESS};
};

const fetchDataRejectedReducer = (state: any, action: PayloadAction<any>) => {
    state.views = [];
    state.loading = {
        state: LoadingState.FAILURE,
        error: action.payload || 'Failed to fetch predefined data',
    };
};

const setLayoutViewReducer = (state: any, action: PayloadAction<LayoutView>) => {
    const view = state.views.find((view: LayoutView) => view.id === action.payload.id);
    if (view) {
        view.componentLayout = action.payload.componentLayout;
    }
};

const slice: Slice<State, any> = createSlice<State, any>({
    name: 'views',
    initialState,
    reducers: {},
    extraReducers: (builder) => {
        builder.addCase(fetchData.pending, fetchDataPendingReducer);
        builder.addCase(fetchData.fulfilled, fetchDataFulfilledReducer);
        builder.addCase(fetchData.rejected, fetchDataRejectedReducer);
        builder.addCase(setLayoutView.type, setLayoutViewReducer);
    },
});

const persistConfig = {
    key: 'views',
    storage: localStorage,
    whitelist: ['views', 'components'],
};

export default persistReducer(persistConfig, slice.reducer);
