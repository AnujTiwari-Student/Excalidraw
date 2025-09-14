import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "common/config";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: WebSocket, request) {

  const url = request.url;
  if(!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token');

  if(!token) return;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);

    if(!decoded) {
      ws.close();
      return;
    };

  } catch (error) {
    return;
  }

  ws.on('error', console.error);

  ws.on('message', function message(data) {
    ws.send("Pong")
  });

  ws.send('something');
});