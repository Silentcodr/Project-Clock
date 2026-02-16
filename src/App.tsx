import ClockWidget from './components/ClockWidget';
import WeatherWidget from './components/WeatherWidget';
import SpotifyWidget from './components/SpotifyWidget';
import ProductivityWidget from './components/ProductivityWidget';
import TimerWidget from './components/TimerWidget';
import BouncingIcons from './components/BouncingIcons';
import './index.css'; // Global styles

function App() {
  return (
    <>
      <BouncingIcons />
      <div id="starfield"></div>

      <main className="orbit-shell">
        {/* CENTER HUB */}
        <div className="hub-center">
          <ClockWidget />
        </div>

        {/* TOP LEFT: Weather */}
        <div className="top-left">
          <WeatherWidget />
        </div>

        {/* TOP RIGHT: Real Spotify Embed */}
        <div className="top-right">
          <SpotifyWidget />
        </div>

        {/* BOTTOM LEFT: Productivity (Note/Task/News) */}
        <div className="bottom-left">
          <ProductivityWidget />
        </div>

        {/* BOTTOM RIGHT: Timer */}
        <div className="bottom-right">
          <TimerWidget />
        </div>
      </main>
    </>
  );
}

export default App;
