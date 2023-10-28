import { useState } from "react";
import SignIn from "./auth/SingIn";
import SignUp from "./auth/SingUp";

const modalContent = {
  background: "white",
  padding: "10px",
  borderRadius: "3px",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Modal = (props) => {
  
  const [username, setUserName] = useState("")
  const closeModal = () => {
    props.setShowModal(0);
    props.setMenu('line_menu.png');
  };

  const onSubmit = () => {
    //ユーザーネームのみを登録してhomeに遷移する
    console.log(username + "の登録が完了しました");
  }

  return (
    <>
      {(props.showFlag == 1) ? ( // 条件がtrueだったらModalを表示する
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent} className="modalContainer">
            <div>
              <p>ユーザー登録</p>
            </div>
            <hr />
            <div>
              <p>登録すると、進行状態を保存できます</p>
            </div>
            <div className="modalBtn">
              <button onClick={props.setShowModal(2)}>登録せずに進む</button>
            </div>
            <div className="modalBtn">
              <button onClick={props.setShowModal(3)}>ログイン</button>
            </div>          
            <div>
              <p>{props.content}</p>
              <button onClick={closeModal}>閉じる</button>
            </div>
            
          </div>
        </div>
      ) : (props.showFlag == 2) ? ( // ユーザーネームの登録 登録されていないユーザログイン時
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent} className="modalContainer">
            <div>
              <p>ユーザーネーム登録</p>
            </div>
            <hr />
            <div>
              <p>ゲーム内で使用する名前を入力してください</p>
            </div>
            <div className="input-name">
              <label>名前</label>
              <input type="text" 
                required value={username} 
                onChange={e => setUserName(e.target.value)} 
              />
              <p>（１文字以上６文字以下？）</p>
            </div>   
            <div>
              <p>名前はプロフィールからいつでも変更できます</p>
            </div>
            <div>
              <button onClick={onSubmit}>決定</button>
            </div>
          </div>
        </div>
    ) : (props.showFlag == 3) ? ( // ログイン画面を表示
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent} className="modalContainer">
            <SignIn showflag={props.showFlag} />
          </div>
        </div>
    ) : (props.showFlag == 4) ? ( // 新規登録画面を表示
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent} className="modalContainer">
            <SignUp />
          </div>
        </div>
    ) : null
      }
    </>
  );
};

export default Modal;

