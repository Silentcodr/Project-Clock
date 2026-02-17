import { useEffect, useState } from 'react';

const ClockWidget = () => {
    const [time, setTime] = useState(new Date());
    const [is24Hour, setIs24Hour] = useState(() => localStorage.getItem('is24Hour') === 'true');
    const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'dark');

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    // Persist Settings
    useEffect(() => { localStorage.setItem('is24Hour', String(is24Hour)); }, [is24Hour]);
    useEffect(() => {
        localStorage.setItem('theme', theme);
        document.documentElement.setAttribute('data-theme', theme);
    }, [theme]);

    // Toggle Handlers
    const toggleFormat = () => setIs24Hour(p => !p);
    const toggleTheme = () => setTheme(p => p === 'dark' ? 'light' : 'dark');

    // Format Time
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const isAm = hours < 12;

    const displayHours = is24Hour
        ? (hours < 10 ? `0${hours}` : hours.toString())
        : (hours % 12 || 12).toString();

    const displayMinutes = minutes < 10 ? `0${minutes}` : minutes.toString();

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
                {!is24Hour && <div className="ampm" id="ampm">{isAm ? 'AM' : 'PM'}</div>}
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
                    <button id="fmtBtn" className="sm-btn" onClick={toggleFormat} title="Toggle 12/24h">
                        {is24Hour ? '24H' : '12H'}
                    </button>
                    <button id="themeBtn" className="sm-btn" onClick={toggleTheme} title="Toggle Theme">
                        {theme === 'dark' ? '☀' : '☾'}
                    </button>
                </div>
            </div>
        </section>
    );
};

export default ClockWidget;
