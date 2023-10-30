import { useEffect, useState } from "react";
import "../../src/assets/scss/style.scss";
import "../../src/assets/scss/home.scss";
import Modal from "../components/ConfigModal";

function App() {
  const getImage = (filePath: string): string => {
    return new URL(`../assets/${filePath}`, import.meta.url).href;
  };
  const appState = localStorage.getItem("flag");
  const flag = appState ? appState : "no";
  const [storyModal, setStoryModal] = useState(false);
  const [home, setHome] = useState(true);
  const [clearF, setCrearF] = useState("no");
  const displayStyle = clearF === "ok" ? {} : { display: "none" };
  const modelUrl = "/Live2dModels/rutika-model/runtime/rutika.model3.json";

  useEffect(() => {
    setCrearF(flag);
  }, []);
  useEffect(() => {
    localStorage.setItem("flag", clearF);
  }, [clearF]);
  
  const [showConfigModal, setShowModal] = useState(false); // Modalコンポーネントの表示の状態を定義する 0 ~ 5
  const [menuBar, setMenu] = useState("line_menu.png"); //menuの画像を変える
  const [username, setUserName] = useState("")

  const [showNo, setNo] = useState(false); //Nologinの画面表示用
  const [showLogin, setLogin] = useState(false); //Loginの画面表示用
  const [toggleInUp, setToggleInUp] = useState(true); // false = SignIn, true = SignUp

  const toggleModal = () => {
    setShowModal(!showConfigModal);
    
    if(!showConfigModal){//modalの状態でcross か barを変える
      setMenu('line_cross.png');
    }else{
      setMenu('line_menu.png');
    }

    setNo(false);
    setLogin(false);
    setToggleInUp(false);
  };

  const onNologin = () => {setNo(!showNo);};
  const toggleSign = () => {setLogin(!showLogin);};
  const toggleInUpFunc = () => {setToggleInUp(!toggleInUp)};

  const ShowModal = () => {
    setShowModal(true);
    setMenu('line_cross.png');
  };

  return (
    modelUrl && (
      <>
        <div className="App">
          <div className={"black"}></div>
          <section className={"home-wrap"}>
            <div className={storyModal ? "overlay-add" : "overlay"}></div>
            <div
              className="home-btn"
              onClick={toggleModal}
            >
              <img src={getImage(menuBar)} alt="" />
            </div>
            <div className="logo-wrap">
              <img className="logo-img" src={getImage('logo.png')} alt="" />
            </div>
            <div className="home-text-wrap">
              <p className="home-text">~タップして始める~</p>
            </div>
            <div> 
              <Modal 
                setUserName={setUserName} 
                onNologin={onNologin}
                setLogin={setLogin}
                toggleSign={toggleSign}
                toggleInUpFunc={toggleInUpFunc}
                closeModal={toggleModal}
                info={{showConfigModal , showNo, showLogin, toggleInUp, username}}
                 />
            </div>
          </section>
        </div>
        {/* <Keikoku /> */}
      </>
    )
  );
}

export default App;
