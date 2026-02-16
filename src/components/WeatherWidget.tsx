import { useEffect, useState } from 'react';
import { Cloud, CloudRain, Sun, Wind, Droplets, Thermometer } from 'lucide-react';

interface WeatherData {
    temp: number;
    feelsLike: number;
    wind: number;
    humidity: number;
    text: string;
    code: number;
    forecast: Array<{ day: string, icon: number, max: number }>;
}

const WeatherWidget = () => {
    const [data, setData] = useState<WeatherData | null>(null);
    const [loading, setLoading] = useState(true);

    const getWeatherInfo = (code: number) => {
        if (code === 0) return { text: "Clear", icon: <Sun size={36} color="#f9d71c" /> };
        if (code <= 3) return { text: "Cloudy", icon: <Cloud size={36} color="#a0c4ff" /> };
        if (code <= 67) return { text: "Rain", icon: <CloudRain size={36} color="#00a8e8" /> };
        return { text: "Windy", icon: <Wind size={36} color="#adb5bd" /> };
    };

    const getSmallIcon = (code: number) => {
        if (code === 0) return "☀️";
        if (code <= 3) return "☁️";
        if (code <= 67) return "🌧️";
        return "💨";
    };

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                const res = await fetch(
                    "https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current_weather=true&hourly=relative_humidity_2m&daily=weathercode,temperature_2m_max,temperature_2m_min&timezone=auto"
                );
                const d = await res.json();
                const curr = d.current_weather;
                const info = getWeatherInfo(curr.weathercode);

                const forecast = [];
                const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
                for (let i = 1; i <= 3; i++) {
                    const date = new Date(d.daily.time[i]);
                    forecast.push({
                        day: days[date.getDay()],
                        icon: d.daily.weathercode[i],
                        max: Math.round(d.daily.temperature_2m_max[i])
                    });
                }

                setData({
                    temp: Math.round(curr.temperature),
                    feelsLike: Math.round(curr.temperature - 1),
                    wind: curr.windspeed,
                    humidity: d.hourly.relative_humidity_2m[new Date().getHours()] || 50,
                    text: info.text,
                    code: curr.weathercode,
                    forecast
                });
            } catch (e) {
                console.error(e);
            } finally {
                setLoading(false);
            }
        };

        fetchWeather();
        const timer = setInterval(fetchWeather, 600000);
        return () => clearInterval(timer);
    }, []);

    return (
        <article className="card orbit-widget top-left weather" style={{ padding: '20px' }}>
            <div className="widget-header" style={{ marginBottom: '10px' }}>
                <h3 style={{ fontSize: '12px', opacity: 0.7, margin: 0 }}>BENGALURU</h3>
                <span className="loc-tag" style={{ fontSize: '10px', opacity: 0.5 }}>LIVE</span>
            </div>

            {loading ? (
                <div style={{ flex: 1, display: 'grid', placeItems: 'center', opacity: 0.5 }}>Loading...</div>
            ) : (
                data && (
                    <div style={{ display: 'flex', flexDirection: 'column', height: '100%', justifyContent: 'space-between' }}>

                        {/* MAIN TEMP ROW */}
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '15px' }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start' }}>
                                <span style={{ fontSize: '64px', fontWeight: 700, lineHeight: 1, fontFamily: 'Syne, sans-serif' }}>{data.temp}°</span>
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                                {getWeatherInfo(data.code).icon}
                                <span style={{ fontSize: '12px', marginTop: '5px', opacity: 0.8 }}>{data.text}</span>
                            </div>
                        </div>

                        {/* DETAILS GRID */}
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: '1fr 1fr',
                            gap: '10px',
                            background: 'rgba(255,255,255,0.03)',
                            padding: '12px',
                            borderRadius: '12px',
                            marginBottom: '10px'
                        }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Thermometer size={14} style={{ opacity: 0.6 }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '9px', opacity: 0.6, textTransform: 'uppercase' }}>Feels Like</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{data.feelsLike}°</span>
                                </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <Droplets size={14} style={{ opacity: 0.6 }} />
                                <div style={{ display: 'flex', flexDirection: 'column' }}>
                                    <span style={{ fontSize: '9px', opacity: 0.6, textTransform: 'uppercase' }}>Humidity</span>
                                    <span style={{ fontSize: '13px', fontWeight: 600 }}>{data.humidity}%</span>
                                </div>
                            </div>
                        </div>

                        {/* FORECAST */}
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0 5px' }}>
                            {data.forecast.map((d, i) => (
                                <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                                    <span style={{ fontSize: '10px', opacity: 0.5 }}>{d.day}</span>
                                    <span style={{ fontSize: '14px' }}>{getSmallIcon(d.icon)}</span>
                                    <span style={{ fontSize: '11px', fontWeight: 600 }}>{d.max}°</span>
                                </div>
                            ))}
                        </div>
                    </div>
                )
            )}
        </article>
    );
};

export default WeatherWidget;
