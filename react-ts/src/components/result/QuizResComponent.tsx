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
    const [quizRes, setQuizRes] = useState([
    {
        write: '日本',//書き
        read : 'にほん',//読み
        problem: 'にほん海側',//問題
        expl: 'Japan の日本語訳',//解説
        correct: true,//正解かどうか
    },
    {
        write: '海外',//書き
        read : 'かいがい',//読み
        problem: 'かいがい線',//問題
        expl: '海を挟んだ外の世界',//解説
        correct: false,//正解かどうか
    },
    {
        write: '札幌',//書き
        read : 'に',//読み
        problem: 'にほん海側',//問題
        expl: 'Japan の日本語訳',//解説
        correct: true,//正解かどうか
    },
    {
        write: '山梨',//書き
        read : 'かいがい',//読み
        problem: 'かいがい線',//問題
        expl: '海を挟んだ外の世界',//解説
        correct: false,//正解かどうか
    },
    {
        write: '御座敷',//書き
        read : 'にほん',//読み
        problem: 'にほん海側',//問題
        expl: 'Japan の日本語訳',//解説
        correct: true,//正解かどうか
    },
    {
        write: '鳥胸',//書き
        read : 'かいがい',//読み
        problem: 'かいがい線',//問題
        expl: '海を挟んだ外の世界',//解説
        correct: false,//正解かどうか
    },{
        write: '灌漑',//書き
        read : 'にほん',//読み
        problem: 'にほん海側',//問題
        expl: 'Japan の日本語訳',//解説
        correct: true,//正解かどうか
    },
    {
        write: '僧都',//書き
        read : 'かいがい',//読み
        problem: 'かいがい線',//問題
        expl: '海を挟んだ外の世界',//解説
        correct: false,//正解かどうか
    }]);
    
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
