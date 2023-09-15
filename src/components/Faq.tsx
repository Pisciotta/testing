import React, { useState } from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonList, IonItem, IonLabel, IonToggle } from '@ionic/react';

interface FAQ {
  question: string;
  answer: string;
}

const faqs: FAQ[] = [
  // { question: 'Question 1', answer: 'Answer 1' },
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
            <IonItem key={index} onClick={() => handleToggle(index)}>
              <IonLabel>
                <h2>{faq.question}</h2>
                {showAnswers[index] && <p>{faq.answer}</p>}
              </IonLabel>
              <IonToggle slot="end" checked={showAnswers[index]} />
            </IonItem>
          ))}
        </IonList>
  );
};

export default FAQPage;
