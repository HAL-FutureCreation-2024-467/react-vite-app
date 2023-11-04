import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";   '
import { Session } from "@supabase/supabase-js";
import { ProfileType } from "../types/tables";

const Home = () => {
    const [sessions, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType[] | null>(null)
    const [quizTag, setQTag] = useState<boolean>(false)

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
            if(sessions?.user.id){                  
                let { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id',sessions.user.id)
                console.log(profiles)
                setUser(profiles[0])
            }
        }
        setupUser()
    },[sessions])

    return(
        <>
        <div>
            <section>
            <div>
                <p>レベル</p>
            </div>
            <div>
                <p>{user && user.username}</p>
                <p>アイテム数</p>
            </div>
            <div>
                <p>モーダルを表示</p>
            </div>
            </section>
        </div>
        </>
    );
}

export default Home;


//story のchapterとparagraphを取得
//<div>
//      {
//        stories == null 
//        ? (<p>Loading...</p>) 
//        : (
//            Object.keys(stories[0]).length === 0 ? (
//              <p>受信に問題が発生した</p>
//            ) : (
//              stories.map((story, index) => {
//                return (
//                  <div key={index}>
//                    <p>{story.chapter}-{story.paragraph}</p>
//                    {/* <p>{story.sentence)}</p> */}
//                  </div>
//                )
//              })
//            )
//          )
//     }
//</div>
// const [stories, setStory] = useState<StoryType[]|null>(null);// 初期状態を{}に変更

//useEffect(() => {async function fetchStories() {
//      try {
//        const { data, error } = await supabase
//          .from(TABLE_NAME)
//          .select("*"); // "*" はすべてのカラムを選択することを意味します
//
//        if (error) {
//          console.error("データの取得に失敗しました", error);
//        } else {
//          console.log("データの取得に成功しました", data);
//          setStory(data as StoryType[]);
//        }
//      } catch (error) {
//        console.error("エラーが発生しました", error);
//      }
//    }
//    fetchStories();
//  }, []);
