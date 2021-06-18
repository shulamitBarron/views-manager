import React from 'react';
import {ComponentLayout} from '../types';

interface Props {
    componentLayout: ComponentLayout;
}

const LayoutItem: React.FC<Props> = ({componentLayout}) => {
    return (
        <span className="text">
            {componentLayout.component ? componentLayout.component.name : componentLayout.i}
        </span>
    )
};

export default LayoutItem;
