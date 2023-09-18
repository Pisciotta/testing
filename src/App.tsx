import React, { useCallback, useEffect, useState } from 'react';
import { IonApp, IonRouterOutlet, IonSplitPane, setupIonicReact } from '@ionic/react';
import { IonReactRouter } from '@ionic/react-router';
import { Redirect, Route, Switch } from 'react-router-dom';
import Menu from './components/Menu';
import Page from './pages/Page';

/* Core CSS required for Ionic components to work properly */
import '@ionic/react/css/core.css';

/* Basic CSS for apps built with Ionic */
import '@ionic/react/css/normalize.css';
import '@ionic/react/css/structure.css';
import '@ionic/react/css/typography.css';

/* Optional CSS utils that can be commented out */
import '@ionic/react/css/padding.css';
import '@ionic/react/css/float-elements.css';
import '@ionic/react/css/text-alignment.css';
import '@ionic/react/css/text-transformation.css';
import '@ionic/react/css/flex-utils.css';
import '@ionic/react/css/display.css';

/* Theme variables */
import './theme/variables.css';
import SignIn from './pages/SignIn';
import { getPoints, isUserAuthenticated } from './components/foo';
import { INITIAL_SCORE, UserContext } from './components/constants';

setupIonicReact();

const App: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);
  const [score, setScore] = useState(INITIAL_SCORE);
  const [dataLoaded, setDataLoaded] = useState(false);

  const loadData = useCallback(async () => {
    const points = await getPoints();
    setScore(points);
    setDataLoaded(true);
  }, []);

  const checkAuth = useCallback(async () => {
    const authStatus = await isUserAuthenticated();
    setIsAuth(authStatus);
  }, []);

  useEffect(() => {
    loadData();
    checkAuth();
  }, []);

  if(dataLoaded === false){
    return null;
  }


  return (
    isAuth ? (
      <IonApp>
        <UserContext.Provider value={{ score, setScore }}>
          <IonReactRouter>
            <IonSplitPane contentId="main">
              <Menu />
              <IonRouterOutlet id="main">
                <Switch>
                  <Route path="/:name" exact={true}>
                    <Page />
                  </Route>
                  <Redirect to="/rules" />
                </Switch>
              </IonRouterOutlet>
            </IonSplitPane>
          </IonReactRouter>
        </UserContext.Provider>
      </IonApp>
    ) : (
      <SignIn />
    )
  );
};

export default App;
