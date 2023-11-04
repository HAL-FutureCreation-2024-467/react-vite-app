import {Database} from "./database";

export type StoryType = Database["public"]["Tables"]["story"]["Row"]
  
export type MonsterType = Database["public"]["Tables"]["monsters"]["Row"]

export type HighscoreType = Database["public"]["Tables"]["highscore"]["Row"]

export type ProfileType = Database["public"]["Tables"]["profiles"]["Row"]