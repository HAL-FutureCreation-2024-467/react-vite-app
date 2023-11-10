import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../routes/index";
import Home from "../routes/home";
import Story from "../routes/story";
import Game_p from "../routes/game_prac";
import Game_t from "../routes/game_test";
import NotF from "../routes/404"; 

export const Router: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      {/* <Route path="/login" element={<Login />} /> */}
      {/* <Route path="/SignUp" element={<SignUp />} /> */}
      {/* <Route path="/account" element{< />}></Route> */}
      {/* <Route path="/setting" element={<Setting />} /> */}
      <Route path="/home" element={<Home />} />
      <Route path="/story/:chapter=:paragraph?" element={<Story />} />
      <Route path="/game/practice/:id?" element={<Game_p />} />
      <Route path="/game/test/:id?" element={<Game_t />} />
      <Route path="*" element={<NotF />} />
    </Routes>
  )
}