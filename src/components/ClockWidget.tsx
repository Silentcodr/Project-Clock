import { useEffect, useState } from 'react';

const ClockWidget = () => {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Format Time
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const isAm = hours < 12;
    const displayHours = hours % 12 || 12;
    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes;

    // Format Date
    const dateStr = time.toLocaleDateString('en-US', {
        weekday: 'long',
        month: 'short',
        day: 'numeric'
    }).toUpperCase();

    // Greeting
    const getGreeting = () => {
        if (hours < 12) return "Good Morning";
        if (hours < 18) return "Good Afternoon";
        return "Good Evening";
    };

    return (
        <section className="hub-center">
            <div className="time-container">
                <div className="time" id="clock">{displayHours}:{displayMinutes}</div>
                <div className="ampm" id="ampm">{isAm ? 'AM' : 'PM'}</div>
            </div>
            <div className="date-display" id="date">{dateStr}</div>

            {/* Quote Widget Placeholder */}
            <div className="quote-box">
                <span id="quoteText">"Focus on being productive instead of busy."</span>
                <span id="quoteAuthor" className="quote-author">Tim Ferriss</span>
            </div>

            <div className="controls-row">
                <div className="greeting" id="greeting">{getGreeting()}</div>
                <div className="toggles">
                    <button id="fmtBtn" className="sm-btn" title="Toggle 12/24h">12H</button>
                    <button id="themeBtn" className="sm-btn" title="Toggle Theme">☀</button>
                </div>
            </div>
        </section>
    );
};

export default ClockWidget;
