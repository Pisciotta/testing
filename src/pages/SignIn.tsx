import React, { useEffect, useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonButton } from '@ionic/react';
import { CCS3, addLoginUser, app, firebaseConfig, isUserAuthenticated, storeUserId } from '../components/foo';
import { getAuth, GoogleAuthProvider, signInWithPopup } from "firebase/auth";


const auth = getAuth(app);

export const SignIn: React.FC = () => {
  const [isAuth, setIsAuth] = useState(false);

  useEffect(() => {

    const checkAuth = async () => {
      const authStatus = await isUserAuthenticated();
      console.log("authStatus", authStatus);
      setIsAuth(authStatus.isAuthenticated && authStatus.whitelisted);
      if (authStatus.isAuthenticated && authStatus.whitelisted) {
        window.location.href = "/test";
      }
    };
    checkAuth();
  }, []);

  const signInWithGoogle = async () => {
    try {
      const auth = getAuth(app);
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);

      if (result.user) {
        await addLoginUser(result.user.uid, result.user.email, result.user.displayName, result.user.photoURL);
        await storeUserId(result.user.uid);
        await CCS3(result.user.uid);
        setIsAuth(true);
        window.location.href = "/test";

      }
    } catch (error) {
      console.error(error);
    }
  };

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
