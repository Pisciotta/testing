import React from 'react';
import { IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonChip, IonCol, IonGrid, IonIcon, IonLabel, IonRow } from '@ionic/react'
import { trophyOutline } from 'ionicons/icons'

// Get input from oustide component
function Score(score:number) {
  return (
    <IonCard>
  <IonCardHeader style={{marginBottom:0, paddingBottom:0}}>
    <IonCardTitle style={{ textAlign: "center" }}>Punti</IonCardTitle>
  </IonCardHeader>

  <IonCardContent style={{margin:0, padding:0}}>
    <IonGrid>
      <IonRow>
        <IonCol class="ion-text-center">
          <IonChip color="primary">
            <IonIcon icon={trophyOutline} />
            <IonLabel>{score}</IonLabel>
          </IonChip>
        </IonCol>
      </IonRow>
    </IonGrid>
  </IonCardContent>
</IonCard>

  )
}

export default Score