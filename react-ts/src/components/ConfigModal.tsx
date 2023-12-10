import { useState } from "react";
import "../../src/assets/scss/index.scss"
import SignIn from "./auth/SingIn";
import SignUp from "./auth/SingUp";
import { supabase } from "../supabaseClient";

const Modal = (props:  any) => {
  const [email, setEmail] = useState("guest@example.com")
  const [password, setPassword] = useState("guest")

  const onSubmit = async () => {
    console.log('test')

    const { data, error } = await supabase.auth.signInWithPassword({
      email: email,
      password: password,
    })

    if (error) {
      throw error;
    }

    if(data){
      location.href = "/home";
    }
  }
  return (
    <>
     {!props.info.showConfigModal ? null :
        props.info.showNo ? (
          // Gusetユーザーの場合 guest@example.comを使用
          // パスワードをランダムに生成
          <div id="overlay" className="modalBack">
            <div id="modalContent" className="modalContainer">
              <div>
                <p>ゲストモードでプレイ</p>
              </div>
              <hr />
              <div>
                <p>登録すると、進行状態を保存できます</p>
              </div>
              <div>
                <button type="submit" onClick={onSubmit}>プレイ</button>
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
              <div id="modalContent" className="homeModalContainer">
                      <h3>ユーザー登録</h3>
                    <hr />
                      <p>登録すると、進行状態を保存できます</p>

                      <div className="modalBtns">
                         <button onClick={props.onNologin} className="modalBtn">登録せずにはじめる</button>
                          <button onClick={props.toggleSign}  className="modalBtn">ログイン</button>
                      </div>
                      
                </div>
            </div> 
          )
        )}
    </>
  );
};

export default Modal;