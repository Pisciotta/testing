import { getPoints, updatePoints } from "./foo";

export const USER_ID = async () => {
    // Load user id from local storage
    return await localStorage.getItem("userId");
}

export const SCORE = async (delta = 0) => {
    const points = await getPoints()+delta;
    updatePoints(points);
    return points;
};
export const PAGE_TO_TITLE: { [key:string] : string} = {
    "faq":"Chiedi",
    "meet":"Partecipa",
    "test": "Questionario",
    "publish": "Ospita",
    "rules": "Regole",
    "host": "I tuoi prossimi eventi",};

export const ADS = [{"id":1, "text":"Testo annuncio"}];
