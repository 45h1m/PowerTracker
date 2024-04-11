import { createContext, useEffect, useState } from "react";

export const WebSocketContext = createContext(null);

const host = "powertracker-production.up.railway.app";
// const host = '192.168.131.186';

let socket = null;

export const WebSocketProvider = (props) => {
    let [socketState, setSocketState] = useState("Connecting..");
    let [logs, setLogs] = useState("::::LOGS::::\n");
    let [debug, setDebug] = useState(false);
    let [currentData, setCurrentData] = useState(false);
    let [realtimeBuffer, setRealtimeBuffer] = useState([]);

    useEffect(() => {
        connectSocket();
    }, []);

    const connectSocket = () => {
        const address = "wss:/" + "/" + host + ":443";
        log(">>>>github/45h1m<<<<");
        log("Trying to connect socket");
        log(address);

        socket = new WebSocket(address);

        socket.onopen = (e) => {
            setSocketState("Connected");
            log("[socket] openned ");
        };
        socket.onclose = (e) => {
            setSocketState("Disconnected");
            socket.close();
            log("[socket] closed");
        };
        socket.onerror = (e) => {
            log("[socket] error: " + e);
            socket.close();
        };

        socket.onmessage = (e) => {
            // log("[SERVER]: "+ e.data)

            if (e.data.match("realtimeBuffer")) {
                // setRealtimeData(JSON.parse(e.data).realtimeBuffer)
            } else if (e.data.match("update")) {
                const data = JSON.parse(e.data);
                setCurrentData(data);

                setRealtimeBuffer((prev) => {
                    if (prev.length >= 10) prev.shift();
                    return [...prev, data];
                });
            }
        };
    };

    const sendMsg = (msg) => {
        socket.send(msg);
        log("sent: " + msg);
    };

    const log = (msg) => {
        console.log(msg);
        setLogs((prev) => (prev += "\n" + msg));
    };

    return (
        <WebSocketContext.Provider
            value={{
                socket,
                socketState,
                setSocketState,
                connectSocket,
                logs,
                setLogs,
                sendMsg,
                debug,
                setDebug,
                log,
                currentData,
                realtimeBuffer,
            }}
        >
            {props.children}
        </WebSocketContext.Provider>
    );
};
