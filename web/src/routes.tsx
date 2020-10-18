import React from 'react';
import {
    BrowserRouter as Router,
    Switch,
    Route
} from "react-router-dom";

import LandingPage from './pages/LandingPage';
import OrphanagesMap from './pages/OrphanagesMap';
import CreateOrphanage from './pages/CreateOrphanage';
import Orphanage from './pages/Orphanage';

const Routes = () => {
    return (
        <Router>
            <Switch>
                <Route path="/" exact component={LandingPage} />
                <Route path="/orphanages-map" component={OrphanagesMap} />
                <Route path="/orphanage/create" component={CreateOrphanage} />
                <Route path="/orphanage/:id" component={Orphanage} />
            </Switch>
        </Router>
    );
}

export default Routes;