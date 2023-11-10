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
            setupUser()
        }
        setLoading(false)
    }


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

    return (
        <>
            <div className="App">
                <div className={"black"}></div>
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
                    {user?.username ? (
                        showTab['home'] ? (
                            <>
                                <h1>ホーム</h1>
                            </>
                        ) : showTab['quiz'] ? (
                            // Quiz コンポーネントの内容
                            <>
                                <h1>クイズ</h1>
                                <QuizTab />
                            </>
                        ) : showTab['story'] ? (
                            // Story コンポーネントの内容
                            <>
                                <h1>ストーリー</h1>
                                <StoryTab />
                            </>
                        ) : null
                    ) : (
                        // ユーザー情報登録画面の内容
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
                                    >
                                        {loading ? 'Loading ...' : 'Update'}
                                    </button>
                                </div>
                            </form>
                        </>
                    )}
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
export default Home;