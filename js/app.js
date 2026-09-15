(function () {
    "use strict";

    var STORAGE_KEY = "zenflow-state";
    var quotes = [
        ["Simplicity is the ultimate sophistication.", "Leonardo da Vinci"],
        ["The secret of getting ahead is getting started.", "Mark Twain"],
        ["Almost everything will work again if you unplug it for a few minutes.", "Anne Lamott"],
        ["Focus on being productive instead of busy.", "Tim Ferriss"],
        ["Nature does not hurry, yet everything is accomplished.", "Lao Tzu"]
    ];
    var defaultState = {
        tasks: [],
        notes: [],
        focusHistory: [],
        quoteIndex: 0,
        timer: { mode: "work", sessions: 1, sound: true, ambient: false }
    };
    var state = loadState();
    var app = window.app || {};

    function clone(value) {
        return JSON.parse(JSON.stringify(value));
    }

    function loadState() {
        try {
            var saved = JSON.parse(window.localStorage.getItem(STORAGE_KEY) || "null");
            return Object.assign(clone(defaultState), saved || {}, {
                timer: Object.assign({}, defaultState.timer, saved && saved.timer ? saved.timer : {})
            });
        } catch (error) {
            return clone(defaultState);
        }
    }

    function saveState() {
        try {
            window.localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
        } catch (error) {
            // Private browsing and blocked storage should not stop the dashboard.
        }
    }

    function byId(id) { return document.getElementById(id); }
    function setText(id, text) { var element = byId(id); if (element) element.textContent = text; }

    function updateClock() {
        var now = new Date();
        var hour = now.getHours();
        var greeting = hour < 12 ? "Good morning" : hour < 18 ? "Good afternoon" : "Good evening";
        setText("dynamic-greeting", greeting + ", friend");
        setText("dynamic-subtitle", hour < 12 ? "A fresh day is ready for your best focus." : "Take a breath and find your flow.");
        setText("clock-time", now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
        setText("clock-date", now.toLocaleDateString([], { weekday: "long", month: "long", day: "numeric" }));
    }

    function setQuote(index) {
        state.quoteIndex = typeof index === "number" ? index : Math.floor(Math.random() * quotes.length);
        var quote = quotes[state.quoteIndex % quotes.length];
        setText("quote-content", '"' + quote[0] + '"');
        setText("quote-author", quote[1]);
        saveState();
    }

    function switchView(view) {
        document.querySelectorAll(".view-pane").forEach(function (pane) {
            pane.classList.toggle("active", pane.id === "view-" + view);
        });
        document.querySelectorAll(".nav-item").forEach(function (item) {
            item.classList.toggle("active", item.getAttribute("data-view") === view);
        });
        if (view === "analytics" && window.analyticsModule) window.analyticsModule.render();
        if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
    }

    function setupNavigation() {
        document.querySelectorAll(".nav-item").forEach(function (item) {
            item.addEventListener("click", function () { switchView(item.getAttribute("data-view")); });
        });
        var quoteButton = byId("quote-refresh");
        if (quoteButton) quoteButton.addEventListener("click", function () { setQuote(); });
    }

    function init() {
        window.zenflowState = state;
        setupNavigation();
        updateClock();
        window.setInterval(updateClock, 1000);
        setQuote(state.quoteIndex);
        setText("weather-location", "Zen Garden");
        setText("weather-temp", "24°C");
        setText("weather-desc", "Perfect for meditation");
        setText("weather-wind", "Gentle breeze");
        if (window.kanbanModule) window.kanbanModule.init();
        if (window.notesModule) window.notesModule.init();
        if (window.pomodoroModule) window.pomodoroModule.init();
        if (window.analyticsModule) window.analyticsModule.init();
        if (window.lucide && typeof window.lucide.createIcons === "function") window.lucide.createIcons();
    }

    app.init = init;
    app.switchView = switchView;
    app.getState = function () { return state; };
    app.save = saveState;
    app.setQuote = setQuote;
    window.app = app;
    window.zenflow = { state: state, save: saveState, byId: byId, setText: setText };
}());
