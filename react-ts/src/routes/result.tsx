import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ProfileType, ProfileGameStateType } from "../types/tables";
import { Json } from "../types/database";
import "../assets/scss/result.scss";
import RankCm from "../components/result/RankComponent";
import QuizResult from "../components/result/QuizResComponent";
import 'react-tooltip/dist/react-tooltip.css'

const Result = () => {
    const Navigate = useNavigate();
    const [sessions, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType | null>(null)
    const [newInfo, setInfo] = useState({
        // 更新したい情報を指定
        exp: 2000,
      });
    const [gameState, setGameState] = useState<ProfileGameStateType | null>(null)

    const jg = useLocation().state.type || true;
    const gamemode = useLocation().state.gamemode;
    const mode = useLocation().state.result.mode;
    const grade = useLocation().state.result.grade;
    const episode = useLocation().state.result.episode;
    const clnum = useLocation().state.result.clearNum;
    const quizData = useLocation().state.result.content;
    
    // const score = useLocation().state.score;
    const [score, setScore] = useState(0);

    //ユーザーの現在の経験値を取得
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
          setSession(session)
        })
    
        supabase.auth.onAuthStateChange((_event, session) => {
          setSession(session)
        })
      }, [])

      useEffect(() => {
        const setupUser = async () => {
          if (sessions?.user.id) {
            const { data: profiles, error } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', sessions.user.id)
            if (error) {
              console.error("データの取得に失敗しました", error);
            } else {
              console.log("データの取得に成功しました", profiles);
              setUser(profiles[0])
              setGameState(profiles[0]["game_state"])
            }
          }
        }
        setupUser()
      }, [sessions])
      
      useEffect(() => {
          if(clnum == 10 && gameState){
            gameState["clear"][grade][gamemode] = true;
            console.log(gameState)
            setupState()
          }
      },[clnum,gameState])

       const setupState = async () => {
          if (sessions?.user.id &&clnum == 0 && gameState) {
            const { error } = await supabase
              .from('profiles')
              .update({game_state:gameState})
              .eq('id', sessions.user.id)
            if (error) {
              console.error("データの更新に失敗しました", error);
            } else {
              console.log("データの更新に成功しました", );
            }
          }
        }


      const updateProfile = async (newInfo : Json) => {
        try {
            if (sessions?.user.id) {
              const { data, error } = await supabase
                .from('profile')
                .update(newInfo) // 更新したい情報を渡す
                .eq('user_id', sessions.user.id); // 特定のユーザーIDに基づいて更新
            
            if (error) {
                throw error;
            }
            console.log('更新されたプロファイル情報:', data);
            return data;
            }   
        } catch (error) {
            if (error instanceof Error){
                console.error('プロファイル情報の更新エラー:', error.message);
            }
        }
      }
    //取得経験値の計算 and ランクの計算

    const replayBtn = () => {
        //再挑戦ボタンを押したときの処理
        if(mode && grade && episode){
            Navigate(`/game/${gamemode}/${mode}/${grade}/${episode}`);
        }else if(mode && grade){
            Navigate(`/game/${gamemode}/${mode}/${grade}`);
        }
    }
    const goHome = () => {
        //ホームに戻るボタンを押したときの処理
        Navigate(`/home`, { state: { tab: "quiz" ,mode:mode,grade:grade} });
    }

    useEffect(() => {
        //経験値の計算
        if(episode){
            setScore(clnum * episode * 100);
            setInfo({
                exp: score,
            });
        //ランクの計算
        // ログインユーザーのsessionからidを取得
        // ログインユーザーのidを使って、DBから経験値を取得
        // 経験値を元にランクを計算
        // ランクをDBに保存
        // ランクを表示
        }
    }, [episode]);

    const [rank, setRank] = useState(0);
    const [rankDiff, setRankDiff] = useState(0);
    const [nextExp, setNextExp] = useState(0);

    const calculateLevel = (EXP: number | null) => {
      var exPerLevel = 100;
      let level = 0;
      let requiredExperience = 0;
  
      while (EXP !== null && EXP >= requiredExperience) {
          requiredExperience += exPerLevel;
          level++;
          exPerLevel += 50;
      }
      console.log(level);
      return level;
    }
    
    const ExpRequired = (level: number) => {
      //引数のレベル分ループで計算
      //上昇値の初期値は100
      let ExPerLevel = 100;
      const incrementalExPerLevel = 50;
      let ExpRequiredLevel = 0;
      for (let i = 1; i < level; i++) {
          ExpRequiredLevel += ExPerLevel;
          ExPerLevel  += incrementalExPerLevel;
      }
      return ExpRequiredLevel;
    };
    
    useEffect(() => {
        if (user?.exp != null) {
            setRank(calculateLevel(user.exp));
            if(rank != 0){
              let diff = ExpRequired(rank + 1) - user.exp;
              setRankDiff(diff);
              setNextExp(ExpRequired(rank + 1));  
            }}
        
        
        
    }, [user, rank]);


    useEffect(()=>{

    })
    return (
        <div className="Result">
          <div className="result_title" style={{textAlign:"center"}}>
            <h1>挑戦結果</h1>
          </div>
          <div>
            <h2 className="result_h2">-{clnum}問正解！-</h2>
            {/* 満点は全問正解 */}
            {/* テストのときは討伐成功 */}
          </div>
          <RankCm accountData={user as ProfileType} rank={rank} rankDiff={rankDiff} nowRankEX={ExpRequired(rank)} next={ExpRequired(rank+1)}/>
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
              {/*  */}
              {/* { jg ? (<h1>Result</h1>) : (<h1>GameOver!</h1>)} */}

              {/* 正答案の一覧表示 */}
              <h2 className="result_h2">-今回の問題-</h2>
              <QuizResult quizData={quizData}/>

              {/*  */}
              <div className="reBtn">
                  <button className="toHome" onClick={goHome}>
                      ステージ選択に戻る  
                  </button>
                  <button className="replayBtn" onClick={replayBtn}>
                      {jg ? ("もう一度挑戦する") : ("再挑戦！")}                         
                  </button>
              </div> 
            {/*  */}
                </motion.div>
            </div>
        )
}

export default Result;
