import React, { useRef } from 'react';
import Live2DModule from '../components/Live2D/Live2dModuleTest';

const Test = () => {
    const modelPath = '/Live2dModel/slime/silme.model3.json';
    const modelRutica = '/Live2dModel/rutika/rutika.model3.json';
    const childRef = useRef<any>(null);
    const playRush = () => {childRef.current.rush()};
    const slash = () => {childRef.current ? childRef.current.slash() : null};
    const second = () => {childRef.current ? childRef.current.second() : null};
    const three = () => {childRef.current ? childRef.current.three() : null};
    const final = () => {childRef.current ? childRef.current.final() : null};

    
    return (
        <>
            <div className='App'>
                <Live2DModule ref={childRef} modelPath={modelRutica as string} />
                <button onClick={slash} value={1}>motion1</button>
                <button onClick={second} value={2}>motion2</button>
                <button onClick={three} value={3}>motion3</button>
                <button onClick={final} value={4}>motion4</button>
            </div>
        </>
    )
}

export default Test;