import Image from "next/image";
import { useState, useEffect } from "react";

const ShimmerMessages = () => {
    const messages = [
        "Analysing your question..",
        "thinking..",
        "Building up components..",
        "Started writing the code..",
        "Installing dependancies..",
        "Compiling the code..",
        "Testing the code 1 out of 2 times..",
        "Adding final touches..",
        "Testing the code 2 out of 2 times..",
        "your code is ready!",
        ""
    ];

    const [currentmessageIndex, setcurrentmessageIndex] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setcurrentmessageIndex((prevIndex) => (prevIndex + 1) % messages.length);
        }, 2000);

        return () => clearInterval(interval);
    }, [messages.length]);

    return (
        <div className="flex items-center gap-2">
            <span className="text-base text-muted-foreground animate-pulse">
                {messages[currentmessageIndex]}
            </span>
        </div>
    )
};

export const MessageLoading = () => {
    return (
        <div className="flex flex-col group px-2 pb-4">
            <div
            className="flex items-center gap-2 pl-2 mb-2">
                <Image 
                    src="/logo.svg" 
                    alt="Coco Ai" 
                    width={18} 
                    height={18} className="shrink-0" 
                />
                <span className="text-sm font-medium bg-linear-to-r from-red-900 to-red-800 bg-clip-text text-transparent">
                    Coco Ai
                </span>
            </div>
            <div className="pl-8.5 flex flex-col gap-y-4">
                <ShimmerMessages />
            </div>
        </div>
    )
}