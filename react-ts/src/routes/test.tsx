import React, { useRef } from 'react';
import Live2DModule from '../components/Live2D/Live2dModuleTest';

const Test = () => {
    const modelPath = '/Live2dModel/slime/silme.model3.json';
    const modelRutica = '/Live2dModel/rutika/rutika.model3.json';
    const childRef = useRef<any>(null);
    const playRush = () => {childRef.current ? childRef.current.rush() : null};
    const slash = () => {childRef.current ? childRef.current.slash() : null};
    const second = () => {childRef.current ? childRef.current.second() : null};
    const three = () => {childRef.current ? childRef.current.three() : null};
    const final = () => {childRef.current ? childRef.current.final() : null};

    
    return (
        <>
            <div className='App'>
                <Live2DModule ref={childRef} modelPath={modelPath as string} />
                {/* <Live2DModule ref={childRef} modelPath={modelRutica as string} /> */}
                <button onClick={slash}>motion1</button>
                <button onClick={second}>motion2</button>
                <button onClick={three}>motion3</button>
                <button onClick={final}>motion4</button>
                <button onClick={playRush}>Rush</button>
            </div>
        </>
    )
}

export default Test;