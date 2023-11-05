import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";   
import type { Json } from '../types/database'
import { Session } from "@supabase/supabase-js";
import "@scss/mozi.scss";
import { useParams } from 'react-router-dom'

//ゲームプレイ画面
const Game = () => {
  const getImage = (filePath: string): string => {return new URL(`../assets/${filePath}`, import.meta.url).href;};
  const question = [...Array(10).keys()];
  const [quizNow, setQuizNow] = useState<number>(0);
  const [lifeNow, setLifeNow] = useState<number>(3);
  const [quiz, setQuiz] = useState<Json[]>([]);
  const [sessions, setSession] = useState<Session | null>(null)
  useEffect(() => {
      supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
  })

      supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
      })
  }, [])

  useEffect(() => {
      const fetchQuiz = async () => {
          const { data, error } = await supabase
              .from('quiz')
              .select('*')
          if (error) {
              console.log(error)
              return
          }
          setQuiz(data)
      }
      fetchQuiz()
  }, [])
  
  return (
      <>
    <div
      className={"mozi-black"}
    ></div>
    <div className="overlay"></div>
    <div className="normal"></div>
    <div className="end-black"></div>

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
  </>
  );
}

export default Game;