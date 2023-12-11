import { useEffect, useState } from "react";
import { ProfileStoryStateType } from '../../types/tables';
import { supabase } from "../../supabaseClient";
// import { Session } from "@supabase/supabase-js";


const ReleaseStoryAction = (props :any) => {
    const [storyState, setStoryState] = useState<ProfileStoryStateType | null>(props.storyState)
    const releaseStory = (index : number) => {
        if(props.user?.exp > props.EXP){
            storyState["release"]["chapter"]["paragraph"][props.paragraphNumber]["story"][index] = true
            console.log("aaa")
        }
        console.log(props.user.exp)
        setupState()
        props.setShowModal(false)
      };

      useEffect(() => {
        setStoryState(props.storyState)
        console.log("bbb")
      },props.storyState)
      
      const setupState = async () => {
        if (props.user.id) {
          const { error } = await supabase
            .from('profiles')
            .update({story_state:storyState})
            .eq('id', props.user.id)
          if (error) {
            console.error("データの更新に失敗しました", error);
          } else {
            console.log("データの更新に成功しました", );
          }
        }
      }

    return(
        <>
            <div className="home-modal">
                <div className="c-card">
                    <div className="c-card_contents">
                        <h2 className="c-card_title">
                            <p className="c-card_p">タイトル</p>
                        </h2>
                        <p className="c-card_text">{props?.content}</p>
                        <div className="c-card_btn">
                                    <button onClick={() => confirm("記憶のカケラを消費してストーリーを解放？") ? releaseStory(props.chapterNumber) : alert("消費せずにもどります")}>解放する</button>
                                    <button onClick={() => props.setShowModal(false)}>解放せずに戻る</button>                     
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default ReleaseStoryAction