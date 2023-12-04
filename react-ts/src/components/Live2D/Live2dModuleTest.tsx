import { Application } from '@pixi/app';
import { Ticker, TickerPlugin } from '@pixi/ticker';
import { InteractionManager } from '@pixi/interaction';
import { Live2DModel } from 'pixi-live2d-display';
import { Renderer } from 'pixi.js';

// register Ticker for Live2DModel
Live2DModel.registerTicker(Ticker);

// register Ticker for Application
Application.registerPlugin(TickerPlugin);

// register InteractionManager to make Live2D models interactive
Renderer.registerPlugin('interaction', InteractionManager);

const live2dModule = async(modelPath : string) => {
    const app = new Application({
        view: document.getElementById('live2d'),
    });

    const model = await Live2DModel.from(modelPath);

    app.stage.addChild(model);
    model.motion('idle');
    return (
        <>
            <div id="live2d"></div>
        </>
    )
}

export default live2dModule;