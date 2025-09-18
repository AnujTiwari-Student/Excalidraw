"use client";


import { useEffect, useState } from "react";
import { WS_URL } from "../configs/server-url";


export function useSocket() {
    const [loading, setLoading] = useState<boolean>(true)
    const [socket, setSocket] = useState<WebSocket | null>(null)

    useEffect(()=> {
        const ws = new WebSocket(`${WS_URL}?token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjhiNGY0MTU3LTY2N2UtNGIxMi1iNjk0LTE3NTZhOGNhODdjYSIsImlhdCI6MTc1ODExNDAwNn0.DpdPeznpkYmk6HVxX9Hx9cLTpWUgAPMiZevo0p6kUJQ`)
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