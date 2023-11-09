import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import axios from 'axios';
import Tesseract, { createWorker } from "tesseract.js";

const url = 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit';

const Appkey = '5dfc227a-bcf2-4b86-a3d3-e222442e22ea';
const HMACkey = '9c2568f8-69e3-40bb-aebc-fd10e0f6a164';

interface Quiz {
  question: string | null;
  answer: string | null;
  choices: string[] | null;
}

interface IRect {
  width: number;
  height: number;
  left: number;
  right: number;
  top: number;
  bottom: number;
}

interface CanvasProps {
  quizNow: Quiz;
  ansShow: boolean;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  const quizNow = props.quizNow;
  const showCanvasText = props.ansShow;
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const worker = createWorker();
  const [result, setResult] = useState<string>("");
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backareaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = canvasRef.current;
  const backCanvas = backareaCanvasRef.current;
  let mouseX: number | null = null;
  let mouseY: number | null = null;

  const getContext = (): CanvasRenderingContext2D => {
    let canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const OnClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) { return; }
    let canvas: any = canvasRef.current;
    let rect: IRect = canvas.getBoundingClientRect();
    let x = ~~(e.clientX - rect.left);
    let y = ~~(e.clientY - rect.top);
    Draw(x, y);
  }

  const OnMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) { return; }
    let canvas: any = canvasRef.current;
    let rect: IRect = canvas.getBoundingClientRect();
    let x = ~~(e.clientX - rect.left);
    let y = ~~(e.clientY - rect.top);
    Draw(x, y);
  }

  const DrawEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseX = null;
    mouseY = null;
    //
  }

  const Draw = (x: number, y: number) => {
    let ctx = getContext();
    ctx.beginPath();
    ctx.globalAlpha = 1.0;
    if (mouseX === null || mouseY === null) {
      ctx.moveTo(x, y);
    } else {
      ctx.moveTo(mouseX, mouseY);
    }
    ctx.lineTo(x, y);
    ctx.lineCap = "round";
    ctx.lineWidth = 10;
    ctx.strokeStyle= "#000";
    ctx.stroke();
    mouseX = x;
    mouseY = y;
  }

  function drawTextOnCanvas(text: string) {
    if(!backCanvas) return;
    let ctx = backCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, backCanvas.width, backCanvas.height); // キャンバスをクリア
      
      ctx.font = "140px Arial"; // テキストのフォントとサイズを設定
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // テキストの色と透明度を設定
      // テキストを中央に描画
      ctx.textAlign = "center";
      ctx.textBaseline = "top";
      // ctx.
      ctx.fillText(text, backCanvas.width/2, backCanvas.height/2); // テキストを描画
    }
  }

  const clearCanvas = () => {
    if (canvas) {
      let ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  useImperativeHandle(ref, () => ({clearCanvas}));

  useEffect(() => {
    if (canvas) {
      if (showCanvasText) {(quizNow.answer !== null) ? drawTextOnCanvas(quizNow.answer) : null;}
      else{
        if(backCanvas){
          let ctx = backCanvas.getContext("2d");
         if(ctx) {ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);}}
      }
    }

  }, [showCanvasText, quizNow.answer]);

  useEffect(() => {
    const canvas = canvasRef.current;
    const updateCanvasSize = () => {
      if(canvas){
        const rect = canvas.getBoundingClientRect();
        setCanvasSize({
          width: rect.width,
          height: rect.height,
        });
      };
    };
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);
 
  // const HandingSaveImg = async() => {
  //   let canvas = canvasRef.current;
  //   if (!canvas) return;
  //   let base64 = canvas.toDataURL("image/png");
  //   //Download
  //   // ダウンロード用のリンクを作成
  //   const downloadLink = document.createElement('a');
  //   downloadLink.href = base64;
  //   downloadLink.download = 'image.png'; // ファイル名を指定

  //   // リンクをクリックしてダウンロードを開始
  //   downloadLink.click();
  // }

  const style = {
    minWidth: 64,
    lineHeight: "24px",
    borderRadius: 4,
    border: "none",
    color: "#fff",
    background: "#eee"
  };

  return (
    <>
      <canvas
        onMouseDown={OnClick}
        onMouseMove={OnMove}
        onMouseUp={DrawEnd}
        onMouseLeave={DrawEnd}
        onMouseOut={DrawEnd}
        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        style={{
          backgroundColor: 'transparent',
          position: 'absolute', // 絶対位置
          zIndex: 1, // 上に配置
        }}
    />

    {/* backarea キャンバス */}
    <canvas
      className="backarea"
      ref={backareaCanvasRef}
      // onClick={saveImg}
      style={{
        position: 'absolute', // 絶対位置
        zIndex: 0, // 下に配置
      }}
    />
    </>
  )
});

export default Canvas;
