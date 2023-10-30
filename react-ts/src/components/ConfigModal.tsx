import { useState } from "react";
import SignIn from "./auth/SingIn";
import SignUp from "./auth/SingUp";

const Modal = (props:  any) => {
  return (
    <>
     {!props.info.showConfigModal ? null :
        props.info.showNo ? (
          <div id="overlay" className="modalBack">
            <div id="modalContent" className="modalContainer">
              <div>
                <p>ユーザー登録:メール無し</p>
              </div>
              <hr />
              <div className="modalBtn">
                <input type="text"
                  required value={props.info.username}
                  onChange={e => props.setUserName(e.target.value)}
                />
              </div>
              <div>
                <button onClick={props.onNologin}>閉じる</button>
              </div>
            </div>
          </div>
        ) : (
          props.info.showLogin ? (
            props.info.toggleInUp ? (
              <SignIn 
                toggleSign={props.toggleSign} 
                closeModal={props.closeModal} 
                setLogin={props.setLogin} 
                toggleInUpFunc={props.toggleInUpFunc}
                />
            ) : (
              <SignUp 
                toggleSign={props.toggleSign} 
                closeModal={props.closeModal} 
                setLogin={props.setLogin} 
                toggleInUpFunc={props.toggleInUpFunc}
                />
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
                  <button onClick={props.onNologin}>登録せずに進む</button>
                </div>
                <div className="modalBtn">
                  <button onClick={props.toggleSign}>ログイン</button>
                </div>
                <div>
                  <button onClick={props.closeModal}>閉じる</button>
                </div>
              </div>
            </div> 
          )
        )}
    </>
  );
};

export default Modal;