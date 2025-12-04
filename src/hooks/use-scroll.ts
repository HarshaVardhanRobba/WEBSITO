

import { useState, useEffect } from "react";

export const useScroll = (threshold: number = 10) => {
    const [scroll, setScroll] = useState(false);
    useEffect(() => {
        const handleScroll = () =>{ 
            setScroll(window.scrollY > threshold);
        }
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [threshold]);

    return scroll;
}