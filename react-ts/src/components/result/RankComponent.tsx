import { useEffect, useState } from "react";
import { ProfileType } from "../../types/tables";
import { Tooltip } from 'react-tooltip'
import { CountUp } from 'countup.js'


export interface RankCmProps {
    accountData: ProfileType,
    rank: number,
    rankDiff: number,
    next: number,
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

    // let rank = new CountUp('rankNum', props.rank, options);
    let rankdiff = new CountUp('rankDiffNum', props.rankDiff, options);

    useEffect(() => {
        if (rankdiff) {
            rankdiff.start();
            // rank.start();
        }
        if (accountData) {
            setItemNum(accountData.item);
        }
    }, [accountData, rankdiff]);

    return (
        <div className="rank_comp">
            <div className="rank_box">
                {/* <h3>Rank: {accountData.exp/100}</h3> */}
                <p>ランク</p>
                <p id="rankNum">{props.rank}</p>
            </div>
            <div className="rankProgress">
                <div className="rankText">次のランクまであと<span id="rankDiffNum"></span>経験値</div>
                <div className="progressbar_box">
                    <div className="p-bar rankProgress_bar_inner"></div>
                    <div className="p-bar rankProgress_bar_inner_active" id="progressBar"></div>
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
                {/* <Tooltip id="bounus-tips" isOpen/> */}
                <Tooltip id="bounus-tips"/>
            </div>
        </div>
    );
}

export default RankCm;  
