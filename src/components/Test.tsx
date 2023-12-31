import React, { useContext, useEffect } from 'react';
import { Question } from './Question';
import { getUserId, getUserQuestionnaire, storeUserQuestionnaire } from './foo';
import { UserContext } from './constants';

export const questions = [
    {id: "1", text: "Sesso"},
    {id: "2", text: "Sei dominante?"},
    {id: "3", text: "Orientamento sessuale?"},
    {id: "4", text: "Sei un fumatore?"},
    {id: "5", text: "Ti piace il sesso anale?"},
    {id: "6", text: "Baceresti una/o sconosciuta/o?"}
];

export const answers = [
    {id: "1", choices: ["M", "F", "Altro"]},
    {id: "2", choices: ["Si", "No", "Dipende", "Altro"]},
    {id: "3", choices: ["Eterosessuale", "Omosessuale", "Bisessuale", "Altro"]},
    {id: "4", choices: ["Si", "No", "Altro"]}, 
    {id: "5", choices: ["Si, farlo", "Si, riceverlo", "No", "Altro"]},
    {id: "6", choices: ["Si", "No", "Dipende", "Altro"]}
];


export const NUMBER_OF_QUESTIONS = questions.length;

const Test: React.FC = () => {
    
    const [ givenAnswersDict, setGivenAnswersDict ] = React.useState<Record<string, string>>({});
    const [ answersCounter, setAnswersCounter ] = React.useState<number>(0);
    const { checkQ, setCheckQ } = useContext(UserContext);
    

    const FromQuestionTextToId = (questionText: string): string => {
        const question = questions.find(question => question.text === questionText);
        return question ? question.id : "";
    }

    const FromAnswerChoicesToId = (questionId: string, answerChoice: string): string => {
        const answer = answers.find(answer => answer.id === questionId);
        const index = answer ? answer.choices.indexOf(answerChoice) : -1;
        return index >= 0 ? index.toString() : "";
    }

    const CountNonEmptyAnswers = (): number => {
        return Object.values(givenAnswersDict).filter(answer => answer !== "").length;

    }

    const DeleteEmptyAnswersFromGivenAnswersDict = (): void => {
        Object.keys(givenAnswersDict).forEach(key => {
            if (givenAnswersDict[key] === "") {
                delete givenAnswersDict[key];
            }
        });
    }

    // Check if a questionnaire exists locally. If so, return the number of values, otherwise return 0
    const questionnaireExistsLocallyAndReturnValues = async (): Promise<number> => {
        const uid = await getUserId();
        if(!uid){
            return 0;
        }
        const dict = await getUserQuestionnaire(uid);
        return Object.values(dict).length;
    }


    useEffect(() => {
        // Load givenAnswersDict from getUserQuestionnaire
        const loadGivenAnswersDict = async () => {
            const uid = await getUserId();
            if(!uid){
                return;
            }
            const dict = await getUserQuestionnaire(uid);
            setGivenAnswersDict(dict);
        };
        loadGivenAnswersDict();
    }, []);


    useEffect(() => {
        const storeData = async () => {
            DeleteEmptyAnswersFromGivenAnswersDict();
            const counter = CountNonEmptyAnswers();
            setAnswersCounter(counter);
    
            if (counter === questions.length) {
                await storeUserQuestionnaire(await getUserId(), givenAnswersDict);
                setCheckQ(true);
            }
        };
    
        storeData();
    }, [givenAnswersDict]);
    


    const handleSelectedAnswer = (questionText: string, answer: string) => {
        const qId = FromQuestionTextToId(questionText);
        setGivenAnswersDict({ ...givenAnswersDict, [qId]: FromAnswerChoicesToId(qId, answer) });
        
    };

    return (
        <div className="container">
            {questions.map((question, index) => (
                <Question
                    key={question.id}
                    questionText={question.text}
                    answers={answers[index].choices}
                    onAnswerSelected={handleSelectedAnswer}
                    selectedAnswer={givenAnswersDict[question.id] ? answers[index].choices[parseInt(givenAnswersDict[question.id])] : ""}
                 />
            ))}

        </div>
    );
};
      
export default Test;
      