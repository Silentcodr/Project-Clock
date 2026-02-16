import { useState, useEffect, useRef } from 'react';

// Types
interface Task {
    text: string;
    done: boolean;
}

interface Note {
    text: string;
    time: string;
}

const ProductivityWidget = () => {
    const [activeTab, setActiveTab] = useState<'news' | 'tasks' | 'notes'>('news');
    const [news, setNews] = useState<any[]>([]);
    const [location, setLocation] = useState("Loading...");

    // TASKS STATE
    const [tasks, setTasks] = useState<Task[]>(() => {
        const saved = localStorage.getItem('tasks');
        return saved ? JSON.parse(saved) : [];
    });
    const [taskInput, setTaskInput] = useState("");

    // NOTES STATE
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem('chatNotes');
        return saved ? JSON.parse(saved) : [];
    });
    const [noteInput, setNoteInput] = useState("");

    const notesEndRef = useRef<HTMLDivElement>(null);

    // --- EFFECT: Fetch Location & Real News ---
    useEffect(() => {
        const fetchNews = async () => {
            // Helper for timeout
            const withTimeout = (promise: Promise<any>, ms: number) => {
                return Promise.race([
                    promise,
                    new Promise((_, reject) => setTimeout(() => reject(new Error("Timeout")), ms))
                ]);
            };

            try {
                let city = 'Bengaluru'; // Default fallback

                // 1. Get City from IP (Max 2 seconds)
                try {
                    const locRes = await withTimeout(fetch('https://ipapi.co/json/'), 2000);
                    if (!locRes.ok) throw new Error('ipapi failed');
                    const locData = await locRes.json();
                    city = locData.city || city;
                } catch (e) {
                    console.warn(`Location fetch failed/timed out: ${e}`);
                    // Fallback to "World" if location fails quickly
                    city = "Technology";
                }

                setLocation(city);

                // 2. Fetch Google News RSS (Max 5 seconds)
                const rssUrl = `https://news.google.com/rss/search?q=${city}+news&hl=en-IN&gl=IN&ceid=IN:en`;
                let contents = '';

                try {
                    // METHOD A: rss2json (Usually fast & reliable JSON)
                    // Note: Has rate limits, but good for local dev/demos
                    const rss2json = `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(rssUrl)}`;
                    const res = await withTimeout(fetch(rss2json), 5000);
                    const data = await res.json();

                    if (data.status === 'ok' && data.items) {
                        const newsItems = data.items.slice(0, 5).map((item: any) => ({
                            title: item.title,
                            link: item.link
                        }));
                        setNews(newsItems);
                        return; // Success!
                    }
                } catch (e) {
                    console.warn(`rss2json failed: ${e}, trying proxies...`);
                }

                try {
                    // METHOD B: allorigins Proxy (XML)
                    const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;
                    const response = await withTimeout(fetch(proxyUrl), 5000);
                    const data = await response.json();
                    contents = data.contents;
                } catch (e) {
                    console.warn(`Primary proxy failed: ${e}`);
                    // METHOD C: codetabs Proxy
                    try {
                        const fallbackProxy = `https://api.codetabs.com/v1/proxy?quest=${encodeURIComponent(rssUrl)}`;
                        const res = await withTimeout(fetch(fallbackProxy), 5000);
                        contents = await res.text();
                    } catch (err) {
                        console.warn(`Secondary proxy failed: ${err}`);
                    }
                }

                if (contents) {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(contents, "text/xml");
                    const items = xml.querySelectorAll("item");

                    const newsItems: any[] = [];
                    items.forEach((item, index) => {
                        if (index < 5) {
                            newsItems.push({
                                title: item.querySelector("title")?.textContent || "News Item",
                                link: item.querySelector("link")?.textContent || "#"
                            });
                        }
                    });

                    if (newsItems.length > 0) {
                        setNews(newsItems);
                        return;
                    }
                }
                throw new Error("No content fetched");

            } catch (error) {
                console.error("News fetch final error:", error);
                setNews([
                    { title: "News unavailable. Trending Tech:", link: "#" },
                    { title: "DeepSeek v3 Released: Open Source AI", link: "#" },
                    { title: "NVIDIA H200 Chips Shipping Now", link: "#" },
                    { title: "React 19: The New Compiler Era", link: "#" }
                ]);
                setLocation((prev) => prev === "Loading..." ? "Tech" : prev);
            }
        };

        fetchNews();
    }, []);

    // --- EFFECT: Save to LocalStorage ---
    useEffect(() => { localStorage.setItem('tasks', JSON.stringify(tasks)); }, [tasks]);
    useEffect(() => { localStorage.setItem('chatNotes', JSON.stringify(notes)); }, [notes]);

    // --- EFFECT: Scroll to bottom of notes ---
    useEffect(() => {
        if (activeTab === 'notes') {
            notesEndRef.current?.scrollIntoView({ behavior: "smooth" });
        }
    }, [notes, activeTab]);

    // --- ACTIONS: Tasks ---
    const addTask = () => {
        if (!taskInput.trim()) return;
        setTasks([...tasks, { text: taskInput, done: false }]);
        setTaskInput("");
    };

    const toggleTask = (index: number) => {
        const newTasks = [...tasks];
        newTasks[index].done = !newTasks[index].done;
        setTasks(newTasks);
    };

    // --- ACTIONS: Notes ---
    const addNote = () => {
        if (!noteInput.trim()) return;
        const now = new Date();
        const timeStr = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

        // Limit to 50 notes
        const newNotes = [...notes, { text: noteInput, time: timeStr }];
        if (newNotes.length > 50) newNotes.shift();

        setNotes(newNotes);
        setNoteInput("");
    };

    return (
        <article className="card orbit-widget bottom-left productivity">
            <div className="tab-nav">
                <button className={`tab-btn ${activeTab === 'news' ? 'active' : ''}`} onClick={() => setActiveTab('news')}>{location}</button>
                <button className={`tab-btn ${activeTab === 'tasks' ? 'active' : ''}`} onClick={() => setActiveTab('tasks')}>Tasks</button>
                <button className={`tab-btn ${activeTab === 'notes' ? 'active' : ''}`} onClick={() => setActiveTab('notes')}>Notes</button>
            </div>

            {/* TAB CONTENT: NEWS */}
            {activeTab === 'news' && (
                <div id="tab-news" className="tab-content active" style={{ display: 'block' }}>
                    <ul id="newsList">
                        {news.length === 0 ? <li>Loading local news...</li> : news.map((n, i) => (
                            <li key={i}><a href={n.link} target="_blank" rel="noopener noreferrer">{n.title}</a></li>
                        ))}
                    </ul>
                </div>
            )}

            {/* TAB CONTENT: TASKS */}
            {activeTab === 'tasks' && (
                <div id="tab-tasks" className="tab-content active" style={{ display: 'block' }}>
                    <div className="todo-input-group">
                        <input
                            type="text"
                            id="todoInput"
                            value={taskInput}
                            onChange={(e) => setTaskInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addTask()}
                            placeholder="New Task..."
                        />
                        <button id="todoAdd" onClick={addTask}>+</button>
                    </div>
                    <ul id="todoList">
                        {tasks.map((t, i) => (
                            <li key={i} className={t.done ? 'done' : ''} onClick={() => toggleTask(i)}>
                                <div className="check-circle"></div><span>{t.text}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* TAB CONTENT: NOTES (Chat Style) */}
            {activeTab === 'notes' && (
                <div id="tab-notes" className="tab-content active" style={{ display: 'flex', flexDirection: 'column', height: '100%', overflow: 'hidden' }}>
                    <div id="notesFeed" className="notes-feed" style={{ flex: 1, overflowY: 'auto', marginBottom: '10px', paddingRight: '5px' }}>
                        {notes.length === 0 && (
                            <div className="note-card system-note">
                                <span className="note-text" style={{ color: 'var(--muted)', fontSize: '12px' }}>No notes yet. Start typing!</span>
                            </div>
                        )}
                        {notes.map((n, i) => (
                            <div key={i} className="note-card">
                                <span className="note-time">{n.time}</span>
                                <span className="note-text">{n.text}</span>
                            </div>
                        ))}
                        <div ref={notesEndRef} />
                    </div>

                    <div className="note-input-group" style={{ marginTop: 'auto' }}>
                        <input
                            type="text"
                            id="noteInput"
                            value={noteInput}
                            onChange={(e) => setNoteInput(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && addNote()}
                            placeholder="Type a note..."
                            autoComplete="off"
                        />
                        <button id="noteSendBtn" onClick={addNote}>➤</button>
                    </div>
                </div>
            )}
        </article>
    );
};

export default ProductivityWidget;
