// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, getDocs, updateDoc, arrayUnion, orderBy, startAfter, deleteDoc } from "firebase/firestore";
import { Storage } from '@ionic/storage';
import { USER_ID } from "./constants";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCUwitN0gp5ovEEc8O7Nawk6YOP-5q3LHI",
  authDomain: "testproj-2bcf8.firebaseapp.com",
  projectId: "testproj-2bcf8",
  storageBucket: "testproj-2bcf8.appspot.com",
  messagingSenderId: "1012506063163",
  appId: "1:1012506063163:web:05fe4c96d8215f0670c71e"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const db = getFirestore(app);
const store = new Storage();



// Function to store user questionnaire data
export async function storeUserQuestionnaire(userId: string, questionnaire: any) {
    // Store on Firebase
    await setDoc(doc(db, "users", userId), { questionnaire }, { merge: true });
    // Store locally
    await store.create();
    await store.set('questionnaire', questionnaire);
}

// Function to get user data
export async function getUserQuestionnaire(userId: string) {
    // Check if locally available
    await store.create();
    const localQuestionnaire = await store.get('questionnaire');
    if (localQuestionnaire) {
        return localQuestionnaire;
    }else{
        // Get from Firebase
        const userDoc = await getDoc(doc(db, "users", userId));
        // If userDoc exists, return questionnaire and store locally
        if (userDoc.exists() && userDoc.data()?.questionnaire){
            await store.set('questionnaire', userDoc.data()?.questionnaire);
            return userDoc.data()?.questionnaire;
        }else{
            return {};
        }
    }

}

// Function to store user feedback
export async function storeUserFeedback(userId: string, feedback: string) {
    const userDoc = doc(db, "feedback", userId);
    const userSnap = await getDoc(userDoc);
  
    if (userSnap.exists()) {
      // If the document already exists, append the new feedback to the existing array
      await updateDoc(userDoc, { feedback: arrayUnion(feedback) });
    } else {
      // If the document does not exist, create a new document with the feedback in an array
      await setDoc(userDoc, { feedback: [feedback] });
    }
  }

// Function to store user ad
export async function storeUserAd(
    userId: string,
    place1:string,
    place2:string,
    date: string,
    time: string,
    adDescription:
    string,
    code: string,
    males: number,
    females: number) {
  
    // Create a new event object.
    const event = {
      userId: userId,
      date: date,
      time: time,
      place1: place1,
      place2: place2,
      adDescription: adDescription,
      code: code,
      males: males,
      females: females
    };

    // Get random number between 0 and 999, padded with zeros to length 3
    const randomNumber = Math.floor(Math.random() * 1000).toString().padStart(3, '0');

    // Save the event to Firebase to a document having the time as name
    await setDoc(doc(db, "ads", date+time+randomNumber), {event});

}

export async function fetchFutureEvents(userId: string | undefined = undefined) {
  const now = new Date();
  // Convert now.toISOString() to a string in the format YYYYMMDD
  const nowString = now.toISOString().slice(0, 10).replace(/-/g, '');

  let eventsQuery;
  // If userId is defined, get events for that user
  if (userId) {
    eventsQuery = query(
      collection(db, 'ads'),
      where("event.date", ">=", nowString),
      where("event.userId", "==", userId)
    );
  }else{
    // If userId is undefined, get all events from other users
    eventsQuery = query(
      collection(db, 'ads'),
      where("event.date", ">=", nowString)
    );
  
  }  
  const querySnapshot = await getDocs(eventsQuery);
  const futureEvents = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

  return futureEvents;
}
  

export function convertEventToString( 
  date: string, 
  time: string, 
  place1: string, 
  adDescription: string, 
  males: number, 
  females: number 
): string {
  // Convert date from YYYYMMDD to DD Month YYYY
  const dateObj = new Date(
    parseInt(date.slice(0, 4)),
    parseInt(date.slice(4, 6))-1,
    parseInt(date.slice(6, 8)));
  const dateStr = dateObj.toLocaleDateString(
    'it-IT',
    {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    }
  );

  // Convert time from HHMMSS to HH:MM
  const timeStr = `${time.slice(0, 2)}:${time.slice(2, 4)}`;

  // Construct the final string
  const finalStr = `${dateStr}, ore ${timeStr}. ${place1}. ${males} M + ${females} F. ${adDescription}.`;

  return finalStr;
}

export async function deleteEventById(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, "ads", id));
  } catch (error) {
    console.error("Error deleting document: ", error);
  }
}






// Function to store unique code for user
async function storeUserCode(userId: string, code: string) {
  await setDoc(doc(db, "users", userId), { code }, { merge: true });
}



// Function to get all feedbacks for a user
async function getUserFeedbacks(userId: string) {
  const q = query(collection(db, "feedback"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}

// Function to get all ads for a user
async function getUserAds(userId: string) {
  const q = query(collection(db, "ads"), where("userId", "==", userId));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => doc.data());
}