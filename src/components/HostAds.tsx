import { IonButton, IonAlert } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { convertEventToString, deleteEventById, fetchFutureEvents, fetchQueue, getUserId } from './foo';

interface Ad {
  id: string;
  text: string;
}

export const HostAds: React.FC = () => {
  const [adsState, setAdsState] = useState<Ad[]>();
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [eventsFetchted, setEventsFetchted] = useState(false);
  const [queue, setQueue] = useState<string[] | undefined>([]);

  const handleDeleteClick = (ad: Ad) => {
    setSelectedAd(ad);
    setShowAlert(true);
  };

  const handleAlertDismiss = (cancel: boolean) => {
    if (cancel === true) {
        deleteEventById(selectedAd!.id);
        setAdsState((prevAds) =>
            prevAds?.filter((ad) => ad.id !== selectedAd?.id)
            );
        return;
    }
    setShowAlert(false);
    return;
  };
  

  useEffect(() => {
    if(eventsFetchted){
      return;
    }
    const fetchEvents = async () => {
      const uid = await getUserId();
      if(!uid){
        return;
      }
      const events = (await fetchFutureEvents(uid)).sort((a:any, b:any) => {
        if (a.event.date < b.event.date) {
          return -1;
        }
        if (a.event.date > b.event.date) {
          return 1;
        }
        return 0;
      });

      

      setAdsState(events.map((event:any, idx:number) => {
        return {
          id: event.id,
          text: convertEventToString(
            event.event.date,
            event.event.time,
            event.event.place1,
            event.event.adDescription,
            event.event.males,
            event.event.females
          )
        }
      }));

      setQueue(await Promise.all(events.map((event:any) => fetchQueue(event.id))));

      setEventsFetchted(true);
    };
    fetchEvents();
  }, []);

  console.log("queue",queue)
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
                color="danger"
                onClick={() => handleDeleteClick(ad)}>
                Elimina
            </IonButton>
          </p>
        </div>
      ))}
 
      
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => handleAlertDismiss(false)}
        header={'Conferma'}
        message={'Confermi di voler eliminare questo evento? I partecipanti verranno avvisati.'}
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
