import '@css/menu.css';
import Live2DModule from '../components/Live2D/Live2dModuleTest';

const Test = () => {
    const modelPath = '/assets/rutika-model/runtime/rutika.model3.json';

    const playAnimation = () => {
        // アニメーション再生のための処理を追加
    };

    return(
        <>
            <div>
                <Live2DModule modelPath={{modelPath}}/>
            </div>
        </>
    )
}

export default Test;