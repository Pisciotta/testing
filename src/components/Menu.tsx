import React from 'react';
import {
  IonContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonList,
  IonListHeader,
  IonMenu,
  IonMenuToggle,
  IonNote,
} from '@ionic/react';

import { useLocation } from 'react-router-dom';
import { helpCircle, listCircle, newspaper, paperPlaneOutline, paperPlaneSharp, pencil, warningOutline, warningSharp } from 'ionicons/icons';
import './Menu.css';
import {  SCORE } from './constants';

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
    iosIcon: listCircle,
    mdIcon: listCircle
  },
  {
    title: 'Chiedi',
    url: '/faq',
    iosIcon: helpCircle,
    mdIcon: helpCircle
  },
  {
    title: 'Incontra',
    url: '/meet',
    iosIcon: newspaper,
    mdIcon: newspaper
  },
  {
    title: 'Pubblica',
    url: '/publish',
    iosIcon: pencil,
    mdIcon: pencil
  },
  {
    title: 'Invita',
    url: '/invite',
    iosIcon: paperPlaneOutline,
    mdIcon: paperPlaneSharp
  }
];


const Menu: React.FC = () => {
  const location = useLocation();

  return (
    <IonMenu contentId="main" type="overlay">
      <IonContent>
        <IonList id="inbox-list" lines="none">
          <IonListHeader>Punteggio</IonListHeader>
          <IonNote>{SCORE}</IonNote>
          {appPages.map((appPage, index) => {
            return (
              <IonMenuToggle key={index} autoHide={false}>
                <IonItem className={location.pathname === appPage.url ? 'selected' : ''} routerLink={appPage.url} routerDirection="none" lines="none" detail={false}>
                  <IonIcon aria-hidden="true" slot="start" ios={appPage.iosIcon} md={appPage.mdIcon} />
                  <IonLabel>{appPage.title}</IonLabel>
                </IonItem>
              </IonMenuToggle>
            );
          })}
        </IonList>
      </IonContent>
    </IonMenu>
  );
};

export default Menu;
