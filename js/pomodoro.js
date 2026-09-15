(function () {
    "use strict";
    var state, mode = "work", totalSeconds = 1500, remaining = 1500, running = false, interval = null, audioContext = null;
    var durations = { work: 25, short: 5, long: 15 };
    function text(id, value) { var node = document.getElementById(id); if (node) node.textContent = value; }
    function format(seconds) { return String(Math.floor(seconds / 60)).padStart(2, "0") + ":" + String(seconds % 60).padStart(2, "0"); }
    function render() {
        var value = format(remaining); text("timer-large-time", value); text("mini-timer-time", value);
        text("timer-active-state", mode === "work" ? "Work Focus" : mode === "short" ? "Short Break" : "Long Break");
        text("mini-timer-state", running ? "Focusing" : "Ready");
        text("timer-session-count", "Session #" + state.timer.sessions);
        var progress = document.getElementById("timer-progress-svg"); if (progress) {
            progress.style.strokeDasharray = "552.9";
            progress.style.strokeDashoffset = String(552.9 * (1 - remaining / totalSeconds));
        }
        document.querySelectorAll(".btn-preset").forEach(function (button) { button.classList.toggle("active", button.dataset.mode === mode); });
        if (window.lucide) window.lucide.createIcons();
    }
    function tone() {
        if (!state.timer.sound || !window.AudioContext && !window.webkitAudioContext) return;
        try {
            var AudioCtor = window.AudioContext || window.webkitAudioContext; audioContext = audioContext || new AudioCtor();
            var oscillator = audioContext.createOscillator(), gain = audioContext.createGain();
            oscillator.frequency.value = 660; gain.gain.setValueAtTime(0.0001, audioContext.currentTime); gain.gain.exponentialRampToValueAtTime(0.18, audioContext.currentTime + 0.02); gain.gain.exponentialRampToValueAtTime(0.0001, audioContext.currentTime + 0.8);
            oscillator.connect(gain).connect(audioContext.destination); oscillator.start(); oscillator.stop(audioContext.currentTime + 0.8);
        } catch (error) { /* Audio is an optional enhancement. */ }
    }
    function finish() {
        running = false; window.clearInterval(interval); interval = null; tone();
        if (mode === "work") { state.focusHistory.push({ date: new Date().toISOString(), minutes: durations.work }); state.timer.sessions += 1; window.app.save(); }
        setMode(mode === "work" ? "short" : "work"); if (window.analyticsModule) window.analyticsModule.render();
    }
    function toggle() {
        running = !running;
        if (running) interval = window.setInterval(function () { remaining -= 1; if (remaining <= 0) { remaining = 0; finish(); } render(); }, 1000);
        else window.clearInterval(interval);
        render();
    }
    function setMode(next) { mode = next; totalSeconds = durations[next] * 60; remaining = totalSeconds; state.timer.mode = next; window.app.save(); render(); }
    function reset() { running = false; window.clearInterval(interval); remaining = totalSeconds; render(); }
    function skip() { running = false; window.clearInterval(interval); setMode(mode === "work" ? "short" : "work"); }
    function init() {
        state = window.app.getState(); mode = state.timer.mode || "work"; totalSeconds = durations[mode] * 60; remaining = totalSeconds;
        document.getElementById("timer-btn-toggle").addEventListener("click", toggle); document.getElementById("mini-timer-toggle").addEventListener("click", toggle);
        document.getElementById("timer-btn-reset").addEventListener("click", reset); document.getElementById("timer-btn-skip").addEventListener("click", skip);
        document.getElementById("timer-sound-enable").checked = state.timer.sound !== false;
        document.getElementById("timer-sound-enable").addEventListener("change", function (event) { state.timer.sound = event.target.checked; window.app.save(); });
        document.getElementById("timer-ambient-enable").addEventListener("change", function (event) { state.timer.ambient = event.target.checked; window.app.save(); });
        document.querySelectorAll(".btn-preset").forEach(function (button) { button.addEventListener("click", function () { setMode(button.dataset.mode); }); }); render();
    }
    window.pomodoroModule = { init: init, render: render };
}());
