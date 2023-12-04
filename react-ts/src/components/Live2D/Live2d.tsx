import React, { useEffect, useRef } from "react";
import "@assets/js/live2d.min.js";
import "@assets/js/live2dcubismcore.js";
import { Live2DModel } from "pixi-live2d-display";
import * as PIXI from "pixi.js";
import "kalidokit";


const Live2d = ({}) => {
  // appをindex.jsで使いたいのでスコープを外しています。
    const live2dRef = useRef(null);
    const live2dwrapRef = useRef(null);

    // PixiJS
    let app: PIXI.Application | null = null;

    // 1, Live2Dモデルへのパスを指定する
    const modelUrl = "@assets/rutika-model/runtime/rutika.model3.json";
    let currentModel:  | null = null;

    // メインの処理開始
    useEffect(() => {
      (async function main() {
        // 2, PixiJSを準備する
        app = new PIXI.Application({
          view: live2dRef.current,
          transparent: true,
          autoStart: true,
          backgroundAlpha: 0,
          resizeTo: window,
        });

        // 3, Live2Dモデルをロードする
        currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
        if (window.innerWidth < 768) {
          currentModel.scale.set(0.8); //モデルの大きさ★
          currentModel.anchor.set(0.5, 0.5); //モデルのアンカー★
        } else {
          //pc
          currentModel.scale.set(0.57); //モデルの大きさ★
          currentModel.anchor.set(0.5, 0.5); //モデルのアンカー★
        }
        currentModel.interactive = true;

        // 6, Live2Dモデルを配置する
        app.stage.addChild(currentModel);

        function handleResize() {
          const parent = live2dwrapRef.current;
          const canvas = live2dRef.current;
          const ratio = window.devicePixelRatio;
          canvas.width = parent.clientWidth * ratio;
          canvas.height = parent.clientHeight * ratio;
          canvas.style.width = parent.clientWidth + "px";
          canvas.style.height = parent.clientHeight + "px";

          currentModel.position.set(app.view.width / 2, app.view.height / 2); //モデルの位置★

          // PixiJSのrendererにcanvasのサイズを更新する
          app.renderer.resize(canvas.width, canvas.height);
        }

        window.addEventListener("resize", handleResize);
        handleResize();
      })();
    }, [live2dRef]);

    // メインの処理開始
    useEffect(() => {
      (async function main() {
        // 2, PixiJSを準備する
        app = new PIXI.Application({
          view: live2dRef.current,
          transparent: true,
          autoStart: true,
          backgroundAlpha: 0,
          resizeTo: window,
        });

        // 3, Live2Dモデルをロードする
        currentModel = await Live2DModel.from(modelUrl, { autoInteract: false });
        if (window.innerWidth < 768) {
          currentModel.scale.set(0.8); //モデルの大きさ★
          currentModel.anchor.set(0.5, 0.5); //モデルのアンカー★
        } else {
          //pc
          currentModel.scale.set(0.57); //モデルの大きさ★
          currentModel.anchor.set(0.5, 0.5); //モデルのアンカー★
        }
        currentModel.interactive = true;

        // 6, Live2Dモデルを配置する
        app.stage.addChild(currentModel);

        function handleResize() {
          const parent = live2dwrapRef.current;
          const canvas = live2dRef.current;
          const ratio = window.devicePixelRatio;
          canvas.width = parent.clientWidth * ratio;
          canvas.height = parent.clientHeight * ratio;
          canvas.style.width = parent.clientWidth + "px";
          canvas.style.height = parent.clientHeight + "px";

          currentModel.position.set(app.view.width / 2, app.view.height / 2); //モデルの位置★

          // PixiJSのrendererにcanvasのサイズを更新する
          app.renderer.resize(canvas.width, canvas.height);
        }

        window.addEventListener("resize", handleResize);
        handleResize();
      })();
    }, [live2dRef]);

    const slash = () => {
      app?.stage.children[0].internalModel.motionManager.startMotion(
        "Slash",
        0,
        2
      );
    };
    const second = () => {
      app?.stage.children[0].internalModel.motionManager.startMotion(
        "Second",
        0,
        2
      );
    };
    const three = () => {
      app?.stage.children[0].internalModel.motionManager.startMotion(
        "Three",
        0,
        2
      );
    };
    const final = () => {
      app?.stage.children[0].internalModel.motionManager.startMotion(
        "Final",
        0,
        2
      );
    };

    return (
      <>
        <div className="live2d-canvas-wrap" ref={live2dwrapRef}>
          <canvas className="my-live2d" ref={live2dRef}></canvas>
        </div>
      </>
    );
  };

  export default Live2d;