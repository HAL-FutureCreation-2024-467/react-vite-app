import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../routes/index";
import Login from "../routes/login";
// import Account from "."
// import { Game } from "../routes/game";


export const Router: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/login" element={<Login />} />
      {/* <Route path="/account" element{< />}></Route> */}
      {/* <Route path="/setting" element={<Setting />} /> */}
    </Routes>
  )
}