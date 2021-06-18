import React from 'react';
import {
    BrowserRouter as Router,
    Link,
    Route,
    Switch,
} from 'react-router-dom';
import ConfigurationPage from './components/ConfigurationPage';
import LayoutsPage from './components/LayoutsPage';

function App() {
    return (
        <Router>
            <div>
                <nav className="navbar navbar-expand-lg navbar-light bg-light fixed-top">
                    <div className="container">
                        <Link className="navbar-brand btn" to="/">
                            Home
                        </Link>
                    </div>
                </nav>

                <div className="mt-5 pt-5 container">
                    <Switch>
                        <Route path="/configuration/:id" component={ConfigurationPage}/>
                        <Route path="/" component={LayoutsPage}/>
                    </Switch>
                </div>
            </div>
        </Router>
    );
}

export default App;
