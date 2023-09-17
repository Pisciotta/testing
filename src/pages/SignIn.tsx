import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton, IonNote } from '@ionic/react';
import 'firebase/auth';
import { addLoginUser, firebaseConfig } from '../components/foo';
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
} else {
  firebase.app();
}

const SignIn: React.FC = () => {
  const signInWithGoogle = () => {
    const provider = new firebase.auth.GoogleAuthProvider();
    firebase.auth().signInWithPopup(provider)
      .then((result) => {
        // Check if credential exists
        if (result.credential ) {
          const credential = result.credential as firebase.auth.OAuthCredential;
          
          // This gives you a Google Access Token.
          // You can use it to access the Google API.
          const token = credential.accessToken;
        }
        
        
        // The signed-in user info.
        const user = result.user;
        
        if(user){
          addLoginUser(user.uid, user.email, user.displayName, user.photoURL);
          // add user id to local storage
          localStorage.setItem('isAuthenticated', 'true');
          localStorage.setItem('userId', user.uid);
          // Redirect to home page
          window.location.href = '/';

        } 
      }).catch((error) => {
        // Handle Errors here.
        console.error(error);
      });
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
