import { useEffect, useRef, useState } from 'react';
import RentFeeModal from './RentFeeModal';
import { Title, Event, Product, OfflineReportType } from '../../type/types';
import { useSelector } from 'react-redux';
import TitleChangeModal from './TitleChangeModal';
import { Client } from '@stomp/stompjs';

//dummy data(test 후 비활성화 필요)
import Off from '../../dummy-data/report/offline.json';

interface Prop {
    titleList: Title[];
    eventList: Event[];
    productList: Product[];
    setIsOffReportAvail: React.Dispatch<React.SetStateAction<boolean>>;
    webSocketId: string;
    webSocketClient: Client;
    offReport: OfflineReportType;
    setStartFlag: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function OffReportModal(props: Prop) {
    const [mode, setMode] = useState<number>(0);
    const [year, setYear] = useState<number>(0);
    const [season, setSeason] = useState<string>('봄');
    const [eventDescription, setEventDescription] = useState<string>('');
    const [cropName, setCropName] = useState<string>('');
    const [cropSeason, setCropSeason] = useState<string>('');

    const eventDescRef = useRef<HTMLDivElement>(null);
    const cropDescRef = useRef<HTMLDivElement>(null);

    //test 종료 후 이거 풀어
    // const Off = props.qtrReport;

    /**이벤트 이미지 호버링하면 출력 */
    const hoverEventImg = (eventId: number) => {
        setEventDescription(eventId + '이벤트 발동');
        if (eventDescRef.current) {
            eventDescRef.current.style.opacity = '100';
            eventDescRef.current.style.transition = 'linear 0.5s';
            eventDescRef.current.style.zIndex = '30';
        }
    };

    /**이벤트 이미지 호버링 끝나면 출력 */
    const endHoverEvent = () => {
        if (eventDescRef.current) {
            eventDescRef.current.style.opacity = '0';
            eventDescRef.current.style.transition = 'linear 0.5s';
            eventDescRef.current.style.zIndex = '-20';
        }
    };

    /**작물 이미지 호버링 시 출력 */
    const hoverCropImg = (cropId: number) => {
        const crop: Product = props.productList[cropId - 1];
        setCropName(crop.productName);
        switch (crop.productType) {
            case 'SPRING':
                setCropSeason('봄');
                break;
            case 'SUMMER':
                setCropSeason('여름');
                break;
            case 'FALL':
                setCropSeason('가을');
                break;
            case 'WINTER':
                setCropSeason('겨울');
                break;
            case 'ALL':
                setCropSeason('연중 내내');
                break;
        }
        if (cropDescRef.current) {
            cropDescRef.current.style.opacity = '100';
            cropDescRef.current.style.transition = 'linear 0.5s';
            cropDescRef.current.style.zIndex = '30';
        }
    };

    /**작물 이미지 호버링 끝나면 출력 */
    const endHoverCrop = () => {
        if (cropDescRef.current) {
            cropDescRef.current.style.opacity = '0';
            cropDescRef.current.style.transition = 'linear 0.5s';
            cropDescRef.current.style.zIndex = '-20';
        }
    };

    //title 가져오기
    const titleId = useSelector(
        (state: any) => state.reduxFlag.myProfileSlice.title
    );

    /**rentFeeModal에서 확인 누르면 보고서 보여지도록 만들기 */
    const showReport = () => {
        setMode(1);
    };

    useEffect(() => {
        /**날짜 계산 */
        const turn = Off.lastGameTurn - 91;
        setYear(Math.floor((turn + 60) / 360));
        const month: number = ((Math.floor(turn / 30) + 2) % 12) + 1;
        if (month === 3) {
            setSeason('봄');
        } else if (month === 6) {
            setSeason('여름');
        } else if (month === 9) {
            setSeason('가을');
        } else {
            setSeason('겨울');
        }
    }, []);

    /**파산 시 게임 종료 */
    const endGame = () => {
        const webSocketId = props.webSocketId;
        const client = props.webSocketClient;

        //게임 포기 요청 보내기(webSocket)
        client.publish({
            destination: `/app/private/${webSocketId}`,
            body: JSON.stringify({
                type: 'GIVEUP_GAME',
                body: {},
            }),
        });

        //웹소켓 통신 비활성화
        client.publish({
            destination: `/app/private/${webSocketId}`,
            body: JSON.stringify({
                type: 'QUIT_GAME',
                body: {},
            }),
        });
        client.deactivate();

        //메인 화면으로 나가기
        props.setStartFlag(false);
    };

    return (
        <>
            <div className="absolute w-full h-full top-0 left-0 bg-black opacity-50 z-10 "></div>
            {mode === 0 ? (
                <RentFeeModal
                    rentFeeInfo={Off.rentFeeInfo}
                    startTurn={Off.lastGameTurn - 91}
                    endTurn={Off.lastGameTurn - 1}
                    showReport={showReport}
                    productList={props.productList}
                    endGame={endGame}
                />
            ) : mode === 1 ? (
                <>
                    <div className="w-[60%] h-[60%] absolute left-[20%] top-[20%] color-border-subbold border-[0.5vw] bg-white z-20 flex items-center color-text-subbold">
                        <div className="w-[50%] h-full flex flex-col items-center justify-between">
                            {/* 결산부분 */}
                            <div className="w-full h-[60%] flex flex-col items-center">
                                <div className="pt-[1vh] text-[3vw]">
                                    계절 결산
                                </div>
                                <div className="w-[90%] h-[0.1vh] color-bg-subbold"></div>
                                <div className="text-[2vw]">
                                    {year}년차 {season}
                                </div>
                                <div className="flex flex-col w-[90%] h-full">
                                    <div className="w-full flex justify-between text-[2vw]">
                                        <span className="text-left">
                                            순이익
                                        </span>
                                        <span className="text-right">
                                            {Off.quarterReport.quarterProfit.toLocaleString()}
                                        </span>
                                    </div>
                                    <div className="w-full flex justify-between text-[2vw]">
                                        <span className="text-left">
                                            임대료
                                        </span>
                                        <span className="text-right">
                                            {(
                                                -1 * Off.rentFeeInfo.rentFee
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                                <div className="w-[90%]">
                                    <div className="w-full flex justify-between text-[2vw]">
                                        <span className="text-left">
                                            당기 순이익
                                        </span>
                                        <span className="text-right">
                                            {(
                                                Off.quarterReport.quarterProfit - Off.rentFeeInfo.rentFee
                                            ).toLocaleString()}
                                        </span>
                                    </div>
                                </div>
                            </div>
                            <div className="w-[90%] h-[0.2vh] color-bg-subbold"></div>
                            {/* 현재칭호 */}
                            <div className="w-full h-[40%] flex flex-col items-center">
                                <p className="w-[90%] h-[30%] text-left text-[2vw]">
                                    현재 칭호
                                </p>
                                <div className="w-[90%] h-[70%] pb-[1vh] flex justify-between items-center">
                                    <div className="w-[80%] h-full flex justify-start items-center">
                                        <img
                                            className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover"
                                            src={`/src/assets/images/title/title(1).png`}
                                        ></img>
                                        <div className="text-[1.5vw]">
                                            {
                                                props.titleList[titleId - 1]
                                                    .titleName
                                            }
                                        </div>
                                    </div>
                                    <div
                                        className="border-[0.5vw] w-[20%] h-[40%] text-[1.5vw] color-border-subbold text-center cursor-pointer"
                                        style={{ padding: 'auto' }}
                                        onClick={() => {
                                            setMode(2);
                                        }}
                                    >
                                        변경
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="w-[0.2vw] h-[90%] color-bg-subbold"></div>
                        <div className="w-[50%] h-full flex flex-col">
                            <div className="w-full h-[10%] ml-[1vw] mt-[1vh]">
                                <div className="text-[2vw] text-left">
                                    {`다음 계절 : `}
                                    {season === '봄'
                                        ? `${year}년차 여름`
                                        : season === '여름'
                                        ? `${year}년차 가을`
                                        : season === '가을'
                                        ? `${year}년차 겨울`
                                        : `${year + 1}년차 봄`}
                                </div>
                            </div>
                            {/* 이벤트 요소 */}
                            <div className="relative w-[90%] h-[30%] ml-[1vw] my-[2vh]">
                                <p className="text-[1.5vw] text-left ml-[1vw]">
                                    계절 이벤트
                                </p>
                                <div
                                    className="overflow-x-auto"
                                    style={{ scrollbarWidth: 'thin' }}
                                >
                                    <div className="flex flex-shrink-0">
                                        <img
                                            className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex-shrink-0"
                                            src={`/src/assets/images/title/title(${titleId}).png`}
                                            onMouseOver={() => hoverEventImg(1)}
                                            onMouseLeave={endHoverEvent}
                                        ></img>
                                        <img
                                            className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex-shrink-0"
                                            src={`/src/assets/images/title/title(${titleId}).png`}
                                            onMouseOver={() => hoverEventImg(2)}
                                            onMouseLeave={endHoverEvent}
                                        ></img>
                                        <img
                                            className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex-shrink-0"
                                            src={`/src/assets/images/title/title(${titleId}).png`}
                                            onMouseOver={() => hoverEventImg(3)}
                                            onMouseLeave={endHoverEvent}
                                        ></img>
                                        <img
                                            className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex-shrink-0"
                                            src={`/src/assets/images/title/title(${titleId}).png`}
                                            onMouseOver={() => hoverEventImg(4)}
                                            onMouseLeave={endHoverEvent}
                                        ></img>
                                        <img
                                            className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex-shrink-0"
                                            src={`/src/assets/images/title/title(${titleId}).png`}
                                            onMouseOver={() => hoverEventImg(5)}
                                            onMouseLeave={endHoverEvent}
                                        ></img>
                                        <div
                                            className="absolute w-full h-[10vw] top-[10vw] bg-black opacity-0 text-white -z-20"
                                            ref={eventDescRef}
                                        >
                                            {eventDescription}
                                        </div>
                                    </div>
                                </div>
                            </div>
                            {/* 작물 요소 */}
                            <div className="relative w-[90%] h-[60%] ml-[1vw] mt-[1vh]">
                                <p className="text-[1.5vw] text-left ml-[1vw]">
                                    구매 가능 작물
                                </p>
                                <div
                                    className="overflow-x-auto"
                                    style={{ scrollbarWidth: 'thin' }}
                                >
                                    <div className="flex flex-shrink-0">
                                        {Off.quarterReport.inProductList.map((cropId) => {
                                            return (
                                                <img
                                                    className="w-[6vw] h-[6vw] m-[1vw] aspect-square object-cover flex-shrink-0"
                                                    src={`/src/assets/images/product/crop (${cropId}).png`}
                                                    onMouseOver={() =>
                                                        hoverCropImg(cropId)
                                                    }
                                                    onMouseLeave={endHoverCrop}
                                                ></img>
                                            );
                                        })}
                                        <div
                                            className="absolute w-full h-[5.5vw] top-[10vw] px-[1vw] bg-black opacity-0 text-white -z-20"
                                            ref={cropDescRef}
                                        >
                                            <p className="w-full text-left text-[2vw]">
                                                {cropName}
                                            </p>
                                            <p className="w-full text-left text-[1.5vw]">{`제철 : ${cropSeason}`}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* x버튼 */}
                        <div
                            className="absolute text-[2vw] flex items-center justify-center text-white -top-[1.6vw] -right-[2vw] w-[4vw] h-[4vw] border-[0.4vw] color-border-sublight color-bg-orange1 rounded-full cursor-pointer z-30"
                            onClick={() => {
                                props.setIsOffReportAvail(false);
                            }}
                        >
                            X
                        </div>
                    </div>
                </>
            ) : (
                <TitleChangeModal
                    setMode={setMode}
                    titleList={props.titleList}
                    webSocketId={props.webSocketId}
                    webSocketClient={props.webSocketClient}
                />
            )}
        </>
    );
}
