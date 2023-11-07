import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ProfileType } from "../types/tables";
import QuizTab from "../components/home/QuizTab";
import StoryTab from "../components/home/StoryTab";
import Avatar from '../components/Avatar'
import { error } from "console";
import HomeModal from "../components/home/HomeModal";
import { json } from "stream/consumers";


const Home = () => {
    const [sessions, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<ProfileType | null>(null)
    const [showTab, setShowTab] = useState<{ [key: string]: boolean }>({
        'home': true,
        'quiz': false,
        'story': false
    })
    const [loading, setLoading] = useState(true)
    const [username, setUsername] = useState(null)
    const [full_name, setFullName] = useState(null)
    const [website, setWebsite] = useState(null)
    const [avatar_url, setAvatarUrl] = useState(null)
    const [exp, setExp] = useState<number>(0)
    const [showConfigModal, setShowModal] = useState(false);
    const [menuBar, setMenu] = useState("line_menu.png");
    
    //const [exp, setExp] = useState<number>(0)
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setSession(session)
        })

        supabase.auth.onAuthStateChange((_event, session) => {
            setSession(session)
        })
    }, [])


    const setTab = (tabName: string) => {
        const updatedTabs: { [key: string]: boolean } = {};
        Object.keys(showTab).forEach((key) => {
            updatedTabs[key] = key === tabName;
        });
        setShowTab(updatedTabs);
    };

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


    async function updateProfile(event, avatarUrl) {
        event.preventDefault()

        setLoading(true)

        const updates = {
            avatar_url: avatarUrl,
            exp: 0,
            full_name: full_name,
            id: user?.id,
            game_state: user?.game_state,
            updated_at: new Date(),
            username: username,
            website: website,
        }

        const { error } = await supabase.from('profiles').upsert(updates)

        if (error) {
            alert(error.message)
        } else {
            setAvatarUrl(avatar_url)
        }
        setLoading(false)
    }
    //ボタンが押されたときにuser情報再取得
        const handleButtonClick = () => {
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
        };

    const toggleModal = () => {
        setShowModal(!showConfigModal);

        if (!showConfigModal) {//modalの状態でcross か barを変える
            setMenu('line_cross.png');
        } else {
            setMenu('line_menu.png');
        }

    };

    const getImage = (filePath: string): string => {
        return new URL(`../assets/${filePath}`, import.meta.url).href;
    };

    if (user?.username) {
        if (showTab['home']) {
            return (
                <>
                    {/*<div className="App">
                        <div className={"black"}></div>*/}
                    <h1>ホーム</h1>
                    <section className={"home-wrap"}>
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
                        <div className={showConfigModal ? "overlay-add" : "overlay"}>
                            <HomeModal />
                        </div>
                        <div
                            className="home-btn"
                            onClick={toggleModal}
                        >
                            <img src={getImage(menuBar)} alt="" />
                        </div>
                    </section>
                    {/*ここにはユーザ画像（キャラクター等）表示*/}
                    <div>
                        <button onClick={() => setTab('home')}>ホーム</button>
                        <button onClick={() => setTab('quiz')}>クイズ</button>
                        <button onClick={() => setTab('story')}>ストーリー</button>
                    </div>
                    {/*</div>*/}
                </>
            );
        } else if (showTab['quiz']) {
            //console.log(showTab)
            return (
                <>
                    <div>
                        <h1>クイズ</h1>
                        <section className={"home-wrap"}>
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
                            <div className={showConfigModal ? "overlay-add" : "overlay"}>
                                <HomeModal />
                            </div>
                        </section>
                        <QuizTab />

                        <div>
                            <button onClick={() => setTab('home')}>ホーム</button>
                            <button onClick={() => setTab('quiz')}>クイズ</button>
                            <button onClick={() => setTab('story')}>ストーリー</button>
                        </div>
                    </div>
                </>
            );
        } else if (showTab['story']) {
            return (
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
                        <StoryTab />
                        <h1>ストーリー</h1>

                        <div>
                            <button onClick={() => setTab('home')}>ホーム</button>
                            <button onClick={() => setTab('quiz')}>クイズ</button>
                            <button onClick={() => setTab('story')}>ストーリー</button>
                        </div>
                    </div>
                </>
            );
        }
    } else {
        return (
           
            <>
                <p>ユーザー情報登録画面</p>
                <form onSubmit={updateProfile} className="form-widget">
                    <Avatar
                        url={avatar_url}
                        size={150}
                        onUpload={(event, url) => {
                            updateProfile(event, url)
                        }}
                    />
                    <div>
                        <label htmlFor="email">Email</label>
                        <input id="email" type="text" value={sessions?.user.email} disabled />
                    </div>
                    <div>
                        <label htmlFor="username">Name</label>
                        <input
                            id="username"
                            type="text"
                            required
                            value={username || ''}
                            onChange={(e) => setUsername(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="full_name">FullName</label>
                        <input
                            id="full_name"
                            type="text"
                            required
                            value={full_name || ''}
                            onChange={(e) => setFullName(e.target.value)}
                        />
                    </div>
                    <div>
                        <label htmlFor="website">Website</label>
                        <input
                            id="website"
                            type="url"
                            value={website || ''}
                            onChange={(e) => setWebsite(e.target.value)}
                        />
                    </div>
                    <div>
                        <button className="button block primary"
                            type="submit"
                            disabled={loading}
                            onClick={handleButtonClick}
                        >
                            {loading ? 'Loading ...' : 'Update'}
                        </button>
                    </div>
                </form>
                
            </>
        )
        
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
