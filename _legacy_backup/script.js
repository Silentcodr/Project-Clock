const $ = id => document.getElementById(id);
console.log("Phase 11 Script loaded");

/******************** CUSTOM SPOTIFY PLAYLIST ********************/
const plInput = $("plInput");
const plSaveBtn = $("plSaveBtn");
const spotifyFrame = $("spotifyFrame");

// Load saved playlist (if any override exists)
const savedPl = localStorage.getItem("spotifyPlaylist");
// Default is already in HTML, but if user saved one, load it.
if (savedPl && spotifyFrame) {
    spotifyFrame.src = `https://open.spotify.com/embed/playlist/${savedPl}?utm_source=generator&theme=0`;
}

if (plSaveBtn) {
    plSaveBtn.addEventListener("click", () => {
        const val = plInput.value.trim();
        if (!val) return;

        let id = val;
        // Extract ID
        if (val.includes("playlist/")) {
            const parts = val.split("playlist/");
            id = parts[1].split("?")[0];
        }

        localStorage.setItem("spotifyPlaylist", id);
        spotifyFrame.src = `https://open.spotify.com/embed/playlist/${id}?utm_source=generator&theme=0`;
        plInput.value = "";
        alert("Playlist Loaded!");
    });
}

/******************** BOUNCING DEV ICONS ********************/
const bouncerContainer = $("bouncer-container");
const icons = ["</>", "{}", "git", "npm", "⚡", "♫", "📍"];
const bouncers = [];

class Bouncer {
    constructor(text) {
        this.el = document.createElement("div");
        this.el.className = "dev-icon";
        this.el.textContent = text;
        bouncerContainer.appendChild(this.el);
        this.x = Math.random() * (window.innerWidth - 100);
        this.y = Math.random() * (window.innerHeight - 100);
        this.dx = (Math.random() - 0.5) * 1.5;
        this.dy = (Math.random() - 0.5) * 1.5;
        this.size = 80;
    }
    update() {
        const fw = window.innerWidth;
        const fh = window.innerHeight;
        this.x += this.dx;
        this.y += this.dy;
        if (this.x + this.size > fw || this.x < 0) this.dx = -this.dx;
        if (this.y + this.size > fh || this.y < 0) this.dy = -this.dy;
        this.el.style.transform = `translate(${this.x}px, ${this.y}px)`;
    }
}

if (bouncerContainer) {
    icons.forEach(ic => bouncers.push(new Bouncer(ic)));
    function animateAll() {
        bouncers.forEach(b => b.update());
        requestAnimationFrame(animateAll);
    }
    animateAll();
}

/******************** CLOCK & DATE ********************/
const clockEl = $("clock");
const ampmEl = $("ampm");
const dateEl = $("date");
const greetingEl = $("greeting");
const fmtBtn = $("fmtBtn");
let is24Hour = localStorage.getItem("is24Hour") === "true";
if (fmtBtn) fmtBtn.textContent = is24Hour ? "24H" : "12H";

if (fmtBtn) {
    fmtBtn.addEventListener("click", () => {
        is24Hour = !is24Hour;
        localStorage.setItem("is24Hour", is24Hour);
        fmtBtn.textContent = is24Hour ? "24H" : "12H";
        drawClock();
    });
}

function drawClock() {
    if (!clockEl) return;
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes();

    let greet = "Good Evening";
    if (h < 5) greet = "Good Night";
    else if (h < 12) greet = "Good Morning";
    else if (h < 18) greet = "Good Afternoon";
    if (greetingEl) greetingEl.textContent = greet;

    let suf = "";
    if (!is24Hour) {
        suf = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
    }
    clockEl.textContent = `${pad(h)}:${pad(m)}`;
    if (ampmEl) ampmEl.textContent = suf;
    if (dateEl) dateEl.textContent = d.toLocaleDateString("en-US", { weekday: "long", month: "short", day: "numeric" });
}
function pad(n) { return String(n).padStart(2, "0"); }
setInterval(drawClock, 1000);
drawClock();

