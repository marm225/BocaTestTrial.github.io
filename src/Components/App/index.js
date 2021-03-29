import React from 'react';
// import {Helmet} from 'react-helmet';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import Navigation from '../Navigation';
import Home from '../Home';
import NewBoca from '../BoCa/New';


const App = () => {
    return (<>
            {/*<Helmet>*/}
            {/*    <title>BoCa</title>*/}
            {/*    <meta name="apple-mobile-web-app-capable" content="yes"/>*/}
            {/*</Helmet>*/}
            <Router>
                <Navigation/>
                <hr/>
                <Switch>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/boca/new" component={NewBoca}/>
                </Switch>
            </Router>
        </>
    );
};

export default App;
