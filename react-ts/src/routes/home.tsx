import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";   
import type { Database } from '../types/database'

//const user = supabase.auth.user()

type userprofiles = {
    avatar_url: string | null;
    full_name: string | null;
    id: string;
    updated_at: string | null;
    username: string | null;
    website: string | null;
} | null

const Home = () => {
    const [sessions, setSession] = useState()
    const [user, setUser] = useState<userprofiles>()
    //できればこの下の記述を使いたい database.tsの型を使用したい
    //const [user, setUser] = useState<Database>()
    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
        setSession(session)
    })

        supabase.auth.onAuthStateChange((_event, session) => {
        setSession(session)
        })
    }, [])


    useEffect(() => {
        const setupUser = async () => {
            if(sessions?.user.id){
                //console.log(sessions.user.id)
                const {data} = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sessions.user.id)
                    .single()
                //console.log("user?" + profiles.username)
                setUser(data)
                //console.log("user?" + user.username)
            }
        }
        setupUser()
    },[sessions])

    return(
        <>
        <div>
            <section>
            <div>
                <p>レベル</p>
            </div>
            <div>
                <p>{user && user.username}</p>
                <p>アイテム数</p>
            </div>
            <div>
                <p>モーダルを表示</p>
            </div>
            </section>
        </div>
        </>
    );
}

export default Home;