import React, { forwardRef, useEffect, useRef, useImperativeHandle, useState } from "react";
//assets内のファイルを読み込むためのモジュール
import * as PIXI from "pixi.js";
import { Live2DModel } from 'pixi-live2d-display';

import '@scss/Live2D.scss';

interface CanvasProps {
    modelPath: string;
  }
  
const Live2d = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  const live2dRef = useRef<HTMLCanvasElement>(null);
  const live2dwrapRef = useRef<HTMLDivElement>(null);
  const [live2DInitialized, setLive2DInitialized] = useState(false);
  let app: PIXI.Application<PIXI.ICanvas>;
  let currentModel: Live2DModel;
  const ModelPath = '/Live2dModel/rutika/rutika.model3.json';

  useEffect(() => {
    const main = async () => {
      app = new PIXI.Application({
        view: live2dRef.current!,
        autoStart: true,
        backgroundAlpha: 0,
        resizeTo: window,
      });
      setLive2DInitialized(true);
      app.stage.interactive = false;
      // Live2Dモデルの初期化
      currentModel = await Live2DModel.from(ModelPath, { autoInteract: false });

      // モデルの初期化
      if (window.innerWidth < 768) {
        currentModel.scale.set(0.4); //モデルの大きさ★
      } else {
        currentModel.scale.set(0.6); //モデルの大きさ★
      }
      currentModel.anchor.set(0.5, 0.5); //モデルのアンカー★
      // Live2Dモデルを配置
      app.stage.addChild(currentModel);

      // ウィンドウのリサイズイベントに対応
      const handleResize = () => {
        const parent = live2dwrapRef.current!;
        const canvas = live2dRef.current!;
        const ratio = window.devicePixelRatio;
      
        canvas.width = parent.clientWidth * ratio;
        canvas.height = parent.clientHeight * ratio;
        canvas.style.width = parent.clientWidth + "px";
        canvas.style.height = parent.clientHeight + "px";
        // Resize the renderer
        app.renderer.resize(canvas.width, canvas.height);
      
        // Set the position after the renderer is resized
        currentModel.position.set(app.renderer.width / 2, app.renderer.height / 2);
      };

      window.addEventListener("resize", handleResize);
      handleResize();

      // Cleanup function
      return () => {
          window.removeEventListener("resize", handleResize);
      };
    };

    main();
  }, []);

    const slash = () => {
      if (live2DInitialized) {
        // 既にLive2Dが初期化されている場合のみ関数を実行
        app.stage.children[0].internalModel.motionManager.startMotion("RushCharge",0,2);
      } else {
        // Live2Dが初期化されていない場合は何もしない
        console.error("Live2Dが初期化されていません");
      }
    };
    const second = () => {
      if (live2DInitialized) {
        app.stage.children[0].internalModel.motionManager.startMotion("Idle",0,2);
      } else {
        // Live2Dが初期化されていない場合は何もしない
        console.error("Live2Dが初期化されていません");
      }
    };
    const three = () => {
      if (live2DInitialized) {
        app.stage.children[0].internalModel.motionManager.startMotion("Three",0,2);
      } else {
        // Live2Dが初期化されていない場合は何もしない
        console.error("Live2Dが初期化されていません");
      }
    };
    const final = () => {
      if (live2DInitialized) {
        app.stage.children[0].internalModel.motionManager.startMotion("Final",0,2);
      } else {
        // Live2Dが初期化されていない場合は何もしない
        console.error("Live2Dが初期化されていません");
      }
    };
    
    // 親コンポーネントが呼び出せるようにする
    useImperativeHandle(ref, () => ({slash,second,three,final}));
    return (
        <>
        <div id="live2d_box" className="live2d-canvas-wrap" ref={live2dwrapRef}>
            <canvas className="my-live2d" ref={live2dRef}></canvas>
        </div>
        </>
    );
});

export default Live2d;
