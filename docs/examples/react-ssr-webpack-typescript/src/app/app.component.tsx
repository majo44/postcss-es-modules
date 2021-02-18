import { createElement, useEffect, useState } from 'react';
import { AComponent } from './components/a.component';
import { BComponent } from './components/b.component';

// simple application
export const App = ({ showBComponent }:{ showBComponent?: boolean }) => {

    // keeping the state of application
    const [showed, setShow] = useState(showBComponent);

    // this is just for reflect state within the url
    useEffect(() => {
        if (typeof window !== 'undefined') {
            window.history.pushState(
                {}, '', `${window.location.href.split('?')[0]}${showed ? '?showBComponent=true': ''}`);
        }
    }, [showed]);

    // rendering
    return <div>
        <button onClick={() =>  setShow(!showed)}> Show/hide second component. </button>
        <AComponent/>
        {showed && <BComponent/>}
    </div>
}
