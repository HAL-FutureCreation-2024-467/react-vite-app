import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import { supabase } from "../supabaseClient";   
import "@scss/mozi.scss";
import { useLocation, useParams } from 'react-router-dom'
import { QuizClassType, QuizRankType } from '../types/tables'
import CanComp from "../components/game/canvas";


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
  const [quizChoice, setqChoice] = useState<string[]>([]);

  const [lifeNow, setLifeNow] = useState<number>(3);
  const [quizRank, setQuizRank] = useState<QuizRankType[] | null>(null);
  const [quizClass, setQuizClass] = useState<QuizClassType[] | null>(null);

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase.from('quiz_rank').select('*').eq('rank', 'gp1');
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
    console.log(quizRank);
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
  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });
  const toggleCanvasText = () => {
    console.log(showCanvasText);
    setShowCanvasText(!showCanvasText);
  };
  const childCanvasRef = useRef(null);

  const clearChildCanvas = () => {
    if (childCanvasRef.current && childCanvasRef.current.clearCanvas) {
      childCanvasRef.current.clearCanvas();
      if (showCanvasText) {
        toggleCanvasText();
      }
    }
  };
  const handleResize = () => {
    setWindowSize({
      width: window.innerWidth,
      height: window.innerHeight,
    });
    console.log([windowSize.width, windowSize.height])
  };
  window.addEventListener('resize', handleResize);
  // ページ遷移 --------------------------------------

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
          <div>
            <h1 id="h1"></h1>
            <div className="result-wrap">
              { quizNow.choices !== null ?
                  quizNow.choices.map((v, i) => {
                    return (
                      <div className="result-push">
                        <div className={"result add"}>
                          <p>{v}</p>
                        </div>
                      </div>
                    );
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
              width={windowSize.width}
              height={windowSize.height} />
            
          </div>
          <br />

          <button className="erase-btn" onClick={clearChildCanvas}>
            <img src={getImage('kesi.png')} alt="" />
          </button>

          <div className="life-wrap">
            <img src={getImage('heart.png')} alt="" />
            <h2>{lifeNow}</h2>
          </div>

          <div className="ans-wrap">
            <button className={"ans-show-btn"} onClick={toggleCanvasText}>
              <img src={getImage('scope.png')} alt="" />
            </button>
          </div>
        </div>
      </div>
    </div>
  </>
  );
};

export default Game;
