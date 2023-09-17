import React, { useEffect } from 'react';
import { Question } from './Question';
import { getUserQuestionnaire, storeUserQuestionnaire } from './foo';
import { USER_ID } from './constants';
      
const Test: React.FC = () => {
    
    const [ givenAnswersDict, setGivenAnswersDict ] = React.useState<Record<string, string>>({});
    const [ answersCounter, setAnswersCounter ] = React.useState<number>(0);

    const questions = [
        {id: "1", text: "Sesso"},
        {id: "2", text: "Sei dominante?"},
        {id: "3", text: "Orientamento sessuale?"},
        {id: "4", text: "Sei un fumatore?"},
        {id: "5", text: "Ti piace il sesso anale?"},
        {id: "6", text: "Baceresti una/o sconosciuta/o?"}
    ];

    const answers = [
        {id: "1", choices: ["M", "F", "Altro"]},
        {id: "2", choices: ["Si", "No", "Dipende", "Altro"]},
        {id: "3", choices: ["Eterosessuale", "Omosessuale", "Bisessuale", "Altro"]},
        {id: "4", choices: ["Si", "No", "Altro"]}, 
        {id: "5", choices: ["Si, farlo", "Si, riceverlo", "No", "Altro"]},
        {id: "6", choices: ["Si", "No", "Dipende", "Altro"]}
    ];

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

    useEffect(() => {
        // Load givenAnswersDict from getUserQuestionnaire
        const loadGivenAnswersDict = async () => {
            const uid = await USER_ID();
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
                await storeUserQuestionnaire(await USER_ID(), givenAnswersDict);
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
      