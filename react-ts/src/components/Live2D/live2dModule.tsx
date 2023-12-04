import React, { useEffect, useRef } from 'react';
import '@assets/js/live2dcubismcore.js';

import * as PIXI from 'pixi.js';
import { Live2DModel, Live2DModelOptions } from 'pixi-live2d-display';

const Live2DComponent = () => {
  const pixiContainerRef = useRef<HTMLDivElement>(null);
  const appRef = useRef<PIXI.Application | null>(null);

  useEffect(() => {
    
    const pixiContainer = pixiContainerRef.current;
    if (!pixiContainer) return;

    const app = new PIXI.Application({
      width: 800,
      height: 600,
      view: pixiContainer,
    });

    appRef.current = app;

    const live2dModelOptions: Live2DModelOptions = {
      moc: '@assets/rutika-model/runtime/rutika.moc3',
      textures: ['@assets/rutika-model/runtime/rutika.4096/texture_00.png'],
    };

    const live2dModel = new Live2DModel(live2dModelOptions);

    app.stage.addChild(live2dModel);

    // アニメーションの開始
    // live2dModel.startRandomMotion('Idle');
    live2dModel.motion('Idle');

    return () => {
      app.stage.removeChild(live2dModel);
      live2dModel.destroy();
      app.destroy();
    };
  }, []);

  return (
    <div>
      <div ref={pixiContainerRef} />
    </div>
    
  );
};

export default Live2DComponent;
