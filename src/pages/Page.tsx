import React, { useEffect } from 'react';
import { IonButtons, IonContent, IonHeader, IonMenuButton, IonPage, IonTitle, IonToolbar } from '@ionic/react';
import { useParams } from 'react-router';
import ExploreContainer from '../components/ExploreContainer';
import './Page.css';
import { PAGE_TO_TITLE } from '../components/constants';
import { questionnaireExistsLocally } from '../components/foo';

const Page: React.FC = () => {
  const [ nameState, setNameState ] = React.useState("");
  const { name } = useParams<{ name: string; }>();

  

  useEffect(() => {
    const checkQuestionnaire = async () => {
      const check = await questionnaireExistsLocally();
      if(check !== true && name !== "Questionario"){
        setNameState("test");
      }else{
        setNameState(name);
      }
    }

    checkQuestionnaire();
  }, [name]);


  if(nameState === "" || nameState === undefined){
    return <></>
  }

  
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonButtons slot="start">
            <IonMenuButton />
          </IonButtons>
          <IonTitle className='ion-text-center'>{PAGE_TO_TITLE[nameState]}</IonTitle>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <IonHeader collapse="condense">
          <IonToolbar>
            <IonTitle size="large">{nameState}</IonTitle>
          </IonToolbar>
        </IonHeader>
        <ExploreContainer name={nameState} />
      </IonContent>
    </IonPage>
  );
};

export default Page;
