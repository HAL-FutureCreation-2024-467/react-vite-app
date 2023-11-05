import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";   
import type { Json } from '../types/database'
import { Session } from "@supabase/supabase-js";
import "@scss/mozi.scss";
import { useLocation, useParams } from 'react-router-dom'
import { QuizClassType, QuizRankType } from '../types/tables'

//ゲームプレイ画面
const Game = () => {
  const { search } = useLocation();
  const queryParams = new URLSearchParams(search);
  const getImage = (filePath: string): string => {return new URL(`../assets/${filePath}`, import.meta.url).href;};
  const question = [...Array(10).keys()];
  const [quizNow, setQuizNow] = useState<number>(0);
  const [lifeNow, setLifeNow] = useState<number>(3);
  const [quizRank, setQuizRank] = useState<QuizRankType[] | null>([]);
  const [quizClass, setQuizClass] = useState<QuizClassType[] | null>(null);
  const [sessions, setSession] = useState<Session | null>(null)
  // useEffect(() => {
  //     supabase.auth.getSession().then(({ data: { session } }) => {
  //     setSession(session)
  // })

  //     supabase.auth.onAuthStateChange((_event, session) => {
  //     setSession(session)
  //     })
  // }, [])

  useEffect(() => {
    const fetchQuiz = async () => {
      const { data, error } = await supabase.from('quiz_rank').select('*').eq('rank', 'gp1');
      if (error) {
        console.log(error);
        return;
      }
  
      if (data) {
        setQuizRank(data);
        // setQuizRank(data) が完了した後でログを出力
        const selected = quizRank.slice().sort(function(){ return Math.random() - 0.5; }).slice(0, 10);
        console.log(data);
        console.log(selected);
      }
    }
    fetchQuiz(); // 非同期関数を実行
  }, [])

  
  return (
      <>
      <div className="App">
      <div className="mozi-wrap">
        <div className="num-wrap">
          {question.map((v, i) => {
            return (
              <div className={i < quizNow ? "num num-add" : "num"} key={v}>
                {i + 1}
              </div>
            );
          })}
        </div>

        {/* ランダムに取得した問題を出す */}
        <div className="q-wrap">
            <h2 className="q">
                sample text
            </h2>
        </div>
        <h1 id="h1"></h1>
        <div className="result-wrap">
          {/* 選択肢を表示 */}
        </div>

        <div style={{ display: "inline-block" }}>
          <div
            className={"mozi-canvas-wrap canvas-add"}
          >
            <canvas className="mozi-canvas"></canvas>
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