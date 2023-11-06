import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";   
import type { Json } from '../types/database'
import { Session } from "@supabase/supabase-js";
import axios from 'axios';
import "@scss/mozi.scss";
import { useLocation, useParams } from 'react-router-dom'
import { QuizClassType, QuizRankType } from '../types/tables'


interface Quiz {
  question: string | null;
  answer: string | null;
  choices: string[] | null;
}
const url = 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit';

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
    console.log(quizRank);
    // quizRank配列からランダムで10個ログで出力
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
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [showCanvasText, setShowCanvasText] = useState<boolean>(true);
  const contextRef = useRef<CanvasRenderingContext2D | null>(null);
  const isDrawing = useRef(false);

  function drawTextOnCanvas(text: string, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア

      ctx.font = "100px Arial"; // テキストのフォントとサイズを設定
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // テキストの色と透明度を設定
      // テキストを中央に描画
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2); // テキストを描画
    }
  }

  // 機能ができるまではコメントアウト
  useEffect(() => {
    let canvas = canvasRef.current;
    if (canvas) {
      if (showCanvasText && quizNow.question) {
        // answerをcanvasに描画
        drawTextOnCanvas(quizNow.answer || "", canvas);
      }
    }
  }, [showCanvasText, quizNow.answer]);

  const toggleCanvasText = () => {setShowCanvasText(!showCanvasText)};

  const getPredict = () => {
    var text = {
      'app_version': 0.1,
      'device': window.navigator.userAgent,
      'input_type': 0,
      'options': 'enable_pre_space',
      'requests': [{
          'pre_context': '',
          'max_num_results': 6,
          'max_completions': 0,
          'ink': []
        }]
      };

    const handwriting = { trace: [] }; // Define the variable 'handwriting'
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d");
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const pixelArray = imageData.data;
        const pixels = [];
        for (let i = 0; i < pixelArray.length; i += 4) {
          const r = pixelArray[i];
          const g = pixelArray[i + 1];
          const b = pixelArray[i + 2];
          const a = pixelArray[i + 3];
          pixels.push([r, g, b, a]);
        }
        handwriting.trace.push(pixels as never); // explicitly annotate the type of the array
      }
    }
    text.requests[0].ink = handwriting.trace;
    axios.post(url, text, {
      headers: {
        'Content-Type': 'application/json',
      },
    })
    .then((response) => {
      // 成功時のコールバック関数
      console.log(response);
      return response;
    })
    .catch((error) => {
      console.error('エラー:', error);
    });
  } 
  
  useEffect(() => {
    
    const canvas = canvasRef.current;
          canvas.width = window.innerWidth;
          canvas.height = window.innerHeight;
  
    const context = canvas.getContext('2d');
          context.strokeStyle = 'black'; // ペンの色（黒色）
          context.lineWidth = 2; // ペンの線の太さ
      
    contextRef.current = context;
    }, []);

  const startDrawing = (e: React.MouseEvent) => {
    if (!contextRef.current) return;

    const context = contextRef.current;
    context.beginPath();
    context.moveTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    isDrawing.current = true;
  };

  const draw = (e: React.MouseEvent) => {
    if (!isDrawing.current || !contextRef.current) return;

    const context = contextRef.current;
    context.lineTo(e.nativeEvent.offsetX, e.nativeEvent.offsetY);
    context.stroke();
  };

  const endDrawing = () => {
    isDrawing.current = false;
    if (contextRef.current) contextRef.current.closePath();
  };

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
            <canvas 
              ref={canvasRef}
              className="mozi-canvas"
              onMouseDown={startDrawing}
              onMouseMove={draw}
              onMouseUp={endDrawing}
              onMouseOut={endDrawing} 
            ></canvas>
          </div>
          <br />

          <button
            className={"erase-btn"}
          >
            <img src={getImage('kesi.png')} alt="" />
          </button>

          <div className="life-wrap">
            <img src={getImage('heart.png')} alt="" />
            <h2>{lifeNow}</h2>
          </div>
        </div>
      </div>
    </div>
  </>
  );
}

export default Game;
