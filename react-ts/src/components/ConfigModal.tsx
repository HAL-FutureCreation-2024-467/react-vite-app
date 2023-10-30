import { useState } from "react";
import SignIn from "./auth/SingIn";
import SignUp from "./auth/SingUp";

const Modal = (props) => {
  
  const [username, setUserName] = useState("")

  const [showNo, setNo] = useState(false); //Nologinの画面表示用
  const [showLogin, setLogin] = useState(false); //Loginの画面表示用
  const [toggleInUp, setToggleInUp] = useState(true); // false = SignIn, true = SignUp

  const closeModal = () => {
    props.setShowModal(false);
    props.setMenu('line_menu.png');

    setNo(false);
    setLogin(false);
    setToggleInUp(false);
  };

  const onSubmit = () => {
    //ユーザーネームのみを登録してhomeに遷移する
    console.log(username + "の登録が完了しました");
  };

  const onNologin = () => {setNo(!showNo);};
  const toggleSign = () => {setLogin(!showLogin);};
  const toggleInUpFunc = () => {setToggleInUp(!toggleInUp)};

  return (
    <>
     {!props.showFlag ? null :
        showNo ? (
          <div id="overlay" className="modalBack">
            <div id="modalContent" className="modalContainer">
              <div>
                <p>ユーザー登録:メール無し</p>
              </div>
              <hr />
              <div className="modalBtn">
                <input type="text"
                  required value={username}
                  onChange={e => setUserName(e.target.value)}
                />
              </div>
              <div>
                <button onClick={onNologin}>閉じる</button>
              </div>
            </div>
          </div>
        ) : (
          showLogin ? (
            toggleInUp ? (
              <SignIn setNo={setNo} closeModal={toggleSign} toggleInUp={toggleInUpFunc}/>
            ) : (
              <SignUp onSubmit={onSubmit} setNo={setNo} closeModal={toggleSign} toggleInUp={toggleInUpFunc}/>
            )
          ):( 
            <div id="overlay" className="modalBack">
              <div id="modalContent" className="modalContainer">
                <div>
                  <p>ユーザー登録</p>
                </div>
                <hr />
                <div>
                  <p>登録すると、進行状態を保存できます</p>
                </div>
                <div className="modalBtn">
                  <button onClick={onNologin}>登録せずに進む</button>
                </div>
                <div className="modalBtn">
                  <button onClick={toggleSign}>ログイン</button>
                </div>
                <div>
                  <button onClick={closeModal}>閉じる</button>
                </div>
              </div>
            </div> 
          )
        )}
    </>
  );
};

export default Modal;