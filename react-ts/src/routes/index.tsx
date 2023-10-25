import { useEffect, useState } from "react";
import "../../src/assets/scss/style.scss";
import "../../src/assets/scss/home.scss";
import Keikoku from "../components/Keikoku";
import Live2d from "../components/Live2d";
import Story from "../components/Story";
import Modal from "../components/ConfigModal";

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
  
  const [showConfigModal, setShowModal] = useState(false); // Modalコンポーネントの表示の状態を定義する

  const ShowModal = () => {
    setShowModal(true);
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
              onClick={ShowModal}
            >
              <img src={getImage('line_menu.png')} alt="" />
            </div>
            <div className={logo ? "logo-wrap" : "logo-diss"}>
              <img className="logo-img" src={getImage('logo.png')} alt="" />
            </div>
            <div className="home-text-wrap">
              <p className="home-text">~タップして始める~</p>
            </div>
            <div> 
              <Modal showFlag={showConfigModal} setShowModal={setShowModal} />
            </div>
          </section>
        </div>
        <Keikoku />
      </>
    )
  );
}

export default App;
