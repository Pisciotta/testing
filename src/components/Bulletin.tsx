import { IonButton, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { convertEventToString, fetchFutureEvents } from './foo';
import { USER_ID } from './constants';

interface Ad {
  id: string;
  text: string;
  participated: boolean;
}

interface EventData {
  event: {
    id : string;
    userId: string;
    date: string;
    time: string;
    place1: string;
    place2: string;
    adDescription: string;
    code: string;
    males: number;
    females: number;
  };
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
      const events = await fetchFutureEvents() as any;
      const userid = await USER_ID();
      console.log(events);
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
            text: 'Annulla',
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
