import { React, useContext, useEffect, useRef, useState } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";

const Logs = () => {
    let { logs, sendMsg, debug } = useContext(WebSocketContext);

    let [inputValue, setInputValue] = useState("E001");

    const handleBtnClick = () => {
        sendMsg(inputValue);
    };

    const logContainer = useRef();

    useEffect(() => {

        logContainer.current.scrollTop = logContainer.current.scrollHeight;
    },[logs])


    return (
        <>
            <div ref={logContainer} className={`${debug? '': 'hidden'} fixed bottom-0 left-0 w-full bg-black p-4 overflow-auto h-[15rem]`}>
                <div className="sticky top-0">
                    <input
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        className="p-2 bg-slate-900"
                        type="text"
                        placeholder="msg"
                    />
                    <button className="p-2 bg-red-800" onClick={handleBtnClick}>
                        {" "}
                        SEND
                    </button>
                </div>
                <pre>{logs}</pre>
            </div>
        </>
    );
};

export default Logs;
