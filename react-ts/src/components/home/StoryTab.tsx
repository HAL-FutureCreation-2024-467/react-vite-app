import React, { useEffect, useState } from 'react';
import { supabase } from "../../supabaseClient";
import { useNavigate } from 'react-router-dom';
import { ProfileStoryStateType, StoryParagraph, ProfileType } from '../../types/tables';
import { clear } from 'console';
import ReleaseStoryAction from "../../components/home/ReleaseStoryAction";

const StoryTab: React.FC = (props :any) => {

  // const [chapters, setChapters] = useState<{ chapter: number }[]>();
  // const [paragraphs, setParagraphs] = useState<{ paragraph: string }[]>();
  // const [StoryDB, setStoryDB] = useState<{chapter: number,paragraph: string}[] | null>(null);
  const [StoryDB, setStoryDB] = useState<StoryParagraph[]>();
  const [storyState, setStoryState] = useState<ProfileStoryStateType | null>(null)
  const [user, setUser] = useState<ProfileType | null>(null)
  const navigate = useNavigate()
  const storyButton = (chapters: number | null, paragraphs: string | null) => {
    console.log(chapters, paragraphs);
    navigate("/story/" + chapters + "/" + paragraphs);
  };
  const [showConfigModal, setShowModal] = useState(false);
const [chapterNumber,setChapterNumber] = useState<number>();
const [paragraphNumber,setParagraphNumber] = useState<number>();
const [EXP,setEXP] = useState<number>();
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
    setUser(props.user)
  }, []); // 空の依存配列を渡して、初回のレンダリング時にのみ実行するようにします

  useEffect(()=>{
    console.log(storyState)
    console.log(EXP)
  })

  const toggleModal = (index : number,paragraph : number, chapter : number) => {
    setShowModal(!showConfigModal)
    setChapterNumber(index)
    setParagraphNumber(paragraph)
    setEXP(storyState["release"]["chapter"]["paragraph"][chapter]["exp"])
    console.log(EXP)
  };

  return (
    <div>
      <h3>メインストーリー</h3>
      {
        StoryDB ?
          (Array.isArray(StoryDB) && StoryDB.map(
            (stage, index) => (
              <button key={index} onClick={storyState["release"]["chapter"]["paragraph"]["1"]["story"][index] ? () => storyButton(stage.chapter, stage.paragraph) :  () => toggleModal(index,stage.paragraph, stage.chapter)}>
                {stage.chapter} - {stage.paragraph}
                {console.log("")}
              </button>))) :
          (() => {
            console.log("取得できなかった");
            return <div></div>;
          })()
      }
      <div className={showConfigModal ? "overlay-add" : "overlay"}>
              <ReleaseStoryAction
                setShowModal={setShowModal}
                storyState={storyState}
                chapterNumber={chapterNumber}
                paragraphNumber={paragraphNumber}
                user={user}
                EXP={EXP}
              />
      </div>
      <h3>キャラクターストーリー</h3>
    </div>
  );
}

export default StoryTab;
