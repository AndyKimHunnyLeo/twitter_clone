import React, { Fragment, useEffect, useState } from 'react';
import AppRouter from 'components/Router';
import { authService } from 'fbase';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [init, setInit] = useState(false);
  // console.log(authService.currentUser);

  useEffect(() => {
    authService.onAuthStateChanged((user) => {
      if (user) {
        setIsLoggedIn(true);
      } else {
        setIsLoggedIn(false);
      }
      setInit(true);
    });
  }, []);

  return (
    <Fragment>
      {init ? <AppRouter isLoggedIn={isLoggedIn} /> : <div>Initializing</div>}
    </Fragment>
  );
}

export default App;
