import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { supabase } from "../supabaseClient";   
import "@scss/mozi.scss";
import { useLocation, useParams } from 'react-router-dom'
import { QuizClassType, QuizRankType } from '../types/tables'
import CanComp from "../components/game/canvas";
// import useSound from 'use-sound';
// import collectSd from '../assets/Quiz-Buzzer01-mp3/Quiz-Buzzer01-1.mp3';
// const [collectPlay, { stop, pause }] = useSound(collectSd,{ volume: 0.5 });

interface Quiz {
  question: string | null;
  answer: string | null;
  choices: string[] | null;
}

//ゲームプレイ画面
const Game = () => {


  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const getImage = (filePath: string): string => {return new URL(`../assets/${filePath}`, import.meta.url).href;};

  // quiz関連 --------------------------------------
  const question = [...Array(10).keys()];
  const [nowNum, setNowNum] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [showChoice, setShowChoice] = useState<boolean>(false);
  const [quizNow, setQuizNow] = useState<Quiz>({
    question: "",
    answer: "答え",
    choices: ["", "", ""],
  });
  const [quizChoice, setChoice] = useState<string[]>([]);

  const [lifeNow, setLifeNow] = useState<number>(3);
  const [quizRank, setQuizRank] = useState<QuizRankType[] | null>(null);
  const [quizClass, setQuizClass] = useState<QuizClassType[] | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase.from('quiz_rank').select('*').eq('rank', 'g5');
      if (error) {
        console.log(error);
        return;
      }
  
      if (data) {
        let selected = data.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10);
        setQuizRank(selected);
      }
    }
    fetchQuiz(); // 非同期関数を実行
  }, [])

  useEffect(() => {
    if(quizRank){
      var tmpChoice = quizChoice.slice(0,6);
      tmpChoice = tmpChoice.map(element => element.replace(/\n/g, ""));
      setQuizNow({
        question: quizRank[nowNum].problem,
        answer: quizRank[nowNum].write,
        choices: tmpChoice,
      })
      setShowChoice(true);
    }
    

  }, [quizChoice])

  useEffect(() => {
    // console.log(quizRank);
  }, [quizRank]);
 
  useEffect(() => {
    quizRank !== null
    ? 
    (
      setQuizNow({
        question: quizRank[nowNum].problem,
        answer: quizRank[nowNum].write,
        choices: [],
      }),
      setShowQuiz(true),
      setShowChoice(true)
    )
    : null;
  }, [quizRank, nowNum])
  
  // canvas関連 --------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCanvasText, setShowCanvasText] = useState<boolean>(false);
  const toggleCanvasText = () => {
    console.log(showCanvasText);
    setShowCanvasText(!showCanvasText);
  };
  const childCanvasRef = useRef(null);

  const clearChildCanvas = () => {
    if (childCanvasRef.current && childCanvasRef.current.clearCanvas) {
      childCanvasRef.current.clearCanvas();
      setQuizNow({
        question: quizRank[nowNum].problem,
        answer: quizRank[nowNum].write,
        choices: ["", "", ""],
      })
      setShowChoice(false);

    }
  };

  const recognizeChildCanvas = () => {
    if (childCanvasRef.current && childCanvasRef.current.recognize) {
      childCanvasRef.current.recognize();
    }
  };

   const HandingSaveImg = async() => {
    let canvas = canvasRef.current;
    if (!canvas) return;
    let base64 = canvas.toDataURL("image/png");
    //Download
    // ダウンロード用のリンクを作成
    const downloadLink = document.createElement('a');
    downloadLink.href = base64;
    downloadLink.download = 'image.png'; // ファイル名を指定

    // リンクをクリックしてダウンロードを開始
    downloadLink.click();
  }

  // 正誤判定 --------------------------------------
  const jg = (e : any) => {
    if (quizNow.answer, quizNow.choices) {
      const dataV = e.target.closest('[data-v]')?.getAttribute('data-v');
      
      if (dataV !== null && quizNow.answer && quizNow.choices) {
        console.log(dataV);
    
        if (quizNow.answer === quizNow.choices[Number(dataV)]) {
          console.log("正解"+ quizNow.answer + "->選択回答" + quizNow.choices[Number(dataV)]);
          setNowNum(nowNum + 1);
          // collectPlay();
          clearChildCanvas();
        } else {
          console.log("不正解");
          console.log("不正解"+"->選択回答" + quizNow.choices[Number(dataV)]);
          setLifeNow(lifeNow - 1);
          clearChildCanvas();
        }
      }
    };    
  }
    

  return (
      <>
      <div className="App">
      <div className="mozi-wrap">
        <div className="num-wrap">
          {question.map((v, i) => {
            return (
              <div className={i < nowNum ? "num num-add" : "num"} key={v}>
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* ランダムに取得した問題を出す */}
        { showQuiz ? (
          <div className="q-wrap">
              <h2 className="q">
                  {quizNow.question}
              </h2>
          </div>
          ) : null
        }

        { showChoice ? (
          <div className="result-box">
            <div className="result-wrap">
              { quizNow.choices !== null ?
                  quizNow.choices.map((v, i) => {
                    if(i == 0){
                      return (
                        <div 
                          className="result-push" 
                          onClick={jg}
                          key={v}
                          >
                          <div className={"result add"}
                            style={{ 
                              fontSize: `4.2rem`,
                              textAlign: "center",
                            }}
                            >
                            <p data-v={i}>{v}</p>
                          </div>
                        </div>
                      );
                    }else{
                      return (
                        <div className="result-push" onClick={jg} key={v} >
                          <div className={"result add"}
                            style={{ 
                              fontSize: `4.2rem`,
                              textAlign: "center",
                            }}
                            >
                            <p data-v={i}>{v}</p>
                          </div>
                        </div>
                      );
                    }
                  })
                : null
              }
              </div>
          </div>
          ) : null
        }

        <div style={{ display: "inline-block" }}>
          <div
            className={"mozi-canvas-wrap canvas-add"}
          >
            <CanComp 
              ref={childCanvasRef} 
              quizNow={quizNow} 
              ansShow={showCanvasText}
              setChoice={setChoice}
              />
            
          </div>
          <br />
          <button className="erase-btn" onClick={clearChildCanvas}>
            <img src={getImage('kesi.png')} alt="" />
          </button>

          <div className="life-wrap">
            <img src={getImage('heart.png')} alt="" />
            <h2>{lifeNow}</h2>
          </div>

          <button className="ans-wrap" onClick={ toggleCanvasText }>
            <img src={getImage('scope.png')} alt="" />
          </button>
        </div>  
      </div>
    </div>
  </>
  );
};

export default Game;

 {/* <button className="save-btn" onClick={recognizeChildCanvas}><img src={getImage('tp.png')} alt="" /></button> */}