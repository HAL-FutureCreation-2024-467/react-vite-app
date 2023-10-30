<<<<<<< HEAD
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


export default function SignUp(){

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
      <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent} className="modalContainer">
            <div>
              <p>新規登録</p>
            </div>
            <hr />
      <div >
        <form onSubmit={onSubmit}>
          <div>
            <label>メールアドレス</label>
            <input type="email"
              required value={email}
              onChange={e => setEmail(e.target.value)}
=======
import { useState } from "react"
import { supabase } from "@/supabaseClient"

function SignUp() {

    const [email, setEmail] = useState("")
    const [password, setPassword] = useState("")
    const [passwordConf, setPasswordConf] = useState("")
  
    //ユーザーの登録
    const onSubmit = async (e) => {
      e.preventDefault()
  
      const { data, error } = await supabase.auth.signUp({
        email: email,
        password: password,
      })
  
      if (error) {
        throw error;
      }
    }
  
    return (
      <section>
        <form onSubmit={onSubmit}>
          <div>
            <label>メールアドレス</label>
            <input type="email" 
              required value={email} 
              onChange={e => setEmail(e.target.value)} 
>>>>>>> 5284b872d2b265ad62ae494168af71d89d2e1898
            />
          </div>
          <div>
            <label>パスワード</label>
<<<<<<< HEAD
            <input type="password"
              required value={password}
              onChange={e => setPassword(e.target.value)}
=======
            <input type="password" 
              required value={password} 
              onChange={e => setPassword(e.target.value)} 
>>>>>>> 5284b872d2b265ad62ae494168af71d89d2e1898
            />
          </div>
          <div>
            <label>パスワード（確認）</label>
<<<<<<< HEAD
            <input type="password"
              required value={passwordConf}
              onChange={e => setPasswordConf(e.target.value)}
=======
            <input type="password" 
              required value={passwordConf} 
              onChange={e => setPasswordConf(e.target.value)} 
>>>>>>> 5284b872d2b265ad62ae494168af71d89d2e1898
            />
          </div>
          <div>
            <button type="submit">サインアップ</button>
          </div>
        </form>
<<<<<<< HEAD
        </div>
      </div> 
      </div>
    </>
  )
}
=======
      </section>
    )
  }
  
  export default SignUp;
>>>>>>> 5284b872d2b265ad62ae494168af71d89d2e1898
