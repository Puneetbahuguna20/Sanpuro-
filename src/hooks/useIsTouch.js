import { useState, useEffect } from 'react';

export default function useIsTouch() {
  const [isTouch, setIsTouch] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(hover: none), (pointer: coarse)');
    setIsTouch(mq.matches);

    const handler = (e) => setIsTouch(e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  return isTouch;
}
