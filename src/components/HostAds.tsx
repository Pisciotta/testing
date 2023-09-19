import { IonButton, IonAlert, IonIcon, IonChip, IonPopover, IonCol, IonRow, IonGrid, IonCardContent, IonCard, IonModal } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { convertEventToString, deleteEventById, fetchFutureEvents, fetchQueue, getNthDigit, getSexFromQ, getUserId } from './foo';
import { chevronForwardCircle, male, man, thumbsDownOutline, thumbsUpOutline, transgender, woman } from 'ionicons/icons';
import { answers, questions } from './Test';
import './HostAds.css';

interface Ad {
  id: string;
  text: string;
}

export const HostAds: React.FC = () => {
  const [adsState, setAdsState] = useState<Ad[]>();
  const [selectedAd, setSelectedAd] = useState<Ad | null>(null);
  const [showAlert, setShowAlert] = useState(false);
  const [eventsFetchted, setEventsFetchted] = useState(false);
  const [queue, setQueue] = useState<string[][]>([]);
  const [showPopover, setShowPopover] = useState(false);
  const [clickedQDict, setClickedQDict] = useState<{ad:number, q:number}>({ad:0, q:0});

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
  

  const getSexChip = (sex:string, idx:number) => {
    if(sex === "M"){
      return <IonChip key={idx} color="primary">M<IonIcon icon={man} /></IonChip>;
    }else if(sex === "F"){
      return <IonChip key={idx} color="danger">F<IonIcon icon={woman} /></IonChip>;
    }else{
      return <IonChip key={idx} color="dark">?<IonIcon icon={transgender} /></IonChip>;
    }
  }


  const roundedGreenLikeBlockButtonWithIcon = () => {
    return (
      <IonButton
        size="large"
        color="success"
        shape="round"
        onClick={() => setShowPopover(false)}>
        <IonIcon size="large" icon={thumbsUpOutline} />
      </IonButton>
    );
  }

  const roundedRedDislikeBlockButtonWithIcon = () => {
    return (
      <IonButton
        size="large"
        color="danger"
        shape="round"
        onClick={() => setShowPopover(false)}>
        <IonIcon size="large" icon={thumbsDownOutline} />
      </IonButton>
    );
  }

  const showInfoFromQ = (queueMemberString:string) => {
    const q = [];
    for(let i=0; i<6; i++) {
      q[i] = getNthDigit(queueMemberString,i);
    }
  
    // Return a Grid with the answers
    return (
      <IonGrid>        
          {q.map((item, index) => (
            <IonRow key={index}>
              <IonCol  >
                  <strong >{questions[index].text}</strong> 
              </IonCol>
              <IonCol  >
                <p><i>{answers[index].choices[item]}</i></p>
              </IonCol>
            </IonRow>
          ))}
          <IonRow>
          <IonCol>
            {roundedGreenLikeBlockButtonWithIcon()}
            
          </IonCol>
          <IonCol>
          {roundedRedDislikeBlockButtonWithIcon()}
          </IonCol>
          </IonRow>
      </IonGrid>
      
    );
  }
  

  

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

  if(adsState === undefined || queue.length === 0 ){
    return <></>;
  }

  return (
    <>
      {adsState?.map((ad,id) => (
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
          <span> {queue[id].map((member, idx) => {
            return <span key={idx} onClick={() => {
              setClickedQDict({ad:id,q:idx}); setShowPopover(true);
            }}>{
              getSexChip(getSexFromQ(member), idx)}
              </span>
          })}</span>
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

    <IonModal
      isOpen={showPopover}
      onDidDismiss={() => setShowPopover(false)}
    >
      <p className="ion-text-center">{showInfoFromQ(queue[clickedQDict.ad][clickedQDict.q])}</p>
    </IonModal>
    </>
  );
};
