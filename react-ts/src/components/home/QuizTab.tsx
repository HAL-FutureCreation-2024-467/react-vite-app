import { useState, useEffect } from "react"

const QuizTab = (props : any) => {
    if(!props.showQuizTab['practice'] && !props.showQuizTab['test']){
        //console.log(props.showQuizTab)
        //console.log(props.showTab)
        return (
            <>
            <div>
                <div>
                    <button onClick={() => props.setQTab('practice')}>練習</button>
                    <button onClick={() => props.setQTab('test')}>本番</button>
                </div>
            </div>
            </>
        )
        }else if(props.showQuizTab['practice']){
            console.log(props.showQuizTab)
            return (
                <>
                <div>
                    <h1>練習</h1>
                </div>
                </>
            )
        }else if(props.showQuizTab['test']){
            console.log(props.showQuizTab)
            return (
                <>
                <div>
                    <h1>本番</h1>
                </div>
                </>
            )
        }else{
            console.log(props.showTab)
        }
}

export default QuizTab;