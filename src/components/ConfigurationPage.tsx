import {find as _find} from 'lodash';
import React, {
    useCallback,
    useState,
} from 'react';
import {
    Layout,
    Responsive,
    WidthProvider,
} from 'react-grid-layout';
import {
    Redirect,
    useHistory,
    useParams,
} from 'react-router-dom';
import {
    useAppDispatch,
    useAppSelector,
} from '../app/hooks';
import {
    selectors,
    setLayoutView,
} from '../app/reducer';
import {
    Component,
    ComponentLayout,
} from '../types';
import DraggableComponent from './DraggableComponent';
import LayoutItem from './LayoutItem';

const ResponsiveReactGridLayout = WidthProvider(Responsive);

const droppingItem = {
    i: '__dropping-elem__',
    w: 5,
    h: 6,
};

const ConfigurationPage = () => {
    const dispatch = useAppDispatch();
    const history = useHistory();
    let {id} = useParams<{ id: string }>();

    const view = useAppSelector(selectors.getViewById(id));
    const draggableComponents = useAppSelector(selectors.getComponents);

    const [layout, setLayout] = useState<ComponentLayout[]>(() =>view ?  view.componentLayout.map(layout => ({
        ...layout,
        minW: 3,
        minH: 2,
    })): []);

    const [component, setComponent] = useState<Component>();

    const mapLayout = useCallback((currentLayout: ComponentLayout[], newLayout: Layout[]) => {
        return currentLayout.map(componentLayout => {
            const found = _find(newLayout, ['i', componentLayout.i]);
            return {...componentLayout, ...found};
        });
    }, []);

    const handleDragStart = useCallback((dragComponent: Component) => {
        setComponent(dragComponent);
    }, []);

    const onDrop = useCallback((layouts: Layout[], item: Layout) => {
        setLayout(prev =>
            mapLayout(prev, layouts).concat({
                ...item,
                i: new Date().getTime().toString(),
                component,
                isDraggable: undefined,
                minW: 3,
                minH: 2,
            }),
        );
    }, [component, mapLayout]);

    const onRemoveItem = useCallback((i: string) => {
        setLayout(prev => prev.filter(l => l.i !== i));
    }, []);

    const onLayoutChange = useCallback((layouts: Layout[]) => {
        setLayout(prev => mapLayout(prev, layouts));
    }, [mapLayout]);

    const handleSave = useCallback(() => {
        if (view) {
            dispatch(setLayoutView({...view, componentLayout: layout}));
        }
        history.push('/');
    }, [dispatch, history, view, layout]);

    if (!view) {
        return <Redirect push to="/"/>;
    }

    return (
        <div className="row justify-content-between">
            <div className="col-2 p-0">
                <h4 className="mb-4 pb-3 border-bottom">Components</h4>
                <div className="row d-flex flex-column">
                    {
                        draggableComponents.map(component => (
                            <DraggableComponent
                                key={component.id}
                                component={component}
                                handleDragStart={handleDragStart}
                            />
                        ))
                    }
                </div>
            </div>
            <div className="col-12 col-sm-9">
                <div className="row mb-4 pb-2 border-bottom justify-content-between">
                    <h4 className="col p-0">
                        Configuration Screen - {view.name}
                    </h4>
                    <div className="col-2 text-end p-0">
                        <button className="btn" onClick={handleSave}>Save</button>
                    </div>
                </div>
                <div className="row">
                    <ResponsiveReactGridLayout
                        className="layout border p-0 configuration-layout"
                        cols={{lg: 24}}
                        layouts={{lg: layout}}
                        breakpoints={{lg: 0}}
                        rowHeight={7}
                        compactType={null}
                        isDroppable
                        onDrop={onDrop}
                        onLayoutChange={onLayoutChange}
                        droppingItem={droppingItem}
                    >
                        {
                            layout.map(componentLayout => (
                                <div
                                    key={componentLayout.i}
                                    className="card bg-light justify-content-center align-items-center"
                                >
                                    <span
                                        role="button"
                                        className="remove position-absolute end-0 p-1 top-0"
                                        onClick={() => onRemoveItem(componentLayout.i)}
                                    >
                                        x
                                    </span>
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

export default ConfigurationPage;
