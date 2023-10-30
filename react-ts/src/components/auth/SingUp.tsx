import { supabase } from '../../supabaseClient'
import { useState } from "react";

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

 const SignUp = (props: any) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [passwordConf, setPasswordConf] = useState("")

  const onSubmit = async(e) => {
    e.preventDefault();
    if(password == passwordConf){
      try{
        const { error:signUpError } = await supabase.auth.signUp({
          email: email,
          password: password,
        })
        if (signUpError) {
          throw signUpError;
        }
      alert('登録完了メールを確認してください');
      }catch(error){
        alert('エラーが発生しました');
      }
    } else {
      alert('パスワードが一致しません');
    }
  };

  return (
    <>
      <div id="overlay" className="modalBack">
        <div id="modalContent" className="modalContainer">
            <div>
              <p>新規登録</p>
              <button onClick={props.toggleInUp} type="button">ログイン</button>
            </div>
            <hr />
      <div >
        <form onSubmit={onSubmit}>
          <div>
            <label>メールアドレス</label>
            <input type="email"
              required value={email}
              onChange={e => setEmail(e.target.value)}
            />
          </div>
          <div>
            <label>パスワード</label>
            <input type="password"
              required value={password}
              onChange={e => setPassword(e.target.value)}
            />
          </div>
          <div>
            <label>パスワード（確認）</label>
            <input type="password"
              required value={passwordConf}
              onChange={e => setPasswordConf(e.target.value)}
            />
          </div>
          <div>
            <button type="submit">サインアップ</button>
            <button onClick={props.closeModal} type="button">閉じる</button>
          </div>
        </form>
        </div>
      </div> 
      </div>
    </>
  )
}

export default SignUp;