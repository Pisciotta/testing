import { IonButton, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { convertEventToString, fetchFutureEvents } from './foo';

interface Ad {
  id: string;
  text: string;
  participated: boolean;
}


  


export const BulletinBoard: React.FC = () => {
  const [adsState, setAdsState] = useState<Ad[]>();
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [eventsFetchted, setEventsFetchted] = useState(false);

  const handleParticipateClick = (ad: Ad) => {
    setSelectedAd(ad);
    setShowAlert(true);
  };

  const handleAlertDismiss = (participated: boolean) => {
    if (participated && selectedAd && adsState !== undefined) {
      setAdsState((prevAds) =>
        prevAds?.map((ad) => (ad.id === selectedAd.id ? { ...ad, participated: true } : ad))
      );
    }
    setSelectedAd(null);
    setShowAlert(false);
  };

  //

  useEffect(() => {
    if(eventsFetchted){
      return;
    }
    const fetchEvents = async () => {
      const events = (await fetchFutureEvents()).sort((a, b) => {
        if (a.event.date < b.event.date) {
          return -1;
        }
        if (a.event.date > b.event.date) {
          return 1;
        }
        return 0;
      });

      setAdsState(events.map((event, idx:number) => {
        return {
          id: event.event.date+event.event.time+idx,
          text: convertEventToString(
            event.event.date,
            event.event.time,
            event.event.place1,
            event.event.adDescription,
            event.event.males,
            event.event.females
          ),
          participated: false
        }
      }));
      setEventsFetchted(true);
    };
    fetchEvents();
  }, []);

  return (
    <>
      {adsState?.map((ad) => (
        <div key={ad.id}>
          <p>
            {ad.text}
          </p>
          <p>
            <IonButton
                size="small"
                color={ad.participated ? 'warning' : 'primary'}
                onClick={() => handleParticipateClick(ad)}>
                Partecipa
            </IonButton>
          </p>
        </div>


      ))}
 
      
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => handleAlertDismiss(false)}
        header={'Conferma'}
        message={'Confermi di voler partecipare a questo evento? '}
        buttons={[
          {
            text: 'Cancel',
            role: 'cancel',
          },
          {
            text: 'OK',
            handler: () => handleAlertDismiss(true),
          },
        ]}
      />
    </>
  );
};
