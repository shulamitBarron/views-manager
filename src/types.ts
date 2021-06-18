import {Layout} from 'react-grid-layout';

export enum LoadingState {
    IDLE = 'IDLE',
    REQUEST = 'REQUEST',
    SUCCESS = 'DONE',
    FAILURE = 'FAILURE'
}

export interface State {
    views: LayoutView[];
    components: Component[];
    loading: {
        state: LoadingState;
        error?: string;
    }
}

export interface LayoutView {
    id: string;
    name: string;
    componentLayout: ComponentLayout[];
}

export interface ComponentLayout extends Layout {
    component?: Component;
}

export interface Component {
    id: string;
    name: string;
}

export interface DataResponse {
    views: LayoutView[];
    components: Component[];
}
