import React, { Fragment, useState } from 'react';
import { HashRouter as Router, Route, Switch } from 'react-router-dom';
import Auth from '../routes/Auth';
import Home from '../routes/Home';

const AppRouter = () => {
  const [isloggedIn, setIsLoggedIn] = useState(false);
  return (
    <Router>
      <Switch>
        {isloggedIn ? (
          <Fragment>
            <Route>
              <Home />
            </Route>
          </Fragment>
        ) : (
          <Route>
            <Auth />
          </Route>
        )}
      </Switch>
    </Router>
  );
};

export default AppRouter;
