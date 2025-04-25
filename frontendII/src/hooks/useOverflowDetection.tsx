
import { useEffect, useRef, useState  } from "react";

const useOverflowDetectin = () => {
  const box = useRef<HTMLDivElement>(null);
  const [overflow, setOverFlow] = useState<boolean>(false); 
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if(box.current)
        setOverFlow(box.current?.scrollHeight > box.current?.clientHeight)
    }, 5); 
    return () => clearTimeout(timeoutId); 
  }, [])

  return {overflow, box}; 
}
export default useOverflowDetectin; 