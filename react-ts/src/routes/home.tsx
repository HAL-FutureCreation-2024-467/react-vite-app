import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";   

// const [sessions, setSession] = useState(null)

// useEffect(() => {
//     supabase.auth.getSession().then(({ data: { session } }) => {
//     setSession(session)
// })

//     supabase.auth.onAuthStateChange((_event, session) => {
//       setSession(session)
//     })
//   }, [])

// const user = supabase.auth.user()

const Home = () => {
    return(
        <div>
            <h1>Home</h1>
        </div>
    );
}

export default Home;