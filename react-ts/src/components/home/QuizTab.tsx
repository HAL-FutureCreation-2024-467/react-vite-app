import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient";
import { Session } from "@supabase/supabase-js";

const QuizTab = (props : any) => {
    //const [mode, setmode] = useState<StoryType[]|null>(null);
    /*useEffect(() => {async function fetchStories() {
        try {
            const { data, error } = await supabase
            .from(TABLE_NAME)
            .select("*"); // "*" はすべてのカラムを選択することを意味します

            if (error) {
                console.error("データの取得に失敗しました", error);
            } else {
                console.log("データの取得に成功しました", data);
                setStory(data as StoryType[]);
            }
        } catch (error) {
            console.error("エラーが発生しました", error);
        }
    }
    fetchStories();
    }, []);*/
        //console.log(props.showQuizTab)
        //console.log(props.showTab)
        return (
            <>
            <div>
                <div>
                    <p>読めるけど書けない漢字</p>
                </div>
            </div>
            </>
        )
}

export default QuizTab;