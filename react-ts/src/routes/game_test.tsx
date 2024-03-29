import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";   
import "@scss/mozi.scss";
import { Link, useNavigate, useLocation, useParams } from 'react-router-dom'
import { QuizClassType, QuizRankType } from '../types/tables'
import CanComp from "../components/game/canvas";
import Timer from "../components/game/timer";
import { motion } from "framer-motion";
import Live2DModule from '../components/Live2D/Live2d-slime';

interface Quiz {
  question: string | null;
  answer: string | null;
  choices: string[] | null;
  explain: string | null;
  read : string | null;
}

export interface quiz {//受け渡し用
  write: string;//書き
  read : string;//読み
  problem: string;//問題
  expl: string;//解説
  correct: boolean;//正解かどうか
};

//ゲームプレイ画面
const Game = () => {
  const Navigate = useNavigate();
  const {mode, grade} = useParams();
  //['ゲームが終わっているか','クリア=> true, 失敗=> false']
  const [gameStatus, setGameStatus] = useState<boolean[]>([false, false, false]);
  const getImage = (filePath: string): string => {return new URL(`../assets/${filePath}`, import.meta.url).href;};
  // Luve2D関連
  const modelPath = '/Live2dModel/slime/silme.model3.json';
  const childRef = useRef<any>(null);
  const playRush = () => {childRef.current.rush()};

  useEffect(() => {
    // 一定間隔でTimerコンポーネント内のtimesを取得してログに出力する例
    const interval = setInterval(() => {
      if (timerRef.current && timerRef.current.times) {
        // console.log("親コンポーネントからのTimerのtimes:", timerRef.current.times);
        if(timerRef.current.times <= 0){
          //時間切れ処理
          setGameStatus([true, false, true]);
          setTimeout(() => {
            Navigate('/result' ,
              { state: 
                { 
                  gamemode: "test", 
                  type: false, 
                  result : {
                    mode : mode,
                    grade : grade,
                    clearNum: nowNum,
                  }
                },
              }); 
            }, 4000);
        }
      }
    }, 100);

    return () => clearInterval(interval);
  }, []);
  // ver002

  // ゲージの幅を計算
  // quiz関連 --------------------------------------
  const question = [...Array(10).keys()];
  const [nowNum, setNowNum] = useState<number>(0);
  const [showQuiz, setShowQuiz] = useState<boolean>(false);
  const [showChoice, setShowChoice] = useState<boolean>(false);
  const [showExplain, setShowExplain] = useState<boolean>(false);
  const [quizNow, setQuizNow] = useState<Quiz>({
    question: "",
    answer: "答え",
    choices: ["", "", ""],
    explain: "",
    read: "",
  });
  const [quizChoice, setChoice] = useState<string[]>([]);
  const [lifeNow, setLifeNow] = useState<number>(3);
  //回答した問題を格納する配列 型はquiz
  const [resinfo, setResinfo] = useState<quiz[]>([]);//結果の情報を格納
  const [clearNum, setClrearNum] = useState<number>(0);//クリアした問題数を格納

  if(mode == "rank"){

    const [quizRank, setQuizRank] = useState<QuizRankType[] | null>(null);
    useEffect(() => {//rank Modeランダムに取得した問題を出す
      const fetchQuiz = async () => {
        if(grade != null){
          const { data, error } = await supabase.from('quiz_rank').select('*').eq('rank', grade);
          if (error) {
            Navigate('/404');
            return;
          }
      
          if (data) {
            const selected = data.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10);
            setQuizRank(selected);
          }
        }
      }
      fetchQuiz(); // 非同期関数を実行
    }, [])

    useEffect(() => {//取得した問題から選択肢をランダムに取得
      if(quizRank){
        let tmpChoice = quizChoice.slice(0,6);
        tmpChoice = tmpChoice.map(element => element.replace(/[ 　\n]/g, ""));
        setQuizNow({
          question: quizRank[nowNum].problem,
          answer: quizRank[nowNum].write,
          choices: tmpChoice,
          explain: quizRank[nowNum].expl,
          read: quizRank[nowNum].read
        })
        setShowChoice(true);
      }
      
  
    }, [quizChoice])

    useEffect(() => {//問題を表示
      quizRank !== null? 
      (
        setQuizNow({
          question: quizRank[nowNum].problem,
          answer: quizRank[nowNum].write,
          choices: [],
          explain: quizRank[nowNum].expl,
          read: quizRank[nowNum].read
        }),
        setShowQuiz(true),
        setShowChoice(true)
      ):null;
    }, [quizRank, nowNum])
  }else{
    const [quizClass, setQuizClass] = useState<QuizClassType[] | null>(null);
    useEffect(() => {//class Modeランダムに取得した問題を出す
      const fetchQuiz = async () => {
        if(grade != null){
          const { data, error } = await supabase.from('quiz_class').select('*').eq('class', grade);
          if (error) {Navigate('/404');console.log(error);return;}
          if (data) {const selected = data.slice().sort(function () { return Math.random() - 0.5; }).slice(0, 10);setQuizClass(selected);}
        }
      }
      fetchQuiz(); // 非同期関数を実行
    }, [])

    useEffect(() => {//取得した問題から選択肢をランダムに取得
      if(quizClass){
        let tmpChoice = quizChoice.slice(0,6);
        tmpChoice = tmpChoice.map(element => element.replace(/[ 　\n]/g, ""));
        setQuizNow({
          question: quizClass[nowNum].problem,
          answer: quizClass[nowNum].write,
          choices: tmpChoice,
          explain: quizClass[nowNum].expl,
          read: quizClass[nowNum].read
        })
        setShowChoice(true);
      }
    }, [quizChoice])

    useEffect(() => {//問題を表示
      quizClass !== null
      ? 
      (
        setQuizNow({
          question: quizClass[nowNum].problem,
          answer: quizClass[nowNum].write,
          choices: [],
          explain: quizClass[nowNum].expl,
          read: quizClass[nowNum].read
        }),
        setShowQuiz(true),
        setShowChoice(true)
      )
      : null;
    }, [quizClass, nowNum])
  }
 
  // canvas関連 --------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [showCanvasText, setShowCanvasText] = useState<boolean>(false);
  const childCanvasRef = useRef(null);

  // const HandingSaveImg = async() => {//canvasの保存
  //   const canvas = canvasRef.current;
  //   if (!canvas) return;
  //   const base64 = canvas.toDataURL("image/png");
  //   //Download
  //   // ダウンロード用のリンクを作成
  //   const downloadLink = document.createElement('a');
  //         downloadLink.href = base64;
  //         downloadLink.download = 'image.png'; // ファイル名を指定
  //         // リンクをクリックしてダウンロードを開始
  //         downloadLink.click();
  // }

  const clearChildCanvas = () => {//canvasのクリア
    if (childCanvasRef.current && childCanvasRef.current.clearCanvas) {
      (childCanvasRef.current as any).clearCanvas();
      setShowChoice(false);
    }
  };
  
  const handleShowDetail = () => {
    setShowExplain(true);
  };

  const handleHideDetail = () => {
      setShowExplain(false);
  };

  // 正誤判定 --------------------------------------
  const [maru, setMaru] = useState<boolean>(true);
  const [batu, setBatu] = useState<boolean>(true);
  const timerRef = useRef(null);
  const [alert, setAlert] = useState("LEVEL UP");
  const [showlevel, setLevel] = useState(true);

  // 正誤判定 --------------------------------------
  const jg = (e : any) => {
    if (quizNow.answer, quizNow.choices) {
      const dataV = e.target.closest('[data-v]')?.getAttribute('data-v');
      setShowCanvasText(false);
      clearChildCanvas();
      if (dataV !== null && quizNow.answer && quizNow.choices) {
        console.log(dataV);
        if (quizNow.answer === quizNow.choices[Number(dataV)]) {
          correctAction();
          setNowNum(nowNum + 1);
          setClrearNum(clearNum + 1);
        } else {
          failedAction();
          setLifeNow(lifeNow-1);
          setNowNum(nowNum + 1);
        }
      }
    }    
  }
  
  const failedAction = () => {
    setTimeout(() => {
  
    }, 1000);
    setResinfo([...resinfo, {
      write: quizNow.answer as string,
      read : quizNow.read as string,
      problem: quizNow.question as string,
      expl: quizNow.explain as string,
      correct: false
    }]);
  }

  const correctAction = () => {
    // setTimeout(() => {
  
    // }, 1000);
    setResinfo([...resinfo, {
      write: quizNow.answer as string,
      read : quizNow.read as string,
      problem: quizNow.question as string,
      expl: quizNow.explain as string,
      correct: true
    }]);
  }

  useEffect(() => {//問題が10問終わったらクリア
    if(nowNum == 3){//クリア
      //showClearModalの表示
      setGameStatus([true, true]);
      setTimeout(() => {
        Navigate('/result' ,
          { state: 
            { 
              gamemode: "test",
              type: true, 
              result : {
                mode : mode,
                grade : grade,
                clearNum: clearNum,
                content: resinfo,
              }
            },
          });
        }, 4000);
    }
  }, [nowNum]);

    
  useEffect(() => {//Lifeが0になったらゲームオーバー
    if(lifeNow == 0){//残機なしでゲームオーバー
      //showFaildModalの表示
      setGameStatus([true, false, false]);
      //2秒後にリザルト画面へ
      setTimeout(() => {
        Navigate('/result' ,
        { state: 
          { 
            gamemode: "test",
            type: true, 
            result : {
              mode : mode,
              grade : grade,
              clearNum: clearNum,
              content: resinfo,
            }
          },
        });
      }, 4000);
    }
  }, [lifeNow]);

  useEffect(() => {//時間切れでゲームオーバー
    timerRef.current && (timerRef.current as { times: number }).times == 1 ? 
    (
      setGameStatus([true, false, true]),
      setTimeout(() => {
        Navigate('/result' ,
        { state: 
          { 
            gamemode: "test",
            type: true, 
            result : {
              mode : mode,
              grade : grade,
              clearNum: nowNum,
              content: resinfo,
            }
          },
        });
      }, 4000)
    ) : null;
  })
  
  const alertAlert = (str : string) => {//アラートを表示
    setAlert(str);
    //2秒後にアラートを消す
    setTimeout(() => {setAlert("");}, 2000);
  }

  return (
      <>
      <div className="App">
      <div className="mozi-wrap">
      <div className={batu ? "normal" : "red-zone"}></div>
        <div className="num-wrap">
          {question.map((v, i) => {
            return (
              <div className={i < clearNum ? "num num-add" : "num"} key={v}>
                {i + 1}
              </div>
            );
          })}
        </div>
        <div className={gameStatus[0] ? "end-black end-black-add" : "end-black"}>
          {gameStatus[0] ? 
            gameStatus[1] ? (
              <div className="clear-area">
                <div className="clear-add">
                  <h2>CLEAR</h2>
                </div>
              </div>
              ) : (
                !gameStatus[2] ? (
                  <div className="failed-area">
                    <div className="failed-add">
                      <h2>FAILED...</h2>
                    </div>
                  </div>
                ) : (
                  <div className="failed-area">
                    <div className="failed-add">
                      <h2>TimeUp...</h2>
                    </div>
                  </div>
                )
            ) : null
          }
        </div>

        <div className="alert-area">
          <div className={showlevel ? "level" : "level-add"}>
            <h2>{alert}</h2>
          </div>
        </div>
        <Live2DModule ref={childRef} modelPath={modelPath as string} />
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
                              width: "100%",
                              padding: "0 4px 0 4px",
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

        {/* 問題についての解説文表示領域 */}
        {showExplain && showChoice ? (
          <motion.div
            initial={{ opacity: 0 }}
            exit={{ opacity: 0 }} 
            animate={{ opacity: 1 }}
            transition={{ duration: 2 }}                             
          >
            <div className="explain-box">
              <div className="exp-inbox">
                <h2>{quizNow.explain}</h2>
              </div>
            </div> 
          </motion.div>
        ) : null}

        {/*  */}
        <Timer ref={timerRef}/>
        <div className="check-wrap">
            <img
              className={maru ? "maru" : "maru-add"}
              src={getImage('maru.png')}
              alt=""
            />
            <img
              className={batu ? "batu" : "batu-add"}
              src={getImage('batu.png')}
              alt=""
            />
        </div>
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

          {/* 解説表示btn */}
          <button className="epl-wrap" 
            onMouseDown={() => handleShowDetail()}
            onMouseUp={() => handleHideDetail()}
            onMouseLeave={() => handleHideDetail()}
          >
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