import React from "react";
import { Link } from 'react-router-dom';
import { Router } from './router/Router';
import {
  createBrowserRouter,
  RouterProvider,
  Route,
} from "react-router-dom";
import Login from "../routes/login";

const modalContent = {
  background: "white",
  padding: "10px",
  borderRadius: "3px",
};

const overlay = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.5)",

  display: "flex",
  alignItems: "center",
  justifyContent: "center",
};

const Modal = (props) => {
  

  const closeModal = () => {
    props.setShowModal(false);
    props.setMenu('line_menu.png');
  };

  return (
    <>
      {props.showFlag ? ( // showFlagがtrueだったらModalを表示する
        <div id="overlay" style={overlay}>
          <div id="modalContent" style={modalContent} className="modalContainer">
            <div>
              <p>ユーザー登録</p>
            </div>
            <hr />
            <div>
              <p>登録すると、進行状態を保存できます</p>
            </div>
            <div className="modalBtn">
              <Link to="/home">登録せずに進む</Link>
            </div>
            <div className="modalBtn">
              <Link to="/login">ログイン</Link>
            </div>          
            <div>
              <p>{props.content}</p>
              <button onClick={closeModal}>閉じる</button>
            </div>
            
          </div>
        </div>
      ) : (
        <></>
        // showFlagがfalseの場合はModalは表示しない
      )}
    </>
  );
};

export default Modal;

