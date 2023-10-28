import { supabase } from "@/supabaseClient"
import { FormEvent, useState } from "react"

const SignIn = (props: any) => {

  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    const { data, error } = await supabase.auth.signInWithPassword({
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
          <button type="submit">ログイン</button>
        </div>
      </form>
    </section>
  )
}


export default SignIn;