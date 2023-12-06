import React, { useRef } from 'react';
import Live2DModule from '../components/Live2D/Live2d-slime';

const Test = () => {
    const modelPath = '/Live2dModel/slime/silme.model3.json';
    const childRef = useRef<any>(null);
    const playRush = () => {childRef.current ? childRef.current.rush() : null};
    const playSecond = () => {childRef.current ? childRef.current.second() : null};
    const playThree = () => {childRef.current ? childRef.current.three() : null};
    const playFinal = () => {childRef.current ? childRef.current.final() : null};

    
    return (
        <>
            <div className='App'>
                <Live2DModule ref={childRef} modelPath={modelPath as string} />
                <button onClick={playRush} value={1}>motion1</button>
                <button onClick={playSecond} value={2}>motion2</button>
                <button onClick={playThree} value={3}>motion3</button>
                <button onClick={playFinal} value={4}>motion4</button>
            </div>
        </>
    )
}

export default Test;