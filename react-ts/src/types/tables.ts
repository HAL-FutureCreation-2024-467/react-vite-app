import {Database, Json} from "./database";

export type StoryType = Database["public"]["Tables"]["story"]["Row"]
  
export type MonsterType = Database["public"]["Tables"]["monsters"]["Row"]

export type HighscoreType = Database["public"]["Tables"]["highscore"]["Row"]

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"]

export type QuizRankType = Database["public"]["Tables"]["quiz_rank"]["Row"]

export type QuizClassType = Database["public"]["Tables"]["quiz_class"]["Row"]