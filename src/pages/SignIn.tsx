import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonNote } from '@ionic/react';
import 'firebase/auth';
import { addLoginUser, firebaseConfig, isUserAuthenticated, storeUserId } from '../components/foo';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import { useHistory } from 'react-router';


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
      setIsAuth(authStatus.isAuthenticated && authStatus.whitelisted);
      if(authStatus.isAuthenticated && authStatus.whitelisted){
        window.location.href="/test";
      }
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
        window.location.href="/test";

      }
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar>
          <IonTitle className="ion-text-center">Accedi</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <IonButton expand="block" size="large" color="dark" onClick={signInWithGoogle}>Accedi con Google</IonButton>
      </IonContent>
      
    </IonPage>
  );
};

export default SignIn;
