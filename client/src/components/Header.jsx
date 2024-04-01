import { React, useContext } from "react";
import { WebSocketContext } from "../contexts/WebSocketContext";

const CheckSVG = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" viewBox="0 0 16 16">
        <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z" />
    </svg>
);

const Header = () => {
    let { socketState, setSocketState, connectSocket, setDebug, debug } = useContext(WebSocketContext);

    const handleStatusClick = () => {
        if (socketState === "Disconnected") {
            setSocketState("Connecting..");
            connectSocket();
        }
    };

    return (
        <header className="flex sticky z-10 bg-slate-900 top-0 w-full max-w-4xl mx-auto justify-between items-center py-8 px-4">
            <div
                className="logo flex"
                onContextMenu={(e) => {
                    e.preventDefault();
                    setDebug(!debug);
                }}
            >
                <CheckSVG />
                <h3 className="text-xl font-bold uppercase tracking-wider">
                    <span className="text-red-500">Power </span>Tracker
                </h3>
            </div>

            <div className="right">
                <div onClick={handleStatusClick} className="status flex items-center gap-2 bg-slate-800 p-1 rounded-lg pr-2">
                    <div className="indicator w-10 rounded-lg aspect-square bg-slate-900 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="orange" viewBox="0 0 16 16">
                            <path d="M5.52.359A.5.5 0 0 1 6 0h4a.5.5 0 0 1 .474.658L8.694 6H12.5a.5.5 0 0 1 .395.807l-7 9a.5.5 0 0 1-.873-.454L6.823 9.5H3.5a.5.5 0 0 1-.48-.641z" />
                        </svg>
                    </div>
                    <div className="status-text text-slate-400">
                        <p className={`text-${socketState === 'Connected'? 'green':'slate'}-400`}>{socketState}</p>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
