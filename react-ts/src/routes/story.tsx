// import "@scss/story.scss";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Json } from "../types/database";

const story = () => {
  const TABLE_NAME = "story";
  const [storyDB, setStory] = useState<Json>(null); // 初期状態を null に変更

  const getImage = (filePath: string): string => {
    return new URL(`../assets/${filePath}`, import.meta.url).href;
  };

  const fetchStory = async () => {
    try {
      const { data, error } = await supabase.from(TABLE_NAME).select('sentence').eq('chapter', 1).eq('paragraph', 1);
      if (error) {
        console.error(error);
      } else if (data !== null && data.length > 0) {
        setStory(data);
      } else {
        console.error("No data found in the response.");
      }
    } catch (error) {
      console.error(error);
    }
  };



  useEffect(() => {
    fetchStory();
  }, []);
  
  // chapter 章
  // paragraph 段落
  // sentence 文

  // storyDB ステートが null の場合にローディングを表示
  if (storyDB === null) {
    return (
    <div>
      <p>Loading...</p>
    </div>
    )
  }

  return (
    <div>
      <p>{storyDB.toString()}</p>
    </div>
  );
}

export default story;