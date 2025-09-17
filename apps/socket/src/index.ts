import db from 'database/client';
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "common/config";

const wss = new WebSocketServer({ port: 8080 });

interface User {
  ws: WebSocket,
  rooms: string[],
  userId: string,
}

const users: User[] = [];

function checkUser(token : string): string | null {
    try {
      const decoded = jwt.verify(token as string, JWT_SECRET);

      // @ts-expect-error modify
      if (!decoded || !decoded.id) {
        return null
      }

      // @ts-expect-error modify
      return decoded.id
    } catch (error) {
      return null
    }
}

wss.on('connection', function connection(ws: WebSocket, request) {

  const url = request.url;
  if(!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token');

  if(!token) return;

  const userId = checkUser(token);

  if(!userId || userId == null) {
    ws.close()
    return;
  };

  users.push({
    userId,
    rooms: [],
    ws
  })

  ws.on('error', console.error);

  ws.on('message', async function message(data) {
    const parsedData = JSON.parse(data as unknown as string)

    if(parsedData.type === "join_room"){
      const user = users.find(x => x.ws === ws)
      user?.rooms.push(parsedData.roomId)
    }

    if(parsedData.type === "leave_room"){
      const user = users.find(x => x.ws === ws)
      if(!user) return
      user.rooms = user?.rooms.filter(x => x === parsedData.room)
    }

    if(parsedData.type === "chat"){
      const roomId = parsedData.roomId;
      const msg = parsedData.msg;

      await db.chat.create({
        data: {
          roomId,
          message: msg,
          userId
        }
      })

      users.forEach(user => {
        if (user.rooms.includes(roomId)){
          user.ws.send(JSON.stringify({
            type: "chat",
            msg: msg,
            roomId,
          }))
        }
      })
      
    }

  });

  ws.send('something');
});