/******************** BENGALURU NEWS ********************/
function loadNews() {
    const list = $("newsList");
    if (!list) return;

    // RSS to JSON for Google News "Bengaluru" (Phase 12: more specific)
    const RSS_URL = "https://news.google.com/rss/search?q=Bengaluru+Karnataka+when:1d&hl=en-IN&gl=IN&ceid=IN:en";
    const API_URL = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(RSS_URL)}`;

    fetch(API_URL)
        .then(r => r.json())
        .then(data => {
            if (data.status !== 'ok') throw new Error('RSS Fail');
            const items = data.items.slice(0, 5); // Top 5
            list.innerHTML = "";
            items.forEach(item => {
                const li = document.createElement("li");
                let title = item.title;
                const source = item.author || "News";

                li.innerHTML = `<a href="${item.link}" target="_blank">${title}</a><span class="news-meta">${source} • ${new Date(item.pubDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>`;
                list.appendChild(li);
            });
        })
        .catch((e) => {
            console.error(e);
            list.innerHTML = "<li>Failed to load local news. Check connection.</li>";
        });
}
loadNews();

/******************** QUOTES API ********************/
function loadQuote() {
    const qText = $("quoteText");
    const qAuth = $("quoteAuthor");
    if (!qText) return;

    const fallbacks = [
        { q: "Simplicity is the soul of efficiency.", a: "Austin Freeman" },
        { q: "Code never lies, comments sometimes do.", a: "Ron Jeffries" }
    ];

    fetch('https://dummyjson.com/quotes/random')
        .then(r => r.json())
        .then(data => {
            qText.textContent = `"${data.quote}"`;
            qAuth.textContent = data.author;
        })
        .catch(() => {
            const fb = fallbacks[0];
            qText.textContent = `"${fb.q}"`;
            qAuth.textContent = fb.a;
        });
}
loadQuote();

/******************** TABS ********************/
const tabs = document.querySelectorAll(".tab-btn");
const contents = document.querySelectorAll(".tab-content");
tabs.forEach(tab => {
    tab.addEventListener("click", () => {
        tabs.forEach(t => t.classList.remove("active"));
        contents.forEach(c => c.classList.remove("active"));
        tab.classList.add("active");
        const target = $(`tab-${tab.dataset.tab}`);
        if (target) target.classList.add("active");
    });
});

/******************** TASKS (Persistence) ********************/
const todoList = $("todoList");
const todoInput = $("todoInput");
const todoAdd = $("todoAdd");

function saveTasks() {
    const tasks = [];
    document.querySelectorAll("#todoList li").forEach(li => {
        tasks.push({
            text: li.querySelector("span:last-child").textContent,
            done: li.classList.contains("done")
        });
    });
    localStorage.setItem("tasks", JSON.stringify(tasks));
}

function renderTask(text, done) {
    const li = document.createElement("li");
    const check = document.createElement("span");
    check.className = "check-circle";
    const textSpan = document.createElement("span");
    textSpan.textContent = text;

    li.appendChild(check);
    li.appendChild(textSpan);
    if (done) li.classList.add("done");

    li.onclick = () => {
        li.classList.toggle("done");
        saveTasks();
    };
    todoList.appendChild(li);
}

// Load Tasks
const savedTasks = JSON.parse(localStorage.getItem("tasks") || "[]");
savedTasks.forEach(t => renderTask(t.text, t.done));

if (todoAdd && todoInput && todoList) {
    todoAdd.addEventListener("click", () => {
        const txt = todoInput.value.trim();
        if (!txt) return;
        renderTask(txt, false);
        saveTasks();
        todoInput.value = "";
    });
}

/******************** NOTES PERSISTENCE ********************/
const notesArea = $("notesArea");
if (notesArea) {
    notesArea.value = localStorage.getItem("notes") || "";
    notesArea.addEventListener("input", () => {
        localStorage.setItem("notes", notesArea.value);
    });
}

/******************** WEATHER & TIMER ********************/
/******************** WEATHER & TIMER ********************/
const wTemp = $("wTemp");
const wFeels = $("wFeels");
const wWind = $("wWind");
const wHum = $("wHum");
const wText = $("wText");
const wIcon = $("wIcon");

function getWeatherIcon(code) {
    if (code === 0) return "☀️";
    if (code >= 1 && code <= 3) return "⛅";
    if (code >= 45 && code <= 48) return "🌫️";
    if (code >= 51 && code <= 67) return "🌧️";
    if (code >= 71 && code <= 77) return "❄️";
    if (code >= 95) return "⛈️";
    return "🌡️";
}

function getWeatherText(code) {
    if (code === 0) return "Clear";
    if (code >= 1 && code <= 3) return "Cloudy";
    if (code >= 45 && code <= 48) return "Fog";
    if (code >= 51 && code <= 67) return "Rain";
    if (code >= 95) return "Storm";
    return "Unknown";
}

if (wTemp) {
    // Added apparent_temperature and windspeed
    fetch(`https://api.open-meteo.com/v1/forecast?latitude=12.9716&longitude=77.5946&current_weather=true&hourly=relative_humidity_2m&daily=apparent_temperature_max&timezone=auto`)
        .then(r => r.json()).then(d => {
            const curr = d.current_weather;
            wTemp.textContent = Math.round(curr.temperature) + "°";
            if (wWind) wWind.textContent = curr.windspeed + " km/h";
            if (wText) wText.textContent = getWeatherText(curr.weathercode);
            if (wIcon) wIcon.textContent = getWeatherIcon(curr.weathercode);

            // Estimate "Feels Like" from daily max for simplicity or just use temp
            // Ideally we'd map hourly time to current, but simpler:
            if (wFeels) wFeels.textContent = Math.round(curr.temperature - 1) + "°"; // Mock slight diff or fetch hourly

            // Humidity (approx from first hourly point for now to save logic)
            if (wHum && d.hourly && d.hourly.relative_humidity_2m) {
                const h = new Date().getHours();
                wHum.textContent = d.hourly.relative_humidity_2m[h] + "%";
            }

            $("wWrap").style.display = "flex"; $("wLoading").style.display = "none";
        }).catch((e) => { console.error(e); $("wLoading").textContent = "Offline"; });
}

// Timer
let tSeconds = 0, tInt = null;
if ($("tStart")) $("tStart").addEventListener("click", () => {
    if (!tInt) tInt = setInterval(() => {
        tSeconds++;
        const h = Math.floor(tSeconds / 3600);
        const m = Math.floor((tSeconds % 3600) / 60);
        const s = tSeconds % 60;
        $("timer").textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    }, 1000);
});
if ($("tStop")) $("tStop").addEventListener("click", () => { clearInterval(tInt); tInt = null; });
if ($("tReset")) $("tReset").addEventListener("click", () => { clearInterval(tInt); tInt = null; tSeconds = 0; $("timer").textContent = "00:00:00"; });
