import { useLocation } from "react-router-dom";

const Result = () => {
    const jg = useLocation().state.type;
    var returnBody;
    //取得経験値の計算 and ランクの計算
     
    jg ? (
         returnBody = (   
            <div>
                <h1>Result</h1>
            </div>
        )
    ) : (
        returnBody = (   
            <div>
                <h1>GameOver!</h1>
                <div>
                    <h3>Score</h3>
                </div>
            </div>
        )
    );

    return returnBody;
}

export default Result;