"use client";


import { useEffect, useState } from "react";
import { WS_URL } from "../configs/server-url";


export function useSocket() {
    const [loading, setLoading] = useState<boolean>(true)
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(()=> {
        const ws = new WebSocket(WS_URL)
        ws.onopen = () => {
            setLoading(false);
            setSocket(ws)
        }
    },[]);

    return {
        socket,
        loading
    }
}