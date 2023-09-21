import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle } from '@ionic/react';
import { MINUS_SCORE_FOR_PARTICIPATING } from './constants';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  { question: 'A cosa servono i PUNTI?', answer: 'I punti servono a candidarsi agli eventi. Ogni candidatura costerà '+MINUS_SCORE_FOR_PARTICIPATING+" punti."+"possono guadagnare punti creando eventi con almeno tre partecipanti." },
  { question: "Candidarsi ad un evento ne garantisce la partecipazione?", answer:"No. Solo i partecipanti selezionati dall'host (chi ospita) verranno confermati per l'evento."},
  { question: 'Come ottenere PUNTI?', answer: 'Si possono guadagnare punti creando eventi con almeno tre partecipanti.' },
  { question: "Dove posso ospitare i partecipanti?", answer:"Sta a te scegliere il luogo. Cerca sempre di descrivere più dettagliatamente possibile le circostanze dell'evento e gli ambienti dell'evento. Se per questioni di privacy non fosse desiderabile la tua abitazione privata, potresti prenotare una una camera d'hotel, ad esempio."}


  // { question: 'Question 2', answer: 'Answer 2' },
  // Add more FAQs as needed
];

const FAQPage: React.FC = () => {
  const [showAnswers, setShowAnswers] = useState<boolean[]>(faqs.map(() => false));

  const handleToggle = (index: number) => {
    const newShowAnswers = [...showAnswers];
    newShowAnswers[index] = !newShowAnswers[index];
    setShowAnswers(newShowAnswers);
  };

  return (

        <IonList>
          {faqs.map((faq, index) => (
            <div key={index}>
                <IonItem onClick={() => handleToggle(index)} lines='none'>
                <h2>{faq.question}<IonToggle slot="end" checked={showAnswers[index]} /></h2>
                </IonItem>
                <IonItem key={index} lines='none'>
                {showAnswers[index] && <p>{faq.answer}</p>}</IonItem>
            </div>
          ))}
        </IonList>
  );
};

export default FAQPage;
