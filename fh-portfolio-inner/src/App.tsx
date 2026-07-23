import { useEffect, useState } from "react";
import { LaptopOS } from "./laptop-os/LaptopOS";

export default function App() {
  const [isActive, setIsActive] = useState(() => window.self === window.top);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (e.data && typeof e.data === "object" && e.data.type === "fh:setActive") {
        setIsActive(Boolean(e.data.value));
      }
    };
    window.addEventListener("message", onMessage);
    return () => window.removeEventListener("message", onMessage);
  }, []);

  return (
    <div style={{ width: "100vw", height: "100vh", overflow: "hidden", background: "#000" }}>
      <LaptopOS isActive={isActive} />
    </div>
  );
}
