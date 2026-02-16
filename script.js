const $ = id => document.getElementById(id);

/******************** THEME + DECOR ********************/
const themeBtn = $("themeBtn");
const starfield = $("starfield");

function createStars(count = 140) {
    if (!starfield) return;
    starfield.innerHTML = "";
    for (let i = 0; i < count; i++) {
        const s = document.createElement("div");
        s.className = "star";
        const size = Math.random() * 2 + 1;
        s.style.width = size + "px";
        s.style.height = size + "px";
        s.style.top = Math.random() * 100 + "%";
        s.style.left = Math.random() * 100 + "%";
        s.style.animationDuration = (2 + Math.random() * 3) + "s";
        s.style.animationDelay = (Math.random() * 3) + "s";
        starfield.appendChild(s);
    }
}

function applyThemeDecor() {
    const theme = document.body.dataset.theme || "dark";
    if (!starfield) return;

    if (theme === "light") {
        starfield.style.opacity = "0";
    } else {
        starfield.style.opacity = "1";
    }
}

// Initialize theme
(function initTheme() {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "light" || savedTheme === "dark") {
        document.body.dataset.theme = savedTheme;
    } else {
        document.body.dataset.theme = "dark";
    }
    createStars();
    applyThemeDecor();
})();

themeBtn.addEventListener("click", () => {
    const current = document.body.dataset.theme === "light" ? "light" : "dark";
    const next = current === "light" ? "dark" : "light";
    document.body.dataset.theme = next;
    localStorage.setItem("theme", next);
    applyThemeDecor();
});

/******************** CLOCK ********************/
const clockEl = $("clock");
const ampmEl = $("ampm");
const dateEl = $("date");
const locEl = $("loc");
const fmtSel = $("fmt");

const savedFmt = localStorage.getItem("fmt");
if (savedFmt === "12" || savedFmt === "24") {
    fmtSel.value = savedFmt;
}

function pad(n) {
    return String(n).padStart(2, "0");
}

function drawClock() {
    const d = new Date();
    let h = d.getHours();
    const m = d.getMinutes();
    const s = d.getSeconds();
    let suf = "";

    if (fmtSel.value === "12") {
        suf = h >= 12 ? "PM" : "AM";
        h = h % 12 || 12;
    }

    clockEl.textContent = `${pad(h)}:${pad(m)}:${pad(s)}`;
    ampmEl.textContent = suf;
    dateEl.textContent = d.toLocaleDateString(undefined, {
        weekday: "long",
        day: "2-digit",
        month: "short",
        year: "numeric",
    });
}

drawClock();
setInterval(drawClock, 250);

fmtSel.addEventListener("change", () => {
    localStorage.setItem("fmt", fmtSel.value);
    drawClock();
});

/******************** QUOTES ********************/
const quoteEl = $("quote");
const quotes = [
    "Time you enjoy wasting is not wasted time.",
    "The future starts today, not tomorrow.",
    "The two most powerful warriors are patience and time.",
    "Lost time is never found again.",
    "Your time is limited. Don’t waste it living someone else’s life.",
    "Honey never spoils — it can stay edible for thousands of years."
];

function rotateQuote() {
    if (!quoteEl) return;
    quoteEl.style.opacity = "0";
    setTimeout(() => {
        const q = quotes[Math.floor(Math.random() * quotes.length)];
        quoteEl.textContent = q;
        quoteEl.style.opacity = "1";
    }, 500);
}

rotateQuote();
setInterval(rotateQuote, 20000);

/******************** WEATHER ********************/
const wLoading = $("wLoading");
const wWrap = $("wWrap");
const wTemp = $("wTemp");
const wText = $("wText");
const wWind = $("wWind");
const wHum = $("wHum");

const WEATHER_TEXT = {
    0: "Clear",
    1: "Mainly clear",
    2: "Partly cloudy",
    3: "Overcast",
    45: "Fog",
    48: "Rime fog",
    51: "Drizzle",
    61: "Rain",
    63: "Rain",
    71: "Snow",
    95: "Thunderstorm"
};

