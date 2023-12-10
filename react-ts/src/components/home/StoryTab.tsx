import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import { useNavigate } from 'react-router-dom';
import { ProfileStoryStateType, StoryParagraph } from '../../types/tables';


const StoryTab: React.FC = (props :any) => {

  // const [chapters, setChapters] = useState<{ chapter: number }[]>();
  // const [paragraphs, setParagraphs] = useState<{ paragraph: string }[]>();
  // const [StoryDB, setStoryDB] = useState<{chapter: number,paragraph: string}[] | null>(null);
  const [StoryDB, setStoryDB] = useState<StoryParagraph[]>();
  const [storyState, setStoryState] = useState<ProfileStoryStateType | null>(null)

  const navigate = useNavigate()
  const storyButton = (chapters: number | null, paragraphs: string | null) => {
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
        if (data != null) {
          setStoryDB(data);
          console.log(StoryDB);
        }
      } catch (error) {
        console.error("エラーが発生しました", error);
      }
    };
    fetchData();
    setStoryState(props.storyState)
  }, []); // 空の依存配列を渡して、初回のレンダリング時にのみ実行するようにします

  useEffect(()=>{
    console.log(storyState)
  })

  return (
    <div>
      <h3>メインストーリー</h3>
      {
        StoryDB ?
          (Array.isArray(StoryDB) && StoryDB.map(
            (stage, index) => (
              <button key={index} onClick={() => storyButton(stage.chapter, stage.paragraph)}>
                {stage.chapter} - {stage.paragraph}
              </button>))) :
          (() => {
            console.log("取得できなかった");
            return <div></div>;
          })()
      }
      <h3>キャラクターストーリー</h3>
    </div>
  );
}

export default StoryTab;
