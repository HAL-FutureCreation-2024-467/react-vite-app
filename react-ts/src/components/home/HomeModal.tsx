import { useState } from "react";

const HomeModal = (props :any) => {
    const [buttonType, setButtonType] = useState<boolean>(true);
    return(
        <>
            <div className="home-modal">
                <div className="c-card">
                    <div className="c-card_contents">
                        <h2 className="c-card_title">
                            <p className="c-card_p">タイトル</p>
                        </h2>
                        <p className="c-card_text">{props?.content}</p>
                        <div className="c-card_btn">
                            {buttonType ? (
                                <>
                                    <button onClick={() => setButtonType(false)}>ボタン</button>
                                    <button onClick={() => setButtonType(false)}>aaa</button>
                                </>
                            ) : (
                                <>
                                    <button>閉じる</button>
                                </>
                            )
                            }
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeModal