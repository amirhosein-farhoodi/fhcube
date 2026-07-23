import { useEffect, useRef, useState } from "react";

export function useEvenPixelHeight<T extends HTMLElement>() {
  const containerRef = useRef<T>(null);
  const [evenHeight, setEvenHeight] = useState<number | null>(null);

  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;

    const update = () => {
      const measured = element.getBoundingClientRect().height;
      setEvenHeight(Math.floor(measured / 2) * 2);
    };

    update();
    const observer = new ResizeObserver(update);
    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return { containerRef, evenHeight };
}
