import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonNote } from '@ionic/react';
import 'firebase/auth';
import { addLoginUser, firebaseConfig, isUserAuthenticated, storeUserId } from '../components/foo';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const SignIn: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {
    const checkAuth = async () => {
      const authStatus = await isUserAuthenticated();
      setIsAuth(authStatus);
      
    }
    checkAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const provider = new firebase.auth.GoogleAuthProvider();
      const result = await firebase.auth().signInWithPopup(provider);
      
      if (result.user) {
        await addLoginUser(result.user.uid, result.user.email, result.user.displayName, result.user.photoURL);
        await storeUserId(result.user.uid);
        setIsAuth(true);
      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle>Accedi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="full" onClick={signInWithGoogle}>Accedi con Google</IonButton>
      </IonContent>
      <IonNote className='ion-text-center'>
        Nessuna email, notifica o messaggio di conferma verrà mandato da questa applicazione.
      </IonNote>
    </IonPage>
  );
};

export default SignIn;
