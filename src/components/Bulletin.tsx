import { IonButton, IonAlert, IonBadge } from '@ionic/react';
import React, { useContext, useEffect, useState } from 'react';
import { addUserToQueue, convertEventToString, fetchFutureEvents, fetchQueue, getQuestionnaireString, getUserId, getUserQueue, removeEventFromUser, simpleHash, updatePoints } from './foo';
import { MINUS_SCORE_FOR_PARTICIPATING, UserContext } from './constants';

interface Ad {
  id: string;
  text: string;
  participated: boolean;
  confirmed: boolean;
}


export const BulletinBoard: React.FC = () => {
  const [adsState, setAdsState] = useState<Ad[]>();
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [eventsFetchted, setEventsFetchted] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
  
  // Get score from user context
  const { score, setScore } = useContext(UserContext);

  
  const handleParticipateClick = (ad: Ad) => {
    setSelectedAd(ad);
    setShowAlert(true);
  };

  const handleAlertDismiss = async (participated: boolean) => {
    
    if (selectedAd && adsState !== undefined) {
      setAdsState((prevAds) =>
        prevAds?.map((ad) => (ad.id === selectedAd.id ? { ...ad, participated: participated } : ad))
      );

      
      if (participated) {
        await addUserToQueue(selectedAd.id);
        await updatePoints(score-MINUS_SCORE_FOR_PARTICIPATING);
        setScore(score-MINUS_SCORE_FOR_PARTICIPATING);
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


      const userid = await getUserId();
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

      const eventsToAds = await Promise.all(sortedEventsFromOtherUsers.map(async (event:any, idx:number) => {
        const participated = currentUserQueue.includes(event.id);
        const user = {id:await getUserId(), q:await getQuestionnaireString()};
        const userIdAndQ = user.id+"-"+user.q;
        
        let confirmed = false;
      
        if(participated){
          const queue = await fetchQueue(event.id);
          if(queue.confirmed !== undefined){
            confirmed = queue.confirmed.includes(simpleHash(userIdAndQ));
          }
          
        }
      
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
          participated: participated,
          confirmed: confirmed
        }
      }));
      
      
      setAdsState(eventsToAds);
      setEventsFetchted(true);

      
    };
    fetchEvents();

    
  }, []);

  console.log(adsState)

  if(score-MINUS_SCORE_FOR_PARTICIPATING < 0){
    // Not enough score for participating at events
    return (
      <div>
        <p>
          Non hai abbastanza punti per partecipare agli eventi.
        </p>
      </div>
    );
  }

  return (
    <>
      {adsState?.map((ad) => (
        <div key={ad.id}>
          <p>
            {ad.text}
          </p>
          <p>
            { ad.confirmed === true ? <>
            <IonButton size="small" color="success" >Confermato</IonButton>
            </> : 
            <IonButton
                size="small"
                color={ad.participated ? 'warning' : 'primary'}
                onClick={() => handleParticipateClick(ad)}>
                {ad.participated ? "Non partecipare" : "Partecipa"}
            </IonButton>}
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
