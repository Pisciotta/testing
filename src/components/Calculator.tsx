import React, { useEffect, useRef, useState } from 'react';
import { IonContent, IonPage, IonInput, IonButton, IonGrid, IonRow, IonCol } from '@ionic/react';
import { UserContext } from './constants';

const Calculator: React.FC = () => {
  const { setSecret } = React.useContext(UserContext);
  const [value, setValue] = useState("");
  const buttons = ['1', '2', '3', '+', '4', '5', '6', '-', '7', '8', '9', '*', '.', '0', '=', '/'];  
  const [mouseDown, setMouseDown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  const handleClick = (val: string) => {
    if (val === "=") {
      try {
        setValue(eval(value));
      } catch {
        setValue("Error");
      }
    } else {
      setValue(value + val);
    }
  };

  const clearDisplay = () => setValue("");

  useEffect(() => {
    if (mouseDown) {
      timerRef.current = setTimeout(() => {
        const today = new Date();
        const dd = String(today.getDate()).padStart(2, '0');
        const mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
        const yyyy = today.getFullYear();
        if (value === dd + mm + yyyy) {
          setSecret(true);
        }
      }, 3000);
    } else {
      clearTimeout(timerRef.current!);
    }
  }, [mouseDown]);

  // Calculator style must be smaller, page centered and elegant
  const calcStyle = {
    width: "400px",
    margin: "0 auto",
    border: "1px solid #ccc",
    borderRadius: "5px",
    padding: "10px",
    boxShadow: "0 0 10px #ccc",
    textAlign: "center",
  };


  
  return (
    <IonPage >
      <IonContent className="ion-padding container" >
        <IonInput style={calcStyle}  value={value} readonly></IonInput>
        <IonGrid style={calcStyle} >
          {Array.from({ length: 4 }, (_, i) => i).map((_, rowIndex) => (
            <IonRow key={rowIndex}>
              {buttons.slice(rowIndex * 4, rowIndex * 4 + 4).map((button) => (
                <IonCol key={button} >
                  <IonButton  color="dark" expand="full" onClick={() => handleClick(button)}>{button}</IonButton>
                </IonCol>
              ))}
            </IonRow>
          ))}
          <IonRow>
            <IonCol>
            <IonButton color="danger" expand="full" onMouseDown={() => setMouseDown(true)} onMouseUp={() => setMouseDown(false)} onClick={clearDisplay}>Clear</IonButton>
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Calculator;
