import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient";
import { useNavigate } from 'react-router-dom';
import { QuizClassEpi, QuizRankEpi } from "../../types/tables";

const QuizTab = (props : any) => {

  type EpisodeData = QuizRankEpi & QuizClassEpi

const [classLevel, setClassLevel] = useState<string>("")
  const [rankLevel, setRankLevel] = useState<string>("")
  const [TABLE_NAME, setTABLE_NAME] = useState("")
  const [quizClass, setQuizClass] = useState<EpisodeData[]>([]);
  const [grade, setGrade] = useState<string | null>(null);
  const grades: { name: string; rank: string }[] = [
    { name: "初級", rank: 'low' },
    { name: "中級", rank: 'mediam' },
    { name: "上級", rank: 'high' },
    { name: "五級", rank: 'g5' },
    { name: "四級", rank: 'g4' },
    { name: "三級", rank: 'g3' },
    { name: "準二級", rank: 'gp2' },
    { name: "二級", rank: 'g2' },
    { name: "準一級", rank: 'gp1' },
  ];
  const navigate = useNavigate();
  const selectDifficulty = (rank: string, value: string) => {
    setGrade(value)
    props.setQuizSelectMode(value)
    console.log(rank)
    if (value == 'class') {
      setClassLevel(rank)
      setTABLE_NAME('quiz_class_epi')
    } else {
      setRankLevel(rank)
      setTABLE_NAME('quiz_rank_epi')
    }
  };
  const gameButton = (episodes: number | null, quizclass: string | null, grade: string | null) => {
    //console.log(episodes, quizclass)
    navigate(`/game/practice/${grade}/${quizclass}/${episodes}`);
  };
  const gameTest = (grade: string | null, rank: string | null) => {
    //console.log(episodes, quizclass)
    navigate(`/game/test/${grade}/${rank}`);
  };


  useEffect(() => {
    if(props.mode == 'class'){
      selectDifficulty(props.grade,props.mode)
    }else if(props.mode == 'rank'){
      selectDifficulty(props.grade,props.mode)
    }
    async function fetchCategory() {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select(TABLE_NAME === 'quiz_class_epi' ? "episodes, class" : "episodes, rank")
          .eq(TABLE_NAME === 'quiz_class_epi' ? 'class' : 'rank', TABLE_NAME === 'quiz_class_epi' ? classLevel : rankLevel);
        if (error) {
          console.error("データの取得に失敗しました", error);
        } else {
          console.log("データの取得に成功しました", data);
          setQuizClass(data as EpisodeData[]);
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      }
    }
    fetchCategory();
  }, [classLevel, rankLevel])
  
  const getButtonLabel = (stage: EpisodeData) => {
    const matchingClass = grades.find((grade) => grade.rank === stage.class);
    const matchingRank = grades.find((grade) => grade.rank === stage.rank);

    if (matchingClass) {
      return `${matchingClass.name}:その${stage.episodes}`;
    } else if (matchingRank) {
      return `${matchingRank.name}:その${stage.episodes}`;
    } else {
      return `${stage.episodes}`;
    }
  };

  const getNameLabel = (grade : String | null) => {
      if(grade=="class"){
        const matchingGrade = grades.find(grade => grade.rank === classLevel);
        const displayText : string |null = matchingGrade?.name || '';
        props.setQuizDfText(displayText)
        return `漢伐 -${displayText}漢獣-`;
      }else{
        const matchingGrade = grades.find(grade => grade.rank === rankLevel);
        const displayText = matchingGrade?.name || '';
        return `漢伐 -${displayText}漢獣-`;
      }
  }

  return (
    <div>
      {(!classLevel && !rankLevel) ? (
        <div className="QTab">
          <p><span><span className="span-bg"></span>読めるけど書けない漢字</span></p>
          <div className="KYomenai">
            <div className="KYomenai-btns">
              {grades.slice(0, 3).map((grade, index) => (
                <button key={index} onClick={() => selectDifficulty(grade.rank, 'class')}>
                  {grade.name}
                </button>
              ))}
            </div>
          </div>
          <p><span><span className="span-bg"></span>日本語漢字能力検定（漢検）編</span></p>
          <div className="KKentei">
            <div className="KKentei-btns">
              {grades.slice(3).map((grade, index) => (
                <button key={index} onClick={() => selectDifficulty(grade.rank, 'rank')}>
                  {grade.name}
                </button>
              ))}
            </div>
          </div>
        </div>
      ) : (
        <>
        {props.setFlagMode("")}
        {props.setFlagGrade("")}
        <div>
          <button onClick={() => gameTest(grade,!classLevel ? rankLevel: classLevel)}> {getNameLabel(grade)}</button>
        </div>
          <div className="Quizbox">
            {Array.isArray(quizClass) && quizClass.map((stage, index) => (
              <button key={index} onClick={() => gameButton(stage.episodes, grade === 'class' ? stage.class : stage.rank, grade)}>
                {getButtonLabel(stage)}
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
export default QuizTab;