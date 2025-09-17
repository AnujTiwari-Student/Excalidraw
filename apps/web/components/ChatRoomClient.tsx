"use client";

import { useEffect, useState } from "react";
import { useSocket } from "../hooks/useSocket";

export function ChatRoomClient({
    messages,
    id
}: {
    messages: { message: string}[],
    id: string
}){
    const [chats, setChats] = useState(messages)
    const [currentMsg, setCurrentMsg] = useState("")
    const {socket, loading} = useSocket();

    useEffect(()=> {
        if(socket && !loading){

            socket.send(JSON.stringify({
                type: "join_room",
                roomId: id
            }))

            socket.onmessage = (event) => {
                const parsedData = JSON.parse(event.data)
                if(parsedData.type === "chat"){
                    setChats(c => [...c, {message: parsedData.msg}])
                }
            }
        }
    }, [socket, loading, id])

    return <>
        {messages.map(m => <div>{m.message}</div>)}

        <input type="text" value={currentMsg} onChange={(e) => setCurrentMsg(e.target.value)}>

        </input>

        <button onClick={() => {
            socket?.send(JSON.stringify({
                type: "chat",
                roomId: id,
                msg: currentMsg
            }))

            setCurrentMsg("")
        }}>
            Send Message
        </button>
    </>
}