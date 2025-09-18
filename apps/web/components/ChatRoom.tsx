import axios from "axios";
import { BACKEND_URL } from "../configs/server-url";
import { ChatRoomClient } from "./ChatRoomClient";


async function getChat(roomId: string){
    const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`)
    return response.data.msg
}

export async function GetChatRoom({id}: {id: string}){
    const message = await getChat(id)
    return <ChatRoomClient id={id} messages={message} />
}