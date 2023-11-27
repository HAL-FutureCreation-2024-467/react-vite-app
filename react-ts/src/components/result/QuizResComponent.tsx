import { useEffect, useState } from "react";

export interface qRProps {
    //quizdata 無規則な配列であることを示す
    quizData : {
        write: string;//書き
        read : string;//読み
        problem: string;//問題
        expl: string;//解説
        correct: boolean;//正解かどうか
    }[];
}

export interface quiz {
    write: string;//書き
    read : string;//読み
    problem: string;//問題
    expl: string;//解説
    correct: boolean;//正解かどうか
};

const getImage = (filePath: string): string => {
    return new URL(`../../assets/${filePath}`, import.meta.url).href;
};



const QuizResult = (props : qRProps) => {
    // const [quizRes, setQuizRes] = useState(props.quizData);
    const [quizRes, setQuizRes] = useState(props.quizData);
    
    const [showStates, setShowStates] = useState(Array(quizRes.length).fill(false));

    const handleToggle = (index) => {
        const newShowStates = [...showStates];
        newShowStates[index] = !newShowStates[index];
        setShowStates(newShowStates);
    };

    // onclickで表示を切り替える　各項目で個別にshowクラスの付け替え
     const showToggle = () => {
        
     }

    const rows = quizRes.map((quiz: quiz, index) => {
        return (
            <div className="quiz_result_row" key={index}>
                <div className="quiz_result_image"> 
                {/* 1割 */}
                    {
                        quiz.correct ? (//判定
                            <img src={getImage('maru.png')} alt={'correct.png'} />
                        ) : (
                            <img src={getImage('batu.png')} alt={'scope.png'} />
                        )
                    }
                </div>
                <div className="quiz_result_write">
                    {/* 4割 */}
                    <div className="quiz_result_text_write show"><h1>{quiz.write}</h1></div>
                </div>
                <div className="quiz_result_expl">
                    {/* 4割 */}
                    {/* show classの切り替えで表示を切り替える */}
                    {
                    showStates[index] ? 
                        (<div className="quiz_result_text_problem show">{quiz.problem}</div>): 
                        (<div className="quiz_result_text_exp">{quiz.expl}</div>)
                    }
                </div>
                <div className="quiz_result_button" onClick={() => handleToggle(index)}>
                    {/* 1割 */}
                    <img src={getImage('scope.png')} alt={'scope.png'} />
                </div>
            </div>
        );
    });
    return (
        <div className="quiz_result">
        {rows}     
        </div>
    );
}

export default QuizResult;  
