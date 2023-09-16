import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonItem, IonLabel, IonInput, IonButton, IonTextarea, IonAlert, IonDatetime, IonNote, IonGrid } from '@ionic/react';
import { storeUserAd } from './foo';
import { USER_ID } from './constants';
import { useHistory } from 'react-router';

const AdForm: React.FC = () => {
    const [place1, setPlate1] = useState('');
    const [place2, setPlate2] = useState('');
    const [date, setDate] = useState(new Date().toISOString());
    const [time, setTime] = useState(new Date().toISOString().split('T')[1].split(':').join('').slice(0,4));
    const [code, setCode] = useState('');
    const [males, setMales] = useState<number>(0);
    const [females, setFemales] = useState(0);
    const [formMessage, setFormMessage] = useState('');
    const [adDescription, setAdDescription] = useState('');
    const [validated, setValidated] = useState(false);

    const history = useHistory();
    
    const submitForm = async () => {
      const validationMessage = formValidator();
      
      if (validationMessage !== true) {
          setFormMessage(validationMessage);
          return;
      }else{
          setFormMessage('');
          setValidated(true);
      }

      const uid = await USER_ID();
      storeUserAd(
        uid,
        place1,
        place2,
        date,
        time,
        adDescription,
        code,
        males,
        females
      )
    }

    const inputStyle = {
      border: '2px solid black',
      borderRadius: '5px',
      marginBottom:"10px"
    };

    const textAreaStyle = {
      border: '2px solid black',
      borderRadius: '5px',
      minHeight: '100px',
      fontSize: '18px',
      marginBottom:"10px"
    };



    /* VALIDATE ALL FORM DATA BELOW */
    const formValidator = () => {
      // Check if all fields are filled
      if (!place1 || !place2 || !time || !adDescription || !code) {
          return 'Tutti i campi sono obbligatori';
      }


      // Check if date is in the future
      const today = new Date();
      const todayString = today.toISOString().split('T')[0].split('-').join('');
      if (date < todayString) {
          return 'La data dovrebbe essere nel futuro.';
      }



      // Check if places are strings
      if (typeof place1 !== 'string' || typeof place2 !== 'string') {
          return 'Il luogo dovrebbe essere una stringa.';
      }      


      // Check if adDescription is a string
      if (typeof adDescription !== 'string') {
          return 'La descrizione dovrebbe essere una stringa.';
      }

      // Check if code is a string
      if (typeof code !== 'string') {
          return 'Il codice dovrebbe essere una stringa.';
      }

      // Check if males and females are numbers and greater than or equal to 0
      if (typeof males !== 'number' || males < 0 || typeof females !== 'number' || females < 0) {
          return 'Il numero di maschi e femmine dovrebbe essere un numero maggiore o uguale a 0.';
      }

      // Check if males + females is greater than 1
      if(males + females <= 1){
        return 'Il numero totale di partecipanti dovrebbe essere maggiore di 1.';
      }

      // Description must be at least 30 characters long
      if (adDescription.length < 30) {
          return 'La descrizione dovrebbe essere di almeno 30 caratteri.';
      }

      // Code must be at least 3 characters long
      if (code.length < 3) {
          return 'Il codice dovrebbe essere di almeno 3 caratteri.';
      }

      // If all checks pass, return true
      return true;
    }

  const handleDateTimeChange = (e: any) => {
    // Get Date from event as YYYYMMDD
    const date = e.detail.value.split('T')[0].split('-').join('');
    // Get Time from event as HHMM
    const time = e.detail.value.split('T')[1].split(':').join('');
    // Set Date and Time
    setDate(date);
    setTime(time);

  };

  const resetData = () => {
    setPlate1('');
    setPlate2('');
    setDate(new Date().toISOString());
    setTime('');
    setCode('');
    setMales(0);
    setFemales(0);
    setAdDescription('');
  }

  const centerMe = {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: '0px',
    paddingBottom: '0px',
    width: '100%'
  }




  return (
        <>
            <IonAlert
            isOpen={formMessage !== ""}
            onDidDismiss={() => setFormMessage('')}
            header="Attenzione"
            message={formMessage}
            buttons={['OK']} />

            <IonAlert
            isOpen={validated}
            onDidDismiss={() => {history.push('/host')}}
            header="Complimenti!"
            message={"Annuncio pubblicato con successo!"}
            buttons={['OK']} />


            <>
            
            <IonLabel style={centerMe}>Seleziona data e ora:</IonLabel>
            
            <div style={centerMe}>
            <IonDatetime
              presentation='date-time'
              preferWheel={true}
              value={date}
              onIonChange={handleDateTimeChange}
              multiple={false}
              locale="it-IT"
              min={new Date().toISOString()}
              >
                
            </IonDatetime>
            </div>

            <IonInput style={inputStyle}
            placeholder="Luogo IMPRECISO (= visibile a tutti)"
            value={place1} onIonChange={e => setPlate1(e.detail.value!)}></IonInput>
            
            <IonInput style={inputStyle}
            placeholder="Luogo ESATTO (= visibile solo ai selezionati)"
            value={place2} onIonChange={e => setPlate2(e.detail.value!)}></IonInput>

            <IonLabel>Descrizione, informazioni, modalità di svolgimento, ecc. Metterai a disposizione maschere per anonimizzare i partecipanti? Preservativi?</IonLabel>
            <IonTextarea style={textAreaStyle}
            placeholder="Descrizione"
            value={adDescription} onIonChange={e => setAdDescription(e.detail.value!)}></IonTextarea>
            
            <IonInput style={inputStyle}
            placeholder="Scegli una parola in codice (può essere un numero o codice casuale) per far entrare"
            value={code} onIonChange={e => setCode(e.detail.value!)}></IonInput>
            
            <IonLabel>Numero totale<b>(*)</b> MASCHI:</IonLabel>
            <IonInput style={inputStyle}
            value={males}
            type="number"
            min={0}
            onIonChange={e => setMales(parseInt(e.detail.value!))}
            ></IonInput>

            <IonLabel>Numero totale<b>(*)</b> FEMMINE:</IonLabel>
            <IonInput style={inputStyle}
            value={females} 
            type="number"
            min={0}
            onIonChange={e => setFemales(parseInt(e.detail.value!))}
            />
            <IonButton size="large" color="light" onClick={submitForm}>Pubblica</IonButton>
            <p>
              <IonNote><b>(*)</b> Il numero comprende tutti i partecipanti, compreso l&apos;organizzatore.</IonNote>
            </p>
            </>
            
        </>
  );
};

export default AdForm;
