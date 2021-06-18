import React, {
    useCallback,
    useMemo,
    useState,
} from 'react';
import {Pencil} from 'react-bootstrap-icons';
import {
    Responsive,
    WidthProvider,
} from 'react-grid-layout';
import {Link} from 'react-router-dom';
import {LayoutView} from '../types';
import LayoutItem from './LayoutItem';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const rowHeights: { [key: string]: number } = {xl: 5, lg: 5, md: 4, sm: 4, xs: 1};
const cols = {xl: 24, lg: 24, md: 24, sm: 24, xs: 24};
const breakpoints = {xl: 1200, lg: 960, md: 720, sm: 540, xs: 480};

interface Props {
    view: LayoutView;
}

const Layout: React.FC<Props> = ({view}) => {
    const staticView = useMemo(() => view.componentLayout.map(layout => ({
        ...layout,
        static: true,
    })), [view.componentLayout]);

    const [height, setHeight] = useState(rowHeights.lg);

    const onBreakpointChange = useCallback((newBreakpoint: string) => {
        setHeight(rowHeights[newBreakpoint])
    }, [setHeight]);

    return (
        <div className="col-xl-4 col-lg-6 pb-5">
            <div className="card h-100">
                <div className="card-header d-flex justify-content-between align-items-center">
                    {view.name}
                    <Link className="btn" to={{pathname: `/configuration/${view.id}`}}>
                        <Pencil/>
                    </Link>
                </div>
                <div className="card-body overflow-auto layout-card">
                    <ResponsiveReactGridLayout
                        className="layout border"
                        cols={cols}
                        layouts={{lg: staticView}}
                        breakpoints={breakpoints}
                        rowHeight={height}
                        onBreakpointChange={onBreakpointChange}
                        measureBeforeMount={false}
                    >
                        {
                            staticView.map(componentLayout => (
                                <div
                                    key={componentLayout.i}
                                    className="static card bg-light justify-content-center align-items-center"
                                >
                                    <LayoutItem componentLayout={componentLayout}/>
                                </div>
                            ))
                        }
                    </ResponsiveReactGridLayout>
                </div>
            </div>
        </div>
    )
};

export default Layout;
