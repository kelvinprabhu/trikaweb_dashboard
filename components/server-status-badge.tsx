"use client";

import { useEffect, useState } from "react";
import { Badge } from "@/components/ui/badge"; // adjust path if needed

export default function ServerStatusBadge() {
  const [isOnline, setIsOnline] = useState(false);

  const checkServerStatus = async () => {
    try {
      const res = await fetch("http://127.0.0.1:8000/trikabot", {
        method: "GET",
      });
      setIsOnline(res.ok);
    } catch {
      setIsOnline(false);
    }
  };

  useEffect(() => {
    checkServerStatus(); // check immediately
    const interval = setInterval(checkServerStatus, 5000); // check every 5 sec
    return () => clearInterval(interval);
  }, []);

  return isOnline ? (
    <Badge className="bg-green-500/20 text-green-300 border-green-500/30">
      Online
    </Badge>
  ) : (
    <Badge className="bg-red-500/20 text-red-300 border-red-500/30">
      Offline
    </Badge>
  );
}
