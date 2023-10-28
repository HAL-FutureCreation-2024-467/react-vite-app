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
          </div>
        </form>
      </section>
    )
  }
  
  export default SignUp;