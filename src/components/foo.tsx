// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore, collection, addDoc, doc, setDoc, getDoc, query, where, getDocs, updateDoc, arrayUnion, orderBy, startAfter, deleteDoc, arrayRemove } from "firebase/firestore";
import { Storage } from '@ionic/storage';
import { INITIAL_SCORE, MINUS_SCORE_FOR_PARTICIPATING } from "./constants";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';


// Your web app's Firebase configuration
export const firebaseConfig = {
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
export async function storeUserQuestionnaire(userId: string | null, questionnaire: any) {
    if(!userId){
      console.error("User id not found");
      return;
    }
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

    // Get random number between 0 and 99999, padded with zeros to length 5
    const randomNumber = Math.floor(Math.random() * 100000).toString().padStart(5, '0');

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

// Get sex from locally stored questionnaire
export async function getQuestionnaireString(): Promise<string[]> {
  await store.create();
  const localQuestionnaire = await store.get('questionnaire');
  return Object.values(localQuestionnaire);
}



// Add the userId to the list associated to the eventId. List elements must be unique.
export async function addUserToQueue(eventId: string): Promise<void> {
  const eventDocRef = doc(db, "queue", eventId);
  const user = {id:await getUserId(), q:await getQuestionnaireString()};
  const userIdAndQ = user.id+"-"+user.q;

  if (!user) {
    console.error("User id not found");
    return;
  }

  try {
    const docSnap = await getDoc(eventDocRef);

    if (docSnap.exists()) {
      await updateDoc(eventDocRef, { userIds: arrayUnion(userIdAndQ) });
    } else {
      await setDoc(eventDocRef, { userIds: [userIdAndQ] });
    }

    await addEventToUserQueue(eventId, user.id);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

async function addEventToUserQueue(eventId: string, userId: string): Promise<void> {
  const eventDocRef = doc(db, "users", userId);

  try {
    const docSnap = await getDoc(eventDocRef);

    if (docSnap.exists()) {
      await updateDoc(eventDocRef, { queue: arrayUnion(eventId) });
    } else {
      await setDoc(eventDocRef, { queue: [eventId] });
    }
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

export async function getUserQueue(): Promise<any> {
  const userId = await getUserId();
  if (!userId) {
    console.error("User id not found");
    return [];
  }
  const userDocRef = doc(db, "users", userId);

  try {
    const docSnap = await getDoc(userDocRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.queue ?? [];
    } else {
      console.log("No such document!");
      return [];
    }
  } catch (error) {
    console.error("Error getting document:", error);
  }
}


export async function removeEventFromUser(eventId:string): Promise<void> {
  const userid = await getUserId();
  if(!userid){
    console.error("User id not found");
    return;
  }
  const docRef = doc(db, "users", userid);
  try {
    await updateDoc(docRef, { queue: arrayRemove(eventId) });
    await removeUserFromQueue(eventId);
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

async function removeUserFromQueue(eventId:string): Promise<void> {
  const userid = await getUserId();
  const docRef = doc(db, "queue", eventId);
  try {
    await updateDoc(docRef, { userIds: arrayRemove(userid) });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}


export async function updatePoints(points: number): Promise<void> {
  try {
    const userId = await getUserId();
    if (!userId) {
      console.error("User id not found");
      return;
    }
    const docRef = doc(db, "users", userId);
    await updateDoc(docRef, { points: points });
  } catch (error) {
    //console.error("Error updating document: ", error);
  }
}

export async function getPoints(): Promise<number> {
  try {
    const userId = await getUserId();

    if(!userId){
      //console.error("User id not found");
      return INITIAL_SCORE;
    }
    const docRef = doc(db, "users", userId);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      return data?.points ?? INITIAL_SCORE;
    } else {
      //console.log("No such document!");
      return INITIAL_SCORE;
    }
  } catch (error) {
    //console.error("Error getting document:", error);
    return INITIAL_SCORE;
  }
}




// Add login user credentials (userid, email, name, photoURL) to the "logins" collection
export async function addLoginUser(
  userId: string,
  email: string | null,
  name: string | null,
  photoURL: string | null): Promise<void> {
  const docRef = doc(db, "logins", userId);
  try {
    await setDoc(docRef, { email: email, name: name, photoURL: photoURL });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

// Check if user is authenticated
export async function isUserAuthenticated(): Promise<boolean> {
  // Check local isAuthenticated variable
  await store.create();
  const localIsAuthenticated = await store.get('isAuthenticated');
  const localUserId = await store.get('userId');
  
  if (localIsAuthenticated === true && localUserId !== null && localUserId !== undefined) {
    return true;
  }else{
    // Check if user is logged in on Firebase
    const userId = await getUserId();
    if (!userId) {
      //console.error("User id not found");
      return false;
    }
    const docRef = doc(db, "logins", userId);
    const docSnap = await getDoc(docRef);
    const isAuthenticated = docSnap.exists();
    // Store isAuthenticated locally
    await store.set('isAuthenticated', isAuthenticated);
    // Store userId locally
    await store.set('userId', userId);

    return isAuthenticated;
  }
}

// Store user id locally
export async function storeUserId(userId: string) {
  await store.create();
  await store.set('userId', userId);
}


// Function to get user id
export async function getUserId(): Promise<string> {
  // Check local userId variable
  await store.create();
  const localUserId = await store.get('userId');
  return localUserId;
}

// Function to log out user
export async function logoutUser() {
  await store.create();
  await store.remove('isAuthenticated');
  await store.remove('userId');
  await store.remove('questionnaire');
  await store.remove('userCode');
  await store.remove('userPoints');  
  await firebase.auth().signOut();
}

// Fetch list of users in Firebase queue/eventId/userIds
export async function fetchQueue(eventId: string): Promise<any> {
  const docRef = doc(db, "queue", eventId);
  const docSnap = await getDoc(docRef);
  if (docSnap.exists()) {
    const data = docSnap.data();
    return data ?? {userIds: []};
  } else {
    console.log("No such document!");
    return {userIds: []};
  }
}

// Extract info from questionnaire
export function getSexFromQ(queueMemberString:string): string {
  const ans = getNthDigit(queueMemberString,0);
  if(ans === 0){
    return "M";
  }
  if(ans === 1){
    return "F";
  }
  return "?";
}


export function getNthDigit(input: string, n: number): number {
  const parts = input.split('-');
  if (parts.length < 2) {
      return -1; // return -1 if there is no '-' character
  }

  const digits = parts[1].split(',').map(Number);
  if (n >= 0 && n < digits.length) {
      return digits[n]; // return the n-th digit
  }

  return -1; // return -1 if n is out of range
}

export function simpleHash(input: string): number {
  let hash = 0;
  for (let i = 0; i < input.length; i++) {
      const character = input.charCodeAt(i);
      hash = ((hash << 5) - hash) + character;
      hash |= 0; // Convert to 32bit integer
  }
  return hash;
}


export function mapQueueMemberStringToBinaryQString(queueMemberString: string): string {
    // Split the input string by '-' and take the second part
    const numbersString = queueMemberString.split('-')[1];
  
    // Split the numbers string by ',' to get an array of numbers as strings
    const numbersArray = numbersString.split(',');
  
    // Filter out the '0's and join the array back into a string
    const result = numbersArray.join('');
  
    return result;
}

// Function to store in Firebase the queue.{eventId}.confirmed array.
export async function storeConfirmedQueue(eventId: string, confirmedQueue: number[]): Promise<void> {
  const docRef = doc(db, "queue", eventId);
  if(confirmedQueue.length > 1){
    updatePoints(await getPoints()+MINUS_SCORE_FOR_PARTICIPATING);
  }
  try {
    await updateDoc(docRef, { confirmed: confirmedQueue });
  } catch (error) {
    console.error("Error updating document: ", error);
  }
}

// Check if local questionnarie exists
export async function questionnaireExistsLocally(): Promise<boolean> {
  await store.create();
  const localQuestionnaire = await store.get('questionnaire');
  return localQuestionnaire !== null && localQuestionnaire !== undefined;
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