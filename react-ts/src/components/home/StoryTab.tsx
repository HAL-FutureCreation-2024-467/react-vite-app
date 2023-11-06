import { useState, useEffect } from "react"
import { supabase } from "../../supabaseClient";
import { Session } from "@supabase/supabase-js";
import { Link, useNavigate } from 'react-router-dom';

const StoryTab = () => {
    // const grades{} = {} 
   /* const grades: { name: string; rank: string }[] = [
        { name: "初級", rank: 'low' },
        { name: "中級", rank: 'mid' },
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
     const handleButtonClick = (rank: string) => {
       // ボタンをクリックしたときに指定のランクに遷移
       navigate(`/game/practice/${rank}`);
     };*/
     return (
       <div>
         <div>
           <p>読めるけど読めない漢字</p>
           <div>
             {/*threeGrades.map((grade, index) => (
               <button key={index} onClick={() => handleButtonClick(grade.rank)}>
                 {grade.name}
               </button>
             ))*/}
           </div>
         </div>
         <div>
           <p>日本語漢字能力検定（漢検）編</p>
           <div>
             {/*sixGrades.map((grade, index) => (
               <button key={index} onClick={() => handleButtonClick(grade.rank)}>
                 {grade.name}
               </button>
             ))*/}
           </div>
         </div>
       </div>
     );
   }
   export default StoryTab;