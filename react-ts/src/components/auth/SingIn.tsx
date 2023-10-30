import { supabase } from "../../supabaseClient"
import { FormEvent, useState } from "react"

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
    <>
      <div id="overlay" className="modalBack">
        <div id="modalContent" className="modalContainer">
          <div>
            <p>ログイン</p>
          </div>
          <hr />
          <div>
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
                <button onClick={props.closeModal} type="button">閉じる</button>
                <button onClick={props.toggleInUp} type="button">新規作成</button>
              </div>
            </form>
          </div>
        </div>
      </div>
      </>
  )
}


export default SignIn;