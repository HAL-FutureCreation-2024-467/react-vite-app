import { useEffect, useRef, useState } from "react";
import { supabase } from "../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { ProfileType } from "../types/tables";
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
  const [showTab, setShowTab] = useState<{ [key: string]: boolean }>({
    'story': false,
    'home': true,
    'quiz': false,
  })
  const homeTab = document.getElementById('homeTab');
  const quizTab = document.getElementById('quizTab');
  const storyTab = document.getElementById('storyTab');

  const navigate = useNavigate();
  const [showConfigModal, setShowModal] = useState(false);
  const [menuBar, setMenu] = useState("line_menu.png");
  const location = useLocation(); // useLocationを使ってlocationオブジェクトを取得
  const { tab } = location.state || {}; // stateからtabを取得
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
    setQuizSelectMode("")
    setshowF(false);
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
        }
      }
    }
    setupUser()
    if(tab === 'story'){
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

  const calculateLevel = (EXP: number | null) => { //現在の経験値からレベルを計算する関数
          const exPerLevel = 12;
          let level = 1;
          let requiredExperience = 0;
          while (EXP !== null && EXP >= requiredExperience) {
              requiredExperience += exPerLevel;
              level++;
          }
      
          return level - 1; // whileループを抜けるときに1回余分にインクリメントされているので、1を引いて正しいレベルを返す
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
  const modelPath = '/rutika-model/runtime/rutika.model3.json';
  const childRef = useRef<any>(null);
  const slash = () => {childRef.current ? childRef.current.slash() : null};
  const playSecond = () => {childRef.current ? childRef.current.second() : null};
  const playThree = () => {childRef.current ? childRef.current.three() : null};
  const playFinal = () => {childRef.current ? childRef.current.final() : null};
  const animationArray = [slash, playSecond, playThree, playFinal];

  function executeRandomFunction() {
    // ランダムに関数を選択
    const randomIndex = Math.floor(Math.random() * animationArray.length);
    const selectedFunction = animationArray[randomIndex];
    
    // 選択された関数を実行
    selectedFunction();
  }

  const toggleF = (() => {
    // executeRandomFunction();
    if(showF != true){
      setFp(randText(fmes));
    }
    setshowF(!showF)
    console.log('randText');
  });


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
              </div>
              
            ) : showTab['quiz'] ? (
              <>
                <h1>{showLavel(quizSelectMode,quizDfText)}</h1>
                <QuizTab 
                setQuizSelectMode={setQuizSelectMode}
                setQuizDfText={setQuizDfText}
                />
              </>
            ) : showTab['story'] ? (
              <>
                <h1>ストーリー</h1>
                <StoryTab />
              </>
            ) : null}
            </div>
          </section>
          <div className={showF ? "fukidashi show" : "fukidashi"}>
            {/* showクラスの付与 メッセージのランダム性を持たせる */}
            <div>
              <p id="fukidashi-p">
                {fpMes}
              </p>
            </div>
          </div>
          <div className="home-bottom-btn">
            <button className="tabBtn" id="storyTab" onClick={() => setTab('story')}>ストーリー</button>            
            <button className="tabBtn" id="storyTab" onClick={() => setTab('story')}>ストーリー</button>
            <button className="tabBtn tactive" id="homeTab" onClick={() => setTab('home')}>ホーム</button>
            <button className="tabBtn" id="quizTab" onClick={() => setTab('quiz')}>クイズ</button>
            <button className="tabBtn" id="quizTab" onClick={() => setTab('quiz')}>クイズ</button>
          </div>
        </div>
      ) : null}
    </>
  );
}
export default Home;