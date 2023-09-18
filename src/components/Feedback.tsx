import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonInput, IonButton, IonLabel, IonText, IonTextarea } from '@ionic/react';
import { getUserId, storeUserFeedback } from './foo';

const FeedbackForm: React.FC = () => {
  const [feedback, setFeedback] = useState('');
  const [showModal, setShowModal] = useState(false);

  const handleFeedbackChange = (event: CustomEvent) => {
    setFeedback(event.detail.value);
  };

  const handleSubmit = async () => {
    // Handle the submission of the feedback
    const uid = await getUserId();
    if(uid){
      storeUserFeedback(uid, feedback);
      setFeedback('');
      setShowModal(true);
    }
  };

  const thanksForYourFeedback = (
    <div className="thanksForYourFeedback">
      <p>Grazie per il tuo feedback!</p>
    </div>
  );

  return (
    <div className='ion-text-center'>
        { showModal ? thanksForYourFeedback : <>
            <IonLabel>Altre domande? Suggerimenti? Scrivi qui:</IonLabel>
            <IonTextarea className="textarea-border" onIonChange ={handleFeedbackChange} >
                {feedback}
            </IonTextarea>
            <IonButton expand="full" color="light" onClick={handleSubmit}>Invia</IonButton>
        </>
        }
    </div>

  );
};

export default FeedbackForm;
