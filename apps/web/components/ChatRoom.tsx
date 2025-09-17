import axios from "axios";
import { BACKEND_URL } from "../configs/server-url";


async function getChat(roomId: string){
    const response = await axios.get(`${BACKEND_URL}/chat/${roomId}`)
    return response.data.msg
}

export default async function ChatRoom({id}: {id: string}){
    const message = await getChat(id)
}