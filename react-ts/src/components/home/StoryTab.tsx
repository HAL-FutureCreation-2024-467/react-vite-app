import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import { useNavigate } from 'react-router-dom';

const StoryTab: React.FC = () => {

  // const [chapters, setChapters] = useState<{ chapter: number }[]>();
  // const [paragraphs, setParagraphs] = useState<{ paragraph: string }[]>();
  const [StoryDB, setStoryDB] = useState<{chapter: number,paragraph: string}[] | null>(null);
  const navigate  = useNavigate()
  const storyButton = (chapters: number, paragraphs: string) => {
    console.log(chapters, paragraphs);
    navigate("/story/" + chapters + "/" + paragraphs);
  };


  useEffect(() => {
    const fetchData = async () => {
      try {
        // chapters と paragraphs の取得
        const { data, error: storyError } = await supabase
          .from('paragraph')
          .select();
    
        if (storyError) {
          console.error("データの取得に失敗しました", storyError);
          return;
        }
        if(data != null){
          setStoryDB(data);
          console.log(StoryDB);
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      }
    };
    fetchData();
  }, []); // 空の依存配列を渡して、初回のレンダリング時にのみ実行するようにします

  return (
      <div>
        {
          StoryDB ? 
          (Array.isArray(StoryDB) && StoryDB.map(
            (stage, index) => (
              <button key={index} onClick={() => storyButton(stage.chapter, stage.paragraph)}>
                {stage.chapter} - {stage.paragraph}
              </button>))):
          (<button>取得できなかった</button>)  
        }
        
      </div>
      
  );
}

export default StoryTab;
