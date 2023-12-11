import { useCallback, useEffect, useRef, useState} from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ProfileType, ProfileGameStateType, ProfileStoryStateType } from "../types/tables";
import QuizTab from "../components/home/QuizTab";
import StoryTab from "../components/home/StoryTab";
import HomeModal from "../components/home/HomeModal";
import { useLocation, useNavigate } from 'react-router-dom';
import Live2DModule from '../components/Live2D/Live2d';

const Home = () => {
  const [sessions, setSession] = useState<Session | null>(null)
  const [user, setUser] = useState<ProfileType | null>(null)
  const [quizSelectMode,setQuizSelectMode] = useState<string | null>(null)
  const [quizDfText,setQuizDfText] = useState<string | null>(null)
  const [gameState, setGameState] = useState<ProfileGameStateType | null>(null)
  const [storyState, setStoryState] = useState<ProfileStoryStateType | null>(null)
  const [showTab, setShowTab] = useState<{ [key: string]: boolean }>({
    'story': false,
    'home': true,
    'quiz': false,
  })
  const [showQuiz,setShowQuiz] = useState(false);
  const homeTab = document.getElementById('homeTab');
  const quizTab = document.getElementById('quizTab');
  const storyTab = document.getElementById('storyTab');

  const navigate = useNavigate();
  const [showConfigModal, setShowModal] = useState(false);
  const [menuBar, setMenu] = useState("line_menu.png");
  const location = useLocation(); // useLocationを使ってlocationオブジェクトを取得
  const { tab, mode,grade} = location.state || {}; // stateからtabを取得
  const [flagMode,setFlagMode] = useState(mode)
  const [flagGrade,setFlagGrade] = useState(grade)
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session)
    })

    supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session)
    })
  }, [])

  useEffect(()=>{
    setFlagMode(mode)
    setFlagGrade(grade)
  },[location])

  const setTab = (tabName: string) => {
    const updatedTabs: { [key: string]: boolean } = {};
    Object.keys(showTab).forEach((key) => {
      updatedTabs[key] = key === tabName;
    });
    setShowTab(updatedTabs);
    if(showTab['quiz']){
      //setQuizSelectMode("")
      setShowQuiz(true)
      console.log("aaa")
    }
    setQuizSelectMode("")
    setshowF(false);
    setShowModal(false);
    setMenu('line_menu.png');
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
          setUser(profiles[0])
          setGameState(profiles[0]["game_state"])
          setStoryState(profiles[0]["story_state"])
        }
      }
    }
    setupUser()
    if(tab === 'story' || tab === 'quiz'){
      setTab(tab)
    }
  }, [sessions])

  useEffect(() => {
    const navigateRegFrom = async () => {
      if (user?.username === null) {
        navigate('/RegForm');
      } else {
      }
    };
    navigateRegFrom();
  }, [user]);

  const showLavel = (value : string | null, diff :string | null ) => {
    if(value=="class"){
      return `読めるけど書けない漢字編 -${diff}-`
    }else if(value == "rank"){
      return `日本語漢字能力検定編-${diff}-`
    }else{
      return "クイズ"
    }
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

  const [rank, setRank] = useState(0);

//他に変数用意して送るのがはやいか？



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

    useEffect(() => {
      if (user?.exp != null) {
        setRank(calculateLevel(user.exp));
      }
    }, [user, rank]);

  useEffect(() => {
    //showTabの状態によってボタンの色を変える
    const tabNames = {
      'home': homeTab,
      'quiz': quizTab,
      'story': storyTab
    };
    
    for (const tabName in tabNames) {
      const tab = tabNames[tabName];
      const isActive = showTab[tabName];
      
      if (isActive) {
        tab?.classList.add('tactive');
      } else {
        tab?.classList.remove('tactive');
      }
    }
    
  }, [showTab]);

  const [showF, setshowF] = useState<boolean>(false);
  const [fpMes, setFp] = useState<string>("");
  const fmes = [
    "新たな冒険の始まりだ。",
    "勇者の休息。",
    "伝説の再会。",
    "未知の世界へようこそ。",
    "危険が待ち受ける。",
    "強敵との対決。",
    "心を鼓舞する言葉。",
    "友情と絆。",
    "困難を乗り越えろ。",
    "目指すは最高の冒険。",
    "秘密の地への旅。",
    "新たな力を手に入れる。",
    "敵の策略にご用心。",
    "勝利の喜び。",
    "勇気を持て。",
    "運命に導かれし者たち。",
    "未知なる道のり。",
    "夢を追い求めて。",
    "終わりなき冒険。",
    "英雄の休息。",
    "I am アトミック",
  ];
  
  const randText = (array: string[]): string => {
    // 配列の長さを取得
    const leng = array.length;
    
    // ランダムなインデックスを生成
    const ri = Math.floor(Math.random() * leng);
    // ランダムな要素を返す
    return array[ri];
  }


  // Luve2D関連
  const modelPath = '/Live2dModel/rutika/rutika.model3.json';
  const childRef = useRef<any>();
  const [functions, setFunc] = useState<Function[]>([]);

  function executeRandomFunction() {
    // ランダムに関数を選択
    const randomIndex = Math.floor(Math.random() * functions.length);
    const selectedFunction = functions[randomIndex];
    
    // 選択された関数を実行
    selectedFunction();
  }

  const toggleF = () => {
    if (showF !== true) {
      setFp(randText(fmes));
    }
    setshowF(!showF);
    executeRandomFunction();
    console.log('randText');
  };

  useEffect(() => {
      const slash = () => {childRef.current?.slash()};
      const second = () => {childRef.current?.second()};
      const three = () => {childRef.current?.three()};
      const final = () => {childRef.current?.final()};
      const animationArray = [slash, second, three, final];
      setFunc(animationArray);
  }, [childRef]);

  return (
    <>
      {user?.username ? (
        <div className="home">
          <div className={"black"}></div>
          <section className="home-wrap">
            <div className="home_status">
              <div className="rank_box">
                  <p>ランク</p>
                  <p id="rankNum">{rank}</p>
              </div>
              <div className="statusBox">
                <p className="username">{user && user.username}</p>
                <p className="itemBox">♦️<span>{user && user.items}</span></p>
              </div>
              <div
                className="home-btn"
                onClick={toggleModal}
              >
              <img src={getImage(menuBar)} alt="" />
            </div>
            </div>
            <div className={showConfigModal ? "overlay-add" : "overlay"}>
              <HomeModal
                closeModal={toggleModal}
              />
            </div>
            <div className="TabSection">
            {showTab['home'] ? (
              <div className="live2dWidget" onClick={toggleF}>
                <Live2DModule ref={childRef} modelPath={modelPath as string} />
                <div className={showF ? "fukidashi show" : "fukidashi"}>
                  {/* showクラスの付与 メッセージのランダム性を持たせる */}
                  <div>
                    <p id="fukidashi-p">
                      {fpMes}
                    </p>
                  </div>
                </div>
              </div>
              
            ) : showTab['quiz'] ? (
              <>
                <h1>{showLavel(quizSelectMode,quizDfText)}</h1>
                <QuizTab 
                setQuizSelectMode={setQuizSelectMode}
                setQuizDfText={setQuizDfText}
                mode={flagMode}
                grade={flagGrade}
                setFlagMode={setFlagMode}
                setFlagGrade={setFlagGrade}
                gameState={gameState}
                showQuiz={showQuiz}
                setShowQuiz={setShowQuiz}
                />
              </>
            ) : showTab['story'] ? (
              <>
                <h1>ストーリー</h1>
                <StoryTab
                storyState={storyState}
                user={user}
                />
              </>
            ) : null}
            </div>
          </section>
          
          <div className="home-bottom-btn">
            <button className={showTab['story'] ? "tabBtn tactive" : "tabBtn"} id="storyTab" onClick={() => setTab('story')}>ストーリー</button>
            <button className={showTab['home'] ? "tabBtn tactive" : "tabBtn"}id="homeTab" onClick={() => setTab('home')}>ホーム</button>
            <button className={showTab['quiz'] ? "tabBtn tactive" : "tabBtn"} id="quizTab" onClick={() => setTab('quiz')}>クイズ</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
export default Home;