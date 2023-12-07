import React, { forwardRef, useEffect, useRef, useImperativeHandle } from "react";
//assets内のファイルを読み込むためのモジュール
import { Live2DModel } from 'pixi-live2d-display';
import * as PIXI from "pixi.js";
import '@scss/Live2D.scss';

interface CanvasProps {
    modelPath: string;
  }

const Live2d = forwardRef<HTMLCanvasElement, CanvasProps>((props, ref) => {
  const live2dRef = useRef<HTMLCanvasElement>(null);
  const live2dwrapRef = useRef<HTMLDivElement>(null);
  let app: PIXI.Application<PIXI.ICanvas>;
  let currentModel: Live2DModel;
  const ModelPath = props.modelPath;

  useEffect(() => {
    const main = async () => {
      // PixiJSの初期化 インスタンス生成
      app = new PIXI.Application({
        view: live2dRef.current!,
        transparent: true,
        autoStart: true,
        backgroundAlpha: 0,
        resizeTo: window,
      });

      // Live2Dモデルの初期化
      currentModel = await Live2DModel.from(ModelPath, { autoInteract: false });    

      // モデルの初期化
      currentModel.scale.set(0.4); // モデルの大きさ
      currentModel.anchor.set(0.5, 0.5); // モデルのアンカー位置
      
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
  }, [ModelPath]);

    const slash = () => {app.stage.children[0].internalModel.motionManager.startMotion("Slash",0,2);};
    const second = () => {app.stage.children[0].internalModel.motionManager.startMotion("Second",0,2);};
    const three = () => {app.stage.children[0].internalModel.motionManager.startMotion("Three",0,2);};
    const final = () => {app.stage.children[0].internalModel.motionManager.startMotion("Final",0,2);};
    // 親コンポーネントが呼び出せるようにする
    useImperativeHandle(ref, () => ({
      slash,
      second,
      three,
      final,
      ...live2dRef.current
    }), [slash, second, three, final, live2dRef]);
    return (
        <>
        <div className="live2d-canvas-wrap" ref={live2dwrapRef}>
            <canvas className="my-live2d" ref={live2dRef}></canvas>
        </div>
        </>
    );
});

export default Live2d;
