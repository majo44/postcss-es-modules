import { createElement } from 'react';
import { hydrate } from 'react-dom';
import { App } from './app/app.component';

// hydrate the prerendered application
hydrate(
    <App showBComponent={(window as any).showBComponent}/>,
    document.getElementById('app'));
