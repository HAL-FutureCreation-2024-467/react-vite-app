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
  setChoice : any;
}

const Canvas = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  const quizNow = props.quizNow;
  const showCanvasText = props.ansShow;
  const [canvasSize, setCanvasSize] = useState({ width: 0, height: 0 });
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const backareaCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const canvas = canvasRef.current;
  const backCanvas = backareaCanvasRef.current;
  const [trace, setTrace] = useState<any[]>([]);
  let Xarr = useState<number[]>([]);
  let Yarr = useState<number[]>([]);


  let mouseX: number | null = null;
  let mouseY: number | null = null;

  const getContext = (): CanvasRenderingContext2D => {
    const canvas: any = canvasRef.current;
    return canvas.getContext('2d');
  };

  const OnClick = (e: any) => {
    if (e.button !== 0) { return; }
    const canvas: any = canvasRef.current;
    const rect: IRect = canvas.getBoundingClientRect();
    const x = ~~(e.clientX - rect.left);
    const y = ~~(e.clientY - rect.top);

    Draw(x, y);
  }

  const OnMove = (e: any) => {
    if (e.buttons !== 1) { return; }
    const canvas: any = canvasRef.current;
    const rect: IRect = canvas.getBoundingClientRect();
    const x = (e.clientX - rect.left);
    const y = (e.clientY - rect.top);
    Draw(x, y);
    Xarr.push(x);
    Yarr.push(y);
  }

  const DrawEnd = (e:any) => {
    mouseX = null;
    mouseY = null;
    recognize();
    //
  }

  //touch event
  const onTouchStart = (e: any) => {
    e.preventDefault();
    const rect: IRect = canvas.getBoundingClientRect();
    const x = ~~(e.touches[0].clientX - rect.left);
    const y = ~~(e.touches[0].clientY - rect.top);
    Draw(x, y);
  }

  const onTouchMove = (e: any) => {
    e.preventDefault();
    const rect: IRect = canvas.getBoundingClientRect();
    const x = ~~(e.touches[0].clientX - rect.left);
    const y = ~~(e.touches[0].clientY - rect.top);
    Draw(x, y);
  }

  const onTouchEnd = (e: any) => {
    e.preventDefault();
    mouseX = null;
    mouseY = null;
    recognize();
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
    Xarr.push(x);
    Yarr.push(y);
  }

  function drawTextOnCanvas(text: string) {
    if(!backCanvas) return;
    const ctx = backCanvas.getContext("2d");
    if (ctx) {
      ctx.clearRect(0, 0, backCanvas.width, backCanvas.height); // キャンバスをクリア
      ctx.font = "100px Arial"; // テキストのフォントとサイズを設定
      ctx.fillStyle = "rgba(0, 0, 0, 0.3)"; // テキストの色と透明度を設定
      // テキストを中央に描画
      ctx.textAlign = "center";
      // ctx.
      ctx.fillText(text, backCanvas.width/2, backCanvas.height/1.4); // テキストを描画
    }
  }

  const clearCanvas = () => {
    if (canvas) {
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
      }
    }
    setTrace([[], [], []]);
    Xarr = [];
    Yarr = [];
    setTrace([]);
  };
  
  useImperativeHandle(ref, () => ({clearCanvas, recognize}));

  useEffect(() => {
    if (canvas) {
      if (showCanvasText) {(quizNow.answer !== null) ? drawTextOnCanvas(quizNow.answer) : null;}
      else{if(backCanvas){const ctx = backCanvas.getContext("2d");if(ctx) {ctx.clearRect(0, 0, backCanvas.width, backCanvas.height);}}
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
      }
    };
    updateCanvasSize();

    window.addEventListener('resize', updateCanvasSize);

    return () => {
      window.removeEventListener('resize', updateCanvasSize);
    };
  }, []);

  const recognize = () => { 
  const w = [];
        w.push(Xarr);
        w.push(Yarr);
        w.push([]);
        trace.push(w);
    console.log(trace); 
    const data = JSON.stringify({
      app_version: 0.1,
      api_level: "537.36",
      device: window.navigator.userAgent,
      input_type: 0,
      options: "enable_pre_space",
      requests: [
        {
          writing_guide: {
            writing_area_width: 0,
            writing_area_height: 0,
          },
          ink: trace,
          language: "ja",
        },
      ],
    });
  
    axios
      .post(
        "https://www.google.com.tw/inputtools/request?ime=handwriting&app=mobilesearch&cs=1&oe=UTF-8",
        data,
        {
          headers: { "Content-Type": "application/json" },
        }
      )
      .then(function (response) {
        const result = response.data[1][0][1];
        props.setChoice(result);
      })
      .catch(function (error) {
        console.log(error);
      });
  };

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
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
        // onMouseLeave={DrawEnd}
        // onMouseOut={DrawEnd}

        ref={canvasRef}
        width={canvasSize.width}
        height={canvasSize.height}
        
        style={{
          backgroundColor: 'transparent',
          position: 'absolute', // 絶対位置
          zIndex: 1, // 上に配置
          touchAction: 'pinch-zoom', // タッチ操作を無効にする;
        }}
    />

    {/* backarea キャンバス */}
    <canvas
      className="backarea"
      ref={backareaCanvasRef}
      // onClick={saveImg}
      style={{
        position: 'absolute', // 絶対位置
        zIndex: 0,
         // 下に配置
      }}
    />
    </>
  )
});

export default Canvas;

