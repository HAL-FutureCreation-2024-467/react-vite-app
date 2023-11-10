import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Link, useNavigate } from 'react-router-dom';
import { QuizClassType } from "../../types/tables";


const QuizTab = () => {
  interface EpisodeData {
    episodes: number;
    class: string;
    rank: string;
  }

  const [classLevel, setClassLevel] = useState<String>("")
  const [rankLevel, setRankLevel] = useState<String>("")
  const [TABLE_NAME, setTABLE_NAME] = useState("")
  const [quizClass, setQuizClass] = useState<EpisodeData[]>([]);
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
  const threeGrades = grades.slice(0, 3);
  const sixGrades = grades.slice(3);
  const classButtonClick = (rank: string) => {
    setClassLevel(rank)
    setTABLE_NAME('quiz_class_epi')
  };
  const rankButtonClick = (rank: string) => {
    setRankLevel(rank)
    setTABLE_NAME('quiz_rank_epi')
  };
  const gameButton = (episodes: number, quizclass: string) => {
    //<Link />
    console.log(episodes, quizclass)
    navigate(`/game/practice/?class=${quizclass}&episodes=${episodes}`);
  };

  useEffect(() => {
    async function fetchCategory() {
      try {
        if(TABLE_NAME == 'quiz_class_epi'){}
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
  }, [classLevel,rankLevel])
  
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

  if (!classLevel && !rankLevel) {
    return (
      <div>
        <div>
          <p>読めるけど読めない漢字</p>
          <div>
            {threeGrades.map((grade, index) => (
              <button key={index} onClick={() => classButtonClick(grade.rank)}>
                {grade.name}
              </button>
            ))}
          </div>
        </div>
        <div>
          <p>日本語漢字能力検定（漢検）編</p>
          <div>
            {sixGrades.map((grade, index) => (
              <button key={index} onClick={() => rankButtonClick(grade.rank)}>
                {grade.name}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  } else {
    return (
      <div>
        {Array.isArray(quizClass) && quizClass.map((stage, index) => (
          <button key={index} onClick={() => gameButton(stage.episodes, stage.class)}>
            {getButtonLabel(stage)}
          </button>
        ))}
      </div>
    );
  }
}
export default QuizTab;