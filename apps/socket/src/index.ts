import db from "database/client";
import WebSocket, { WebSocketServer } from "ws";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "common/config";

const wss = new WebSocketServer({ port: 8080 });

console.log("JWT_SECRET loaded:", JWT_SECRET ? "YES" : "NO");
console.log("JWT_SECRET value:", JWT_SECRET ? "DEFINED" : "UNDEFINED");

console.log("JWT_SECRET (first 10 chars):", JWT_SECRET?.substring(0, 10));
console.log("JWT_SECRET length:", JWT_SECRET?.length);
console.log("JWT_SECRET type:", typeof JWT_SECRET);

interface User {
  ws: WebSocket;
  rooms: string[];
  userId: string;
}

const users: User[] = [];

function checkUser(token: string): string | null {
  console.log("JWT_SECRET in checkUser:", JWT_SECRET ? "AVAILABLE" : "MISSING");

  if (!JWT_SECRET) {
    console.error("JWT_SECRET is not available for token verification");
    return null;
  }

  try {
    const decoded = jwt.verify(token as string, JWT_SECRET);

    // @ts-ignore
    if (!decoded || !decoded.id) {
      return null;
    }

    // @ts-ignore
    return decoded.id;
  } catch (error) {
    console.error("JWT verification error:", error);
    return null;
  }
}

wss.on("connection", function connection(ws: WebSocket, request) {
  console.log("New WebSocket connection attempt");

  const url = request.url;
  if (!url) {
    console.log("Connection rejected: No URL provided");
    ws.close(1008, "Missing URL");
    return;
  }

  const queryParams = new URLSearchParams(url.split("?")[1]);
  const token = queryParams.get("token");

  if (!token) {
    console.log("Connection rejected: No token provided");
    ws.close(1008, "Missing authentication token");
    return;
  }

  const userId = checkUser(token);

  if (!userId) {
    console.log("Connection rejected: Invalid token");
    ws.close(1008, "Invalid authentication token");
    return;
  }

  console.log(`User ${userId} connected successfully`);

  users.push({
    userId,
    rooms: [],
    ws,
  });

  ws.send(
    JSON.stringify({
      type: "connected",
      message: "Connected successfully",
      userId: userId,
    })
  );

  ws.on("close", (code, reason) => {
    console.log(`User ${userId} disconnected: ${code} - ${reason}`);
    const index = users.findIndex((user) => user.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });

  ws.on("error", (error) => {
    console.error(`WebSocket error for user ${userId}:`, error);
    const index = users.findIndex((user) => user.ws === ws);
    if (index !== -1) {
      users.splice(index, 1);
    }
  });

  ws.on("message", async function message(data) {
    try {
      const parsedData = JSON.parse(data as unknown as string);

      if (parsedData.type === "join_room") {
        console.log("Processing join_room for roomId:", parsedData.roomId);
        const user = users.find((x) => x.ws === ws);
        if (!user) return;

        user.rooms.push(parsedData.roomId);
        console.log("User", user.userId, "joined rooms:", user.rooms);
      }

      if (parsedData.type === "leave_room") {
        console.log("Processing leave_room for roomId:", parsedData.roomId);
        const user = users.find((x) => x.ws === ws);
        if (!user) return;

        user.rooms = user.rooms.filter((x) => x !== parsedData.roomId);
        console.log("User", user.userId, "remaining rooms:", user.rooms);
      }

      if (parsedData.type === "chat") {
        const roomId = parsedData.roomId;
        const msg = parsedData.msg;

        await db.chat.create({
          data: {
            roomId,
            message: msg,
            userId,
          },
        });

        users.forEach((user) => {
          if (user.rooms.includes(roomId)) {
            user.ws.send(
              JSON.stringify({
                type: "chat",
                msg: msg,
                roomId,
              })
            );
          }
        });
      }
    } catch (error) {
      console.error("=== MESSAGE PARSING ERROR ===");
      console.error("Error:", error);
      console.error("Raw data that failed:", data);
      console.log(error);
    }
  });
});
