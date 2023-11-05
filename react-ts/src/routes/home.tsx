import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ProfileType } from "../types/tables";
import QuizTab from "../components/home/QuizTab";


const Home = () => {
    const [sessions, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType[] | null>(null)
    const [showTab, setShowTab] = useState<{[key: string]:boolean}>({
        'home' : true,
        'quiz' : false,
        'story' : false
    })
    const [showQuizTab, setShowQTab] = useState<{[key: string]:boolean}>({
        'practice' : false,
        'test' : false,
    })

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
    })

        supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        })
    }, [])

    
    const setTab = (tabName: string) => {
        setShowQTab({
            'practice' : false,
            'test' : false,
        })
        const updatedTabs: { [key: string]: boolean } = {};
        Object.keys(showTab).forEach((key) => {
            updatedTabs[key] = key === tabName;
        });
        setShowTab(updatedTabs);
    };
    
    const setQTab = (tabName: string) => {
        const updatedTabs: { [key: string]: boolean } = {};
        Object.keys(showQuizTab).forEach((key) => {
          updatedTabs[key] = key === tabName;
        });
        setShowQTab(updatedTabs);
    };

    useEffect(() => {
        const setupUser = async () => {
            if(sessions?.user.id){                  
                const { data: profiles, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id',sessions.user.id)
                if (error) {
                    console.error("データの取得に失敗しました", error);
                } else {
                    console.log("データの取得に成功しました", profiles);
                    setUser(profiles[0])
                }
            }
        }
        setupUser()
    },[sessions])

    if(showTab['home']){
        return(
            <>
            <div>
                <h1>ホーム</h1>
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
                {/*ここにはユーザ画像（キャラクター等）表示*/}
                <div>
                    <button onClick={() => setTab('home')}>ホーム</button>
                    <button onClick={() => setTab('quiz')}>クイズ</button>
                    <button onClick={() => setTab('story')}>ストーリー</button>
                </div>
            </div>
            </>
        );
    }else if(showTab['quiz']){
        //console.log(showTab)
        return(
            <>
            <div>
                <h1>クイズ</h1>
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

                <QuizTab 
                showTab={showTab} 
                setShowTab={setShowTab}
                showQuizTab={showQuizTab} 
                setQTab={setQTab}
                />
                
                <div>
                    <button onClick={() => setTab('home')}>ホーム</button>
                    <button onClick={() => setTab('quiz')}>クイズ</button>
                    <button onClick={() => setTab('story')}>ストーリー</button>
                </div>
            </div>
            </>
        );
    }else if(showTab['story']){
        return(
            <>
            <div>
                <h1>ストーリー</h1>
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
                <div>
                    <button onClick={() => setTab('home')}>ホーム</button>
                    <button onClick={() => setTab('quiz')}>クイズ</button>
                    <button onClick={() => setTab('story')}>ストーリー</button>
                </div>
            </div>
            </>
        );
    }
    
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
