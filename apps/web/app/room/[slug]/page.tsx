import axios from "axios";
import { BACKEND_URL } from "../../../configs/server-url";
import { GetChatRoom } from "../../../components/ChatRoom";


interface RoomResponse {
  room: { id: string };
}

async function getRoomId(slug: string){
    try {
    const response = await axios.get<RoomResponse>(`${BACKEND_URL}/room/${slug}`);
    return response.data.room.id;
  } catch (error) {
    console.error("Failed to fetch room ID:", error);
    return null;
  }
}

export default async function ChatRoom(props: {
  params: Promise<{ slug: string }>; 
}) {
  const { slug } = await props.params; 
  const roomId = await getRoomId(slug);

  if (!roomId) {
    return <div className="text-red-500">Room not found</div>;
  }

  return <GetChatRoom id={roomId} />;
}