const HomeModal = (props :any) => {
    return(
        <>
            <div className="home-modal">
                <div className="c-card">
                    <div className="c-card_contents">
                        <h2 className="c-card_title">
                            <p className="c-card_p">タイトル</p>
                        </h2>
                        <p className="c-card__text">本文</p>
                        <ul className="c-card_info">
                            <li className="c-card_info-item">
                                <time datetime="2021-01-01">2021.01.01</time>
                            </li>
                            <li className="c-card_info-item">
                                <p>HTMLカテゴリ</p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </>
    )
}

export default HomeModal