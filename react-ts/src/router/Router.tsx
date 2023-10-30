import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import Index from "../routes/index";
import Home from "../routes/home";
import Story from "../routes/story";


export const Router: FC = () => {
  return (
    <Routes>
      <Route path="/" element={<Index />} />
      <Route path="/home" element={<Home />} />
      <Route path="/story" element={<Story />} />
    </Routes>
  )
}