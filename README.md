# Orbit Dashboard - https://orbitdashboard.netlify.app/

A futuristic, dark-themed personal dashboard meant to be your "home base" on the web. It features a stunning glassmorphism UI, real-time widgets, and a dynamic animated background.

![Orbit Dashboard Screenshot](./public/screenshot.png) 
*(Note: Add a screenshot here if you have one)*

## 🚀 Features

-   **Orbit UI**: A sleek, dark-themed interface with a radial gradient background and premium glassmorphism cards.
-   **Smart News Widget**:
    -   Automatically detects your city (e.g., "Bengaluru") via IP.
    -   Fetches **real-time local news** from Google News.
    -   Falls back to trending tech news if offline.
-   **Productivity Hub**:
    -   **Tasks**: Simple to-do list with persistence.
    -   **Notes**: Chat-style quick notes.
-   **Bouncing Tech Icons**: A "screensaver-style" animated background with floating icons (React, Python, etc.).
-   **Essential Widgets**:
    -   Real-time **Clock**.
    -   **Weather** updates.
    -   **Spotify** integration.

## 🛠️ Tech Stack

-   **Frontend**: React (v19), TypeScript, Vite
-   **Styling**: Vanilla CSS (Variables, Grid, Flexbox)
-   **Icons**: Lucide React
-   **Fonts**: Outfit, Space Grotesk, Syne (via Google Fonts)

## 📦 Installation

1.  Clone the repository:
    ```bash
    git clone https://github.com/Silentcodr/Project-Clock.git
    ```
2.  Install dependencies:
    ```bash
    cd Project-Clock
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```

## 🚀 Deployment

The project is configured for **Netlify**.
1.  Import this repository into Netlify.
2.  The `netlify.toml` file will automatically configure the build settings (`npm run build`).

## 📄 License

MIT by [Silentcodr](https://github.com/Silentcodr)
