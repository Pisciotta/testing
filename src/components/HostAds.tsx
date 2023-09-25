import { IonButton, IonAlert, IonIcon, IonChip, IonCol, IonRow, IonGrid, IonModal, IonCard, IonCardContent, IonCardSubtitle, IonCardTitle } from '@ionic/react';
import React, { useEffect, useState } from 'react';
import { convertEventToString, deleteEventById, fetchFutureEvents, fetchQueue, getNthDigit, getSexFromQ, getUserId, simpleHash, storeConfirmedQueue } from './foo';
import { man, thumbsDownOutline, thumbsUpOutline, woman } from 'ionicons/icons';
import { NUMBER_OF_QUESTIONS, answers, questions } from './Test';
import './HostAds.css';

interface Ad {
  id: string;
  text: string;
  acceptedId: number[];
}

export const HostAds: React.FC = () => {
  const [events, setEvents] = useState<any[]>([]);
  const [adsState, setAdsState] = useState<Ad[]>();
  const [selectedAd, setSelectedAd] = useState<Ad>();
  const [showAlert, setShowAlert] = useState(false);
  const [showAlertClose, setShowAlertClose] = useState(false);
  const [eventsFetchted, setEventsFetchted] = useState(false);
  const [queue, setQueue] = useState<any[]>([]);
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
  

  const getSexChip = (sex:string, idx:number, selected:boolean, greenBorder = false) => {
    const ok = selected ? <IonIcon icon={thumbsUpOutline} color="success" /> : null;
    const style = greenBorder ? {borderColor:"green", borderWidth:"2px", borderStyle:"solid"} : {};
    
    if(sex === "M"){
      return <IonChip key={idx} color="primary" style={style}>M<IonIcon icon={man} />{ok}</IonChip>;
    }else if(sex === "F"){
      return <IonChip key={idx} color="danger" style={style}>F<IonIcon icon={woman} />{ok}</IonChip>;
    }else{
      return <IonChip key={idx} color="dark" style={style}>?{ok}</IonChip>;
    }
  }

  const roundedGreenLikeBlockButtonWithIcon = (queueMemberString:string) => {

    //console.log(selectedAd, queueMemberString, simpleHash(queueMemberString));
    return (
      <IonButton
        size="large"
        color="success"
        shape="round"
        onClick={() => {
          setShowPopover(false);
          // ADd the acceptedId and acceptedQ of the ad in adsState
          setAdsState((prevAds:any) => {
            return prevAds?.map((ad:Ad) => {
              if(ad.id === selectedAd!.id){
                const acceptedId = Array.from(new Set([...ad.acceptedId, simpleHash(queueMemberString)]));
                return { ...ad, acceptedId: acceptedId };
              }else{
                return ad;
              }
            });
          });
        }}>
        <IonIcon size="large" icon={thumbsUpOutline} />
      </IonButton>
    );
  }

  const roundedRedDislikeBlockButtonWithIcon = (queueMemberString:string) => {
    return (
      <IonButton
        size="large"
        color="danger"
        shape="round"
        onClick={() => {
          setShowPopover(false);
          // Remove the acceptedId and acceptedQ of the ad in adsState
          setAdsState((prevAds:any) => {
            return prevAds?.map((ad:Ad) => {
              if(ad.id === selectedAd!.id){
                const acceptedId = ad.acceptedId.filter((id:number) => id !== simpleHash(queueMemberString));
                return { ...ad, acceptedId: acceptedId };
              }else{
                return ad;
              }
            });
          });
        }}>
        <IonIcon size="large" icon={thumbsDownOutline} />
      </IonButton>
    );
  }

  const showInfoFromQ = (queueMemberString:string) => {
    const q = [];
    for(let i=0; i<NUMBER_OF_QUESTIONS; i++) {
      q[i] = getNthDigit(queueMemberString,i);
    }
    
    // Return a Grid with the answers
    return (
      <IonGrid >
             
          {q.map((item, index) => (
            <IonRow key={index} style={{padding:"10px"}}>
              <IonCol  >
                  <strong >{questions[index].text}</strong> 
              </IonCol>
              <IonCol  >
                  <i>{answers[index].choices[item]}</i>
              </IonCol>
            </IonRow>
          ))}
          { queue[clickedQDict.ad].confirmed === undefined &&
          <IonRow style={{padding:"10px"}}>
          <IonCol>
            {roundedGreenLikeBlockButtonWithIcon(queueMemberString)}
            
          </IonCol>
          <IonCol>
          {roundedRedDislikeBlockButtonWithIcon(queueMemberString)}
          </IonCol>
          </IonRow>
          
          }
          { queue[clickedQDict.ad].confirmed !== undefined &&
          <IonRow style={{padding:"10px"}}>
            <IonCol>
              <IonButton color="light" size="large" onClick={() => setShowPopover(false)}>Chiudi</IonButton>
            </IonCol>
          </IonRow>} 
      </IonGrid>
      
    );
  }

  const getAcceptedIdCountByAdId = (adId:string) => {
    const ad = adsState?.find((ad:Ad) => ad.id === adId);
    return ad?.acceptedId.length;
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
      const eventsTmp = (await fetchFutureEvents(uid)).sort((a:any, b:any) => {
        if (a.event.date < b.event.date) {
          return -1;
        }
        if (a.event.date > b.event.date) {
          return 1;
        }
        return 0;
      });

      setAdsState(eventsTmp.map((event:any, idx:number) => {
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
          acceptedId: []
        }
      }));

      setQueue(await Promise.all(eventsTmp.map((event:any) => fetchQueue(event.id))));

      setEventsFetchted(true);

      setEvents(eventsTmp);
    };
    fetchEvents();
  }, []);


  
  if(adsState === undefined || queue.length === 0 || events?.length === 0 || adsState?.length === 0  ){
    return <div className="ion-text-center">Nessun evento</div>;
  }

  
  

  

  return (
    <>
      {adsState?.map((ad,id) => {
        let closed = false;

        // Check if queue[id].confirmed exists and is not empty list
        if(queue[id].confirmed && queue[id].confirmed.length > 0){
          closed = true;
        }
        
        return <IonCard key={ad.id}>
          
            <IonCardTitle>

          { closed === false &&
            <IonButton
                size="small"
                color="danger"
                onClick={() => handleDeleteClick(ad)}>
                Elimina
            </IonButton>}
            
            { closed === false && getAcceptedIdCountByAdId(ad.id) ?
            <IonButton
                onClick={() => {setShowAlertClose(true); setSelectedAd(ad);}}
                size="small"
                color="warning"
                >
                Accetta e chiudi
            </IonButton>
            : null
            }
            </IonCardTitle>
            <IonCardContent>
            <div>
            {ad.text}
            </div>
            
          
          <div>
          { closed === true && <i>PARTECIPANTI:</i>}
          { closed === false && <i>CANDIDATI:</i>}

          <span>{queue[id].userIds.length === 0 ? "Nessuno" : null}</span>
          <span> {queue[id].userIds.map((member:string, idx:number) => {
            const selected = ad.acceptedId.includes(simpleHash(member)) || false;

            return <span key={idx} onClick={() => {
              setSelectedAd(ad);
              setClickedQDict({ad:id,q:idx});
              setShowPopover(true);

            }}>{
              queue[id].confirmed !== undefined &&
              queue[id].confirmed.includes(simpleHash(member))
              ?
              getSexChip(getSexFromQ(member), idx, closed === false, true)
              :
              closed === false ? getSexChip(getSexFromQ(member), idx, selected) : 
              getSexChip(getSexFromQ(member), idx, selected) 

              
              }

              </span>
              
          
          })}</span>
          
          
          </div>
          </IonCardContent>
        </IonCard>
      })}
 
      
      <IonAlert
        isOpen={showAlert}
        onDidDismiss={() => handleAlertDismiss(false)}
        header={'ELIMINA'}
        message={'Confermi di voler eliminare questo evento?'}
        buttons={[
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'SI',
            handler: () => handleAlertDismiss(true),
          },
        ]}
      />

      <IonAlert
        isOpen={showAlertClose}
        onDidDismiss={() => setShowAlertClose(false)}
        header={'CHIUDI'}
        message={'Confermi di accettare i partecipanti selezionati e chiudere ad ulteriori candidature?'}
        buttons={[
          {
            text: 'Annulla',
            role: 'cancel',
          },
          {
            text: 'SI, CONFERMO',
            handler: async () => {
              await storeConfirmedQueue(selectedAd!.id, selectedAd!.acceptedId);
              window.location.reload();
            },
          },
        ]}
      />

    <IonModal 
      isOpen={showPopover}
      onDidDismiss={() => setShowPopover(false)}
    >
      <div className="ion-text-center" style={{display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%'}}>
        {showPopover ? 
        showInfoFromQ(queue[clickedQDict.ad].userIds[clickedQDict.q])
        : ""}
      </div>
    </IonModal>
    </>
  );
}; 
