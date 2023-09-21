import React, { useContext, useEffect } from 'react';
import {
  IonChip,
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { exit, pencil, people, peopleOutline, person, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import {  UserContext } from './constants';
import Score from './Score';
import { questionnaireExistsLocally } from './foo';

interface AppPage {
  url: string;
  iosIcon: string;
  mdIcon: string;
  title: string;
}

const appPages: AppPage[] = [
  {
    title: 'Regole',
    url: '/rules',
    iosIcon: warningOutline,
    mdIcon: warningSharp
  },
  {
    title: 'Questionario',
    url: '/test',
    iosIcon: person,
    mdIcon:  person
  },
  {
    title: 'Pubblica',
    url: '/publish',
    iosIcon: pencil,
    mdIcon: pencil
  },
  {
    title: 'Incontra',
    url: '/meet',
    iosIcon: people,
    mdIcon: peopleOutline
  },
  
  {
    title: 'Esci',
    url: '/logout',
    iosIcon: exit,
    mdIcon: exit
  }
];


const Menu: React.FC = () => {
  const { score, checkQ, setCheckQ } = useContext(UserContext);



  useEffect(() => {
    const checkQuestionnaire = async () => {
      const check = await questionnaireExistsLocally();
      setCheckQ(check);
    }

    checkQuestionnaire();
  }, [checkQ]);

  

  const location = useLocation();
 
  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list" lines="none">
          {Score(score)}
          {appPages.map((appPage, index) => {
            if(checkQ === true || appPage.title === "Questionario"){
              return (
                <IonMenuToggle key={index} autoHide={false}>
                  <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                    <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                    <IonLabel>{appPage.title}</IonLabel>
                  </IonItem>
                </IonMenuToggle>
              );
            }
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
