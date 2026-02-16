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
            try {
                // 1. Get City from IP
                const locRes = await fetch('https://ipapi.co/json/');
                const locData = await locRes.json();
                const city = locData.city || 'Technology';
                setLocation(city);

                // 2. Fetch Google News RSS via CORS Proxy
                // Using 'allorigins' to bypass CORS
                const rssUrl = `https://news.google.com/rss/search?q=${city}+local+news&hl=en-IN&gl=IN&ceid=IN:en`;
                const proxyUrl = `https://api.allorigins.win/get?url=${encodeURIComponent(rssUrl)}`;

                const response = await fetch(proxyUrl);
                const data = await response.json();

                if (data.contents) {
                    const parser = new DOMParser();
                    const xml = parser.parseFromString(data.contents, "text/xml");
                    const items = xml.querySelectorAll("item");

                    const newsItems: any[] = [];
                    items.forEach((item, index) => {
                        if (index < 10) { // Limit to 10 items
                            newsItems.push({
                                title: item.querySelector("title")?.textContent || "News Item",
                                link: item.querySelector("link")?.textContent || "#"
                            });
                        }
                    });
                    setNews(newsItems);
                }
            } catch (error) {
                console.error("Failed to fetch news:", error);
                // Fallback
                setNews([
                    { title: "Failed to load local news. Check connection.", link: "#" },
                    { title: "Tech: React 19 Released", link: "#" }
                ]);
                setLocation("Unknown");
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
