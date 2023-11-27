import { useEffect, useState } from "react";
import { ProfileType } from "../../types/tables";

export interface RankCmProps {
    accountData: ProfileType,
    rank: number,
    rankDiff: number,
}
const getImage = (filePath: string): string => {
    return new URL(`../../assets/${filePath}`, import.meta.url).href;
};

const RankCm = (props : RankCmProps) => {
    const [itemNum, setItemNum] = useState(0);
    const accountData = props.accountData;

    return (
        <div className="rank_comp">
            <div className="rank_box">
                {/* <h3>Rank: {accountData.exp/100}</h3> */}
                <p>ランク</p>
                <p>{props.rank}</p>
            </div>
            <div className="rankProgress">
                <div className="rankText">次のランクマであと{
                    props.rankDiff
                }</div>
                <div className="progressbar_box">
                    <div className="p-bar rankProgress_bar_inner"></div>
                    <div className="p-bar rankProgress_bar_inner_active"></div>
                </div>
            </div>
            <div className="item_box">
                <img className="itemImg" src={getImage('item.png')} alt="" />
                <p className="itemText">x</p>
                <div className="itemText">{itemNum}</div>
            </div>
        </div>
    );
}

export default RankCm;  