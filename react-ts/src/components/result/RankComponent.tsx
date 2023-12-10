import { useEffect, useState } from "react";
import { ProfileType } from "../../types/tables";
import { Tooltip } from 'react-tooltip'
import { CountUp } from 'countup.js'
import ProgressBar from './progressBar';


export interface RankCmProps {
    accountData: ProfileType,
    rank: number,
    rankDiff: number,
    next: number,
    nowRankEX: number
}
const getImage = (filePath: string): string => {
    return new URL(`../../assets/${filePath}`, import.meta.url).href;
};

const RankCm = (props : RankCmProps) => {
    const [itemNum, setItemNum] = useState(0);
    const accountData = props.accountData;
    const options = {
        duration: 3,
    };
    let rankdiff = new CountUp('rankDiffNum', props.rankDiff, options);
    let ranks = new CountUp('rankNum', props.rank, options);

    useEffect(() => {
        if (rankdiff) {
            rankdiff.start();
            ranks.start();
        }
        if (accountData) {
            setItemNum(accountData.items);
        }
    }, [accountData, rankdiff]);

    return (
        <div className="rank_comp">
            <div className="rank_box">
                <p>ランク</p>
                <p id="rankNum"></p>
            </div>
            <div className="rankProgress">
                <div className="rankText">次のランクまであと<span id="rankDiffNum"></span></div>
                <div className="progressbar_box">
                    {/* <div className="p-bar rankProgress_bar_inner"></div>
                    <div className="p-bar rankProgress_bar_inner_active" id="progressBar"></div> */}
                    <ProgressBar currentExp={props.nowRankEX} rankDiff={props.rankDiff} nextRankExp={props.next} />
                </div>
            </div>
            <div className="item_box">
                <div 
                data-tooltip-id="bounus-tips"
                data-tooltip-content="初回クリアボーナス! +100"
                data-tooltip-place="bottom"
                //tooltipの常時表示
                data-tooltip-visible="true"
                className="item_row">
                    <img className="itemImg" src={getImage('item.png')} alt="" />
                    <p className="itemText">x</p>
                    <div className="itemText">{itemNum}</div>
                </div>
                <Tooltip id="bounus-tips"/>
            </div>
        </div>
    );
}

export default RankCm;  
