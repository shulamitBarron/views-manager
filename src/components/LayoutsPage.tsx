import React, {
    useCallback,
    useEffect,
} from 'react';
import {
    useAppDispatch,
    useAppSelector,
} from '../app/hooks';
import {
    fetchData,
    selectors,
} from '../app/reducer';
import {LoadingState} from '../types';
import Layout from './Layout';

const LayoutsPage = () => {
    const dispatch = useAppDispatch();
    const views = useAppSelector(selectors.getViews);
    const loading = useAppSelector(selectors.getLoading);
    const fetch = useCallback(() => dispatch(fetchData()), [dispatch]);

    useEffect(() => {
        /* TODO: remove condition when we will save the data on server */
        if (!views.length) {
            fetch();
        }
    }, [fetch, views.length]);

    if (loading.state === LoadingState.REQUEST) {
        return <div className="text-center">Loading...</div>;
    }

    if (loading.state === LoadingState.FAILURE) {
        return (
            <div className="d-flex flex-column align-items-center">
                <div className="m-2 text-danger">{loading.error}</div>
                <button
                    className="btn border"
                    onClick={fetch}
                >
                    Reload
                </button>
            </div>
        );
    }

    return (
        <div>
            <div className="row mb-4 pb-2 border-bottom justify-content-between">
                <h4 className="col p-0">
                    Layout Screen
                </h4>
                <div className="col-3 text-end p-0">
                    <button className="btn" onClick={fetch}>Reset Changes (Also from local storage)</button>
                </div>
            </div>
            <div className="row">
                {views.map(view => <Layout key={view.id} view={view}/>)}
            </div>
        </div>
    )
};

export default LayoutsPage;
