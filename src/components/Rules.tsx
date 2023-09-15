import React from 'react';
import { IonContent, IonHeader, IonPage, IonTitle, IonToolbar, IonCard, IonCardContent } from '@ionic/react';

const CommunityRules: React.FC = () => (
    <>
      <IonCard>
        <IonCardContent>
          <h1>#1</h1>
          <p>Rispetta l&apos;anonimato degli altri. Quindi non condivedere informazioni personali.</p>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardContent>
          <h1>#2</h1>
          <p>Invita solo persone degne della tua fiducia. Ricorda che ne sarai il garante, quindi responsabile.</p>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardContent>
          <h1>#3</h1>
          <p>Non offendere in alcun modo la sensibilità altrui.</p>
        </IonCardContent>
      </IonCard>
      <IonCard>
        <IonCardContent>
          <h1>#4</h1>
          <p>Pratica il sesso sicuro e assicurati di portare i preservativi necessari, se non già messi a disposizione da chi ospita.</p>
        </IonCardContent>
      </IonCard>

    </>
);

export default CommunityRules;
