// import "@scss/story.scss";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { StoryType } from "../types/tables";

const story = () => {
  const TABLE_NAME = 'story';
  let chp = 1;
  let para = 1;
  const [stories, setStory] = useState<StoryType[]|null>(null);// 初期状態を{}に変更

  const getImage = (filePath: string): string => {
    return new URL(`../assets/${filePath}`, import.meta.url).href;
  };

  useEffect(() => {
    async function fetchStories() {
      try {
        const { data, error } = await supabase
          .from(TABLE_NAME)
          .select("*") // "*" はすべてのカラムを選択することを意味します
          .order("created_at");

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
  }, []);

  // chapter 章
  // paragraph 段落
  // sentence 文

  return (
    <div>
      {
        stories == null 
        ? (<p>Loading...</p>) 
        : (
            Object.keys(stories[0]).length === 0 ? (
              <p>受信に問題が発生した</p>
            ) : (
              stories.map((story, index) => {
                return (
                  <div key={index}>
                    <p>{story.chapter}-{story.paragraph}</p>
                    {/* <p>{story.sentence)}</p> */}
                  </div>
                )
              })
            )
          )
      }
    </div>
  );
}

export default story;