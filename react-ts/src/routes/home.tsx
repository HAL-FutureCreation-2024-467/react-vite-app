import { useEffect, useState } from "react";
import { supabase } from "../supabaseClient";   
import type { Json } from '../types/database'
import { Session } from "@supabase/supabase-js";

const Home = () => {
    const [sessions, setSession] = useState<Session | null>(null)
    const [user, setUser] = useState<Json>(null)
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
                const {data} = await supabase
                    .from('profiles')
                    .select('*')
                    .eq('id', sessions.user.id)
                    .single()
                setUser(data)
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