import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";

const wss = new WebSocketServer({ port: 8080 });

wss.on('connection', function connection(ws: WebSocket, request) {

  const url = request.url;
  if(!url) return;

  const queryParams = new URLSearchParams(url.split('?')[1]);
  const token = queryParams.get('token');

  if(!token) return;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string);

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