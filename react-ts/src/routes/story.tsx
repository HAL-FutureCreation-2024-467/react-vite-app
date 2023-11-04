// import "@scss/story.scss";
import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { Json } from "../types/database";

const story = () => {
  const TABLE_NAME = "story";
  let chp = 1;
  let para = 1;
  const [storyDB, setStory] = useState<Json|{}>({});// 初期状態を{}に変更

  const getImage = (filePath: string): string => {
    return new URL(`../assets/${filePath}`, import.meta.url).href;
  };

  useEffect(() => {
    (async () => await StoryTexT())();
  }, []);

  const StoryTexT = async () => {
    try {
      const { data, error } = await supabase
        .from('story')
        .select()

        if (error) throw error;
          setStory(data[0]);
          console.log(storyDB)
    } catch (error) {
      alert(error);
      setStory({});
    }
  };
  // chapter 章
  // paragraph 段落
  // sentence 文

  return (
    <div>
      {storyDB && Object.keys(storyDB).length === 0 ? (
        <p>Loading...</p>
      ) : (
        <div>
          <p>受信完了</p>
          {/* ここにstoryDBを表示するコードを追加 */}
        </div>
      )}
    </div>
  );
}

export default story;