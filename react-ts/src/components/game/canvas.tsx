import React, { useRef, useEffect, useState, useImperativeHandle, forwardRef } from "react";
import axios from 'axios';

const url = 'https://inputtools.google.com/request?itc=ja-t-i0-handwrit';

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
  width: number;
  height: number;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  const quizNow = props.quizNow;
  const showCanvasText = props.ansShow;
  const width = props.width;
  const height = props.height;
  let canvasRef = useRef<HTMLCanvasElement | null>(null);
  let mouseX: number | null = null;
  let mouseY: number | null = null;

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const OnClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.button !== 0) { return; }
    const canvas: any = canvasRef.current;
    const rect: IRect = canvas.getBoundingClientRect();
    const x = ~~(e.clientX - rect.left);
    const y = ~~(e.clientY - rect.top);
    Draw(x, y);
  }

  const OnMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (e.buttons !== 1) { return; }
    const canvas: any = canvasRef.current;
    const rect: IRect = canvas.getBoundingClientRect();
    const x = ~~(e.clientX - rect.left);
    const y = ~~(e.clientY - rect.top);
    Draw(x, y);
  }

  const DrawEnd = (e: React.MouseEvent<HTMLCanvasElement>) => {
    mouseX = null;
    mouseY = null;
    //
  }

  const Draw = (x: number, y: number) => {
    const ctx = getContext();
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

  
  function drawTextOnCanvas(text: string, canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, canvas.width, canvas.height); // キャンバスをクリア

      ctx.font = "140px Arial"; // テキストのフォントとサイズを設定
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // テキストの色と透明度を設定
      // テキストを中央に描画
      ctx.textAlign = "center";
      ctx.textBaseline = "middle";
      ctx.fillText(text, canvas.width / 2, canvas.height / 2); // テキストを描画
    }
  }

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
  };
  
  useImperativeHandle(ref, () => ({clearCanvas}));

  useEffect(() => {
    let canvas = canvasRef.current;
    if (canvas) {
      if (showCanvasText) {(quizNow.answer !== null) ? drawTextOnCanvas(quizNow.answer, canvas) : null;}else{const ctx = canvas.getContext("2d");if (ctx) {ctx.clearRect(0, 0, canvas.width, canvas.height);}}
    }
  }, [showCanvasText, quizNow.answer]);

  const getPredict = () => {
    var data = {
      app_version: 0.1,
      device: window.navigator.userAgent,
      input_type: 0,
      options: 'enable_pre_space',
      requests: {
          pre_context: '',
          max_num_results: 6,
          max_completions: 0,
          ink: []
        },
    };

    const handwriting = { trace: [] }; // Define the variable 'handwriting'
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext("2d",{ willReadFrequently: true });
      if (ctx) {
        const imageData = ctx.getImageData(0, 0, width, height);
        const pixelArray = imageData.data;
        const pixels = [];
        for (let i = 0; i < pixelArray.length; i += 4) {
          const r = pixelArray[i];
          const g = pixelArray[i + 1];
          const b = pixelArray[i + 2];
          const a = pixelArray[i + 3];
          pixels.push([r, g, b, a]);
        }
        handwriting.trace.push(pixels as never); // explicitly annotate the type of the array
        data.requests.ink = handwriting.trace;
      }
    }

    
    axios
      .post(url,JSON.stringify(data), {
        headers: {
          "Content-Type": "application/json",
        },
      })
      .then((response) => {
        // 成功時のコールバック関数
        console.log(response.data[1][0][1]);
        return response;
      })
      .catch((error) => {
        console.error("エラー:", error);
      });
  }

  const style = {
    minWidth: 64,
    lineHeight: "32px",
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
        onMouseOut={DrawEnd}
        onClick={getPredict}
        ref={canvasRef}
        width={`${width}px`}
        height={`${height}px`}
    
        />
    </>
  )
});

export default Canvas;
