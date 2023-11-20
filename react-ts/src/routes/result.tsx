import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ProfileType } from "../types/tables";
import { Json } from "../types/database";

const Result = () => {
    const Navigate = useNavigate();
    const [sessions, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType | null>(null)
    const [newInfo, setInfo] = useState({
        // 更新したい情報を指定
        exp: 2000,
      });
    const jg = useLocation().state.type;
    const gamemode = useLocation().state.gamemode;
    const mode = useLocation().state.result.mode;
    const grade = useLocation().state.result.grade;
    const episode = useLocation().state.result.episode;
    const clnum = useLocation().state.result.clearNum;
    // const score = useLocation().state.score;
    const [score, setScore] = useState(0);
    let returnBody;

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
            }
          }
        }
        setupUser()
      }, [sessions])
      
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
        Navigate(`/home`);
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
    return (
        <div className="Result">
            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 2 }}
            >
                {/*  */}
            { jg ? (<h1>Result</h1>) : (<h1>GameOver!</h1>)}

                <div>
                    <h3>Player : {user?.username}</h3>
                    <h3>Mode: {gamemode}</h3>
                    <h3>Score: {score}</h3>
                </div> 
                
                <div className="reBtn">
                    <button className="replayBtn" onClick={replayBtn}>
                        {jg ? ("もう一回!") : ("再挑戦！")} 
                        
                    </button>
                    <button className="toHome" onClick={goHome}>
                        {jg ? ("ホームに戻る") : ("諦める")}   
                    </button>
                </div> 
            {/*  */}
                </motion.div>
            </div>
        )
}

export default Result;