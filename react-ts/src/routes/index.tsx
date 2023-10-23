import { useEffect, useState } from "react";
import "../../src/assets/scss/style.scss";
import "../../src/assets/scss/home.scss";
import Keikoku from "../components/Keikoku";
import Live2d from "../components/Live2d";
import Story from "../components/Story";

function App() {
  const getImage = (filePath: string): string => {
    return new URL(`../assets/${filePath}`, import.meta.url).href;
  };
  const appState = localStorage.getItem("flag");
  const flag = appState ? appState : "no";
  const [logo, setLogo] = useState(true);
  const [qstart, setQstart] = useState(false);
  const [sstart, setSstart] = useState(false);
  const [storyModal, setStoryModal] = useState(false);
  const [storyVisible, setStoryVisible] = useState(false);
  const [quizVisible, setquizVisible] = useState(false);
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

  const storyCheck = () => {
    if (clearF == "ok") {
      //ストーリー開始
      setHome(false);
      setTimeout(() => {
        setStoryVisible(true);
      }, 500);
    } else {
      setStoryModal(!storyModal);
    }
  };
  const qstartBtn = () => {
    setHome(false);
    setTimeout(() => {
      setquizVisible(true);
    }, 500);
  };
  const changeF = () => {
    setCrearF("ok");
  };
  return (
    modelUrl && (
      <>
        <div className="App">
          <div className={home ? "black" : "black black-add"}></div>
          <section className={home ? "home-wrap" : "home-diss"}>
            <div className={storyModal ? "overlay-add" : "overlay"}></div>
            <div
              className="home-btn"
              onClick={() => {
                setLogo(true);
                setQstart(false);
                setSstart(false);
              }}
            >
              <img src={getImage('line_menu.png')} alt="" />
            </div>
            <div className={logo ? "logo-wrap" : "logo-diss"}>
              <img className="logo-img" src={getImage('logo.png')} alt="" />
            </div>
            <div className="home-text-wrap">
              <p className="home-text">~タップして始める~</p>
            </div>
          </section>
        </div>
        <Keikoku />
      </>
    )
  );
}

export default App;
