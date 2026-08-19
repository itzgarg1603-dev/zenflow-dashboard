# 🌌 ZenFlow

**ZenFlow** is an aesthetic, glassmorphic Personal Productivity & Focus Dashboard. Built completely using standard frontend web technologies (HTML, Vanilla CSS, and JavaScript), it features clean widgets, task boards, notes tracking, focus clocks, and performance curves. 

Because ZenFlow is entirely static, it loads instantly and can be deployed directly to **GitHub Pages** with zero build configuration!

---

## ✨ Features

- **🌙 Glassmorphic Dark UI**: Premium design theme utilizing HSL color coordinates, smooth gradients, subtle card highlight borders, and responsive desktop/tablet/mobile styling.
- **🧭 Centralized Dashboard**: Dynamic time, greeting, simulated environment weather states, quick focus control, pending tasks preview, and motivational quotes.
- **📋 Kanban Task Board**: Organize work using column states (`To Do`, `In Progress`, `Completed`) with support for both HTML5 drag-and-drop and touch/click controls.
- **📓 Zen Notes**: Write, search, tag filter, and delete notes. Features automatic background saving with debounced local storage writes and category indicators.
- **⏳ Pomodoro Focus Clock**: A visual circular countdown timer with work, short break, and long break states. Focus sessions completed automatically log minutes to your stats.
- **🔊 Native Audio Synthesis**: Utilizes the browser's Web Audio API to play pleasant Tibetan chime bells when focus ends, and loops a relaxing white noise ambient soundscape directly from raw code—no external media files required.
- **📊 Interactive Analytics**: Integrated stats tracker showing total focus hours, task completion rate, and a weekly progress bar chart powered by Chart.js.
- **💾 Local Storage Persistence**: Saves all your settings, notes, tasks, and timer history directly to your browser's local sandbox, keeping your data private.

---

## 🚀 Getting Started

### Option A: Direct Launch (No Setup)
1. Download or clone this project folder.
2. Locate the [index.html](index.html) file.
3. Double-click it to open ZenFlow directly in your preferred web browser.

### Option B: Local Web Server
For a smoother experience (especially for Web Audio permissions), run a quick local web server:
- **Python**: Run `python -m http.server 8000` in the directory. Open `http://localhost:8000`.
- **Node.js**: Run `npx serve` or `npm install -g serve` and open the local port.

---

## 🌐 Deploying to GitHub Pages

You can host ZenFlow for free on the web under your own domain using GitHub Pages. Follow these simple steps:

### 1. Create a GitHub Repository
1. Log in to [GitHub](https://github.com).
2. Click the **New** button to create a new repository.
3. Name your repository (e.g., `zenflow-dashboard`).
4. Set visibility to **Public** (required for free GitHub Pages).
5. Leave "Initialize this repository with a README" unchecked, then click **Create Repository**.

### 2. Push Code from Your Computer
Open a terminal in the folder `C:/Users/Loq/.gemini/antigravity-ide/scratch/zenflow-dashboard` and run:

```bash
# Initialize a local Git repository
git init

# Add all files to the repository
git add .

# Create the initial commit
git commit -m "initial commit: release ZenFlow dashboard"

# Rename default branch to main
git branch -M main

# Link your local folder to GitHub (replace with your repository URL)
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/zenflow-dashboard.git

# Push your code to GitHub
git push -u origin main
```

### 3. Turn on GitHub Pages hosting
1. Navigate to your new repository page on GitHub.
2. Click the **Settings** tab at the top.
3. In the left sidebar under the "Code and automation" section, click **Pages**.
4. Under **Build and deployment**:
   - Set **Source** to `Deploy from a branch`.
   - Under **Branch**, select `main` and folder `/ (root)`.
   - Click the **Save** button.
5. Wait 1–2 minutes. Refresh the page, and you will see a banner at the top saying:
   > **Your site is live at** `https://YOUR_GITHUB_USERNAME.github.io/zenflow-dashboard/`

Click the link, and your dashboard is live for anyone to use!

---

## 🛠️ Built With

- **HTML5 & CSS3**: Core grid layouts, keyframes, transitions, and glassmorphic backdrops.
- **JavaScript (ES6)**: State routers, debounced auto-saves, and localStorage managers.
- **Lucide Icons**: Feather-weight SVG stroke outline icons.
- **Chart.js**: Clean responsive charts.
- **Web Audio API**: Real-time sound synthesis for focus bell rings and soft white noise.
