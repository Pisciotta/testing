import { IonButton, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { addUserIdToQueue, convertEventToString, fetchFutureEvents, getUserQueue, removeEventFromUser, updatePoints } from './foo';
import { SCORE, USER_ID } from './constants';

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

  const handleAlertDismiss = async (participated: boolean) => {
    if (selectedAd && adsState !== undefined) {
      setAdsState((prevAds) =>
        prevAds?.map((ad) => (ad.id === selectedAd.id ? { ...ad, participated: participated } : ad))
      );

      const score = await SCORE(-5);
      if (participated) {
        await addUserIdToQueue(selectedAd.id);
        await updatePoints(score);
      } else {
        await removeEventFromUser(selectedAd.id);
      }
    }
    setSelectedAd(null);
    setShowAlert(false);
  };

  useEffect(() => {
    if(eventsFetchted){
      return;
    }

    const fetchEvents = async () => {
      const currentUserQueue = await getUserQueue();
      const events = await fetchFutureEvents() as any;
      const userid = await USER_ID();
      const eventsFromOtherUsers = events.filter((event:any) => event.event?.userId !== userid);
      const sortedEventsFromOtherUsers = eventsFromOtherUsers.sort((a:any, b:any) => {
        if (a.event.date < b.event.date) {
          return -1;
        }
        if (a.event.date > b.event.date) {
          return 1;
        }
        return 0;
      });

      const eventsToAds = sortedEventsFromOtherUsers.map((event:any, idx:number) => {
        return {
          id: event.id,
          text: convertEventToString(
            event.event.date,
            event.event.time,
            event.event.place1,
            event.event.adDescription,
            event.event.males,
            event.event.females
          ),
          participated:  currentUserQueue.includes(event.id) ? true : false
        }
      });
      
      setAdsState(eventsToAds);
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
                {ad.participated ? "Non partecipare" : "Partecipa"}
            </IonButton>
          </p>
        </div>
      ))}
 
      
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => handleAlertDismiss(selectedAd?.participated || false)}
        header={'Conferma'}
        message={
          !selectedAd?.participated ? 
          'Confermi di voler partecipare a questo evento? '
          :
          'Confermi di non voler più partecipare a questo evento? '
        }
        buttons={[
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'OK',
            handler: () => handleAlertDismiss(selectedAd?.participated ? false : true),
          },
        ]}
      />
    </>
  );
};
