import { createContext } from "react";
import { getPoints, updatePoints } from "./foo";

export const INITIAL_SCORE = 100;
export const MINUS_SCORE_FOR_PARTICIPATING = 10;

export const SCORE = async (delta = 0) => {
    const points = await getPoints()+delta;
    updatePoints(points);
    return points;
};
export const PAGE_TO_TITLE: { [key:string] : string} = {
    "meet":"Incontra",
    "test": "Questionario",
    "publish": "Ospita",
    "rules": "Regole",
    "host": "I tuoi prossimi eventi",};

export const ADS = [{"id":1, "text":"Testo annuncio"}];

// Define User Context
export const UserContext = createContext<any>({});
