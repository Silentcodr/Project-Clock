import { useState, useEffect, useRef } from 'react';

const TimerWidget = () => {
    const [seconds, setSeconds] = useState(0);
    const [running, setRunning] = useState(false);
    const intervalRef = useRef<number | null>(null);

    useEffect(() => {
        if (running) {
            intervalRef.current = setInterval(() => {
                setSeconds(s => s + 1);
            }, 1000);
        } else if (!running && intervalRef.current) {
            clearInterval(intervalRef.current);
        }
        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [running]);

    const formatTime = (totalSeconds: number) => {
        const h = Math.floor(totalSeconds / 3600);
        const m = Math.floor((totalSeconds % 3600) / 60);
        const s = totalSeconds % 60;
        const pad = (n: number) => n.toString().padStart(2, '0');
        return `${pad(h)}:${pad(m)}:${pad(s)}`;
    };

    const reset = () => {
        setRunning(false);
        setSeconds(0);
    };

    return (
        <article className="card orbit-widget bottom-right timer">
            <h3>Timer</h3>
            <div className="digits" id="timer">{formatTime(seconds)}</div>
            <div className="btns">
                <button id="tStart" onClick={() => setRunning(true)}>▶</button>
                <button id="tStop" onClick={() => setRunning(false)}>⏸</button>
                <button id="tReset" onClick={reset}>↺</button>
            </div>
        </article>
    );
};

export default TimerWidget;