function loadWeather(lat, lon) {
    fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=relative_humidity_2m&timezone=auto`
    )
        .then(r => r.json())
        .then(d => {
            if (!d.current_weather) throw new Error("No weather");
            const cw = d.current_weather;
            const idx = d.hourly?.time?.indexOf(cw.time);
            const hum =
                idx >= 0 && d.hourly.relative_humidity_2m
                    ? d.hourly.relative_humidity_2m[idx]
                    : null;

            wTemp.textContent = Math.round(cw.temperature) + "°C";
            wText.textContent = WEATHER_TEXT[cw.weathercode] || "—";
            wWind.textContent = `Wind ${Math.round(cw.windspeed)} km/h`;
            wHum.textContent = hum != null ? `Humidity ${hum}%` : "Humidity —%";

            wLoading.style.display = "none";
            wWrap.style.display = "block";
        })
        .catch(() => {
            wLoading.textContent = "Weather unavailable";
        });
}

if ("geolocation" in navigator) {
    navigator.geolocation.getCurrentPosition(
        pos => {
            loadWeather(pos.coords.latitude, pos.coords.longitude);
            locEl.textContent = "Your location";
        },
        () => {
            loadWeather(12.9716, 77.5946);
            locEl.textContent = "Bengaluru";
        },
        { timeout: 8000 }
    );
} else {
    loadWeather(12.9716, 77.5946);
    locEl.textContent = "Bengaluru";
}

/******************** TIMER ********************/
const tDisp = $("timer");
const tStart = $("tStart");
const tStop = $("tStop");
const tReset = $("tReset");

let tSeconds = 0;
let tInt = null;

function formatTimer(sec) {
    const h = Math.floor(sec / 3600);
    const m = Math.floor((sec % 3600) / 60);
    const s = sec % 60;
    return `${pad(h)}:${pad(m)}:${pad(s)}`;
}

function drawTimer() {
    tDisp.textContent = formatTimer(tSeconds);
}

drawTimer();

tStart.addEventListener("click", () => {
    if (!tInt) {
        tInt = setInterval(() => {
            tSeconds++;
            drawTimer();
        }, 1000);
    }
});

tStop.addEventListener("click", () => {
    clearInterval(tInt);
    tInt = null;
});

tReset.addEventListener("click", () => {
    clearInterval(tInt);
    tInt = null;
    tSeconds = 0;
    drawTimer();
});

/******************** MUSIC PLAYER ********************/
const audio = $("player");
const trackTitleEl = $("trackTitle");
const trackTimeEl = $("trackTime");
const btnPrev = $("prevSong");
const btnNext = $("nextSong");
const btnPlayPause = $("playPause");
const btnShuffle = $("btnShuffle");
const progress = $("progress");
const volume = $("volume");

const songs = [
    { title: "Aaruyire", src: "./Project Music/Aaruyire.mp3" },
    { title: "Aasa Kooda", src: "./Project Music/Aasa Kooda.mp3" },
    { title: "Ale-Ale", src: "./Project Music/Ale-Ale.mp3" },
    { title: "Ambikapathy", src: "./Project Music/Ambikapathy.mp3" },
    { title: "Andha-Arabi-Kadaloram", src: "./Project Music/Andha-Arabi-Kadaloram.mp3" },
    { title: "Azhagiye", src: "./Project Music/Azhagiye.mp3" }
];

let currentSong = 0;
let isShuffle = false;

function loadSong(index, autoPlay = false) {
    const song = songs[index];
    if (!song) return;
    currentSong = index;
    audio.src = song.src;
    trackTitleEl.textContent = song.title;
    trackTitleEl.title = song.title; // tooltip
    if (autoPlay) {
        audio.play().catch(() => { });
        btnPlayPause.textContent = "Pause";
    } else {
        btnPlayPause.textContent = "Play";
    }
}

// Initial load
loadSong(currentSong, false);

// Play/Pause
btnPlayPause.addEventListener("click", () => {
    if (audio.paused) {
        audio.play().catch(() => { });
        btnPlayPause.textContent = "Pause";
    } else {
        audio.pause();
        btnPlayPause.textContent = "Play";
    }
});

// Next/Prev Logic
function playNext() {
    if (isShuffle) {
        let next;
        do {
            next = Math.floor(Math.random() * songs.length);
        } while (next === currentSong && songs.length > 1);
        loadSong(next, true);
    } else {
        const next = (currentSong + 1) % songs.length;
        loadSong(next, true);
    }
}

function playPrev() {
    const prev = (currentSong - 1 + songs.length) % songs.length;
    loadSong(prev, true);
}

btnNext.addEventListener("click", playNext);
btnPrev.addEventListener("click", playPrev);
audio.addEventListener("ended", playNext);

// Shuffle Toggle
btnShuffle.addEventListener("click", () => {
    isShuffle = !isShuffle;
    btnShuffle.style.opacity = isShuffle ? "1" : "0.5";
    btnShuffle.style.filter = isShuffle ? "brightness(1.5)" : "none";
});

// Progress Bar & Time
function formatTime(s) {
    const min = Math.floor(s / 60);
    const sec = Math.floor(s % 60);
    return `${min}:${pad(sec)}`;
}

audio.addEventListener("timeupdate", () => {
    if (audio.duration) {
        const pct = (audio.currentTime / audio.duration) * 100;
        progress.value = pct;
        trackTimeEl.textContent = `${formatTime(audio.currentTime)} / ${formatTime(audio.duration)}`;
    }
});

progress.addEventListener("input", () => {
    if (audio.duration) {
        const time = (progress.value / 100) * audio.duration;
        audio.currentTime = time;
    }
});

// Volume
volume.addEventListener("input", () => {
    audio.volume = volume.value;
});

/******************** TODO LIST ********************/
const todoInput = $("todoInput");
const todoAdd = $("todoAdd");
const todoList = $("todoList");

function loadTodos() {
    const saved = JSON.parse(localStorage.getItem("todos") || "[]");
    todoList.innerHTML = "";
    saved.forEach(task => renderTask(task));
}

function saveTodos() {
    const tasks = [];
    todoList.querySelectorAll("li").forEach(li => {
        tasks.push({
            text: li.querySelector("span").textContent,
            done: li.classList.contains("done")
        });
    });
    localStorage.setItem("todos", JSON.stringify(tasks));
}

function renderTask(task) {
    const li = document.createElement("li");
    if (task.done) li.classList.add("done");

    const span = document.createElement("span");
    span.textContent = task.text;
    span.style.cursor = "pointer";
    span.onclick = () => {
        li.classList.toggle("done");
        saveTodos();
    };

    const btn = document.createElement("button");
    btn.textContent = "×";
    btn.className = "del-btn";
    btn.onclick = () => {
        li.remove();
        saveTodos();
    };

    li.appendChild(span);
    li.appendChild(btn);
    todoList.appendChild(li);
}

function addTask() {
    const text = todoInput.value.trim();
    if (!text) return;
    renderTask({ text, done: false });
    saveTodos();
    todoInput.value = "";
}

todoAdd.addEventListener("click", addTask);
todoInput.addEventListener("keydown", e => {
    if (e.key === "Enter") addTask();
});

loadTodos();

/******************** QUICK NOTES ********************/
const notesArea = $("notesArea");

// Load notes
notesArea.value = localStorage.getItem("notes") || "";

// Save notes on input
notesArea.addEventListener("input", () => {
    localStorage.setItem("notes", notesArea.value);
});
