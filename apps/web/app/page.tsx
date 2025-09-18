
"use client"

import { useState } from "react"

import styles from "./page.module.css";
import { useRouter } from "next/navigation";

export default function Home() {

  const router = useRouter()

  const [id, setId] = useState("");

  return (
    <div className={styles.page}>
        <input type="text" value={id} onChange={(e)=> setId(e.target.value)} placeholder="Room Id">
        </input>
        <button onClick={()=> {
            router.push(`/room/${id}`)
        }}>
          Join Room
        </button>
    </div>
  );
}
