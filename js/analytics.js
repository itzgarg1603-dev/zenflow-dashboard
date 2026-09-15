(function () {
    "use strict";
    var state, chart;
    function render() {
        if (!state) return;
        var completed = state.tasks.filter(function (task) { return task.status === "done"; }).length;
        var total = state.tasks.length;
        var minutes = state.focusHistory.reduce(function (sum, item) { return sum + Number(item.minutes || 0); }, 0);
        var today = new Date();
        var todayKey = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
        var overdue = state.tasks.filter(function (task) { return task.status !== "done" && task.dueDate && task.dueDate < todayKey; }).length;
        var dueToday = state.tasks.filter(function (task) { return task.status !== "done" && task.dueDate === todayKey; }).length;
        document.getElementById("stats-total-hours").textContent = (minutes / 60).toFixed(1) + "h";
        document.getElementById("stats-completed-tasks").textContent = String(completed);
        document.getElementById("stats-completion-rate").textContent = (total ? Math.round(completed / total * 100) : 0) + "%";
        document.getElementById("hero-focus-mins").textContent = String(minutes);
        var headline = document.querySelector(".analytics-headline p");
        if (headline) headline.textContent = "Track your productivity curves and focus metrics. " + overdue + " overdue, " + dueToday + " due today.";
        var labels = [], values = [], today = new Date();
        for (var i = 6; i >= 0; i -= 1) {
            var date = new Date(today); date.setHours(0, 0, 0, 0); date.setDate(today.getDate() - i);
            var key = date.toISOString().slice(0, 10); labels.push(date.toLocaleDateString([], { weekday: "short" }));
            values.push(state.focusHistory.filter(function (item) { return item.date.slice(0, 10) === key; }).reduce(function (sum, item) { return sum + Number(item.minutes || 0); }, 0));
        }
        var canvas = document.getElementById("focus-chart");
        if (window.Chart && canvas) {
            if (chart) chart.destroy();
            chart = new window.Chart(canvas, { type: "bar", data: { labels: labels, datasets: [{ label: "Focus minutes", data: values, backgroundColor: "rgba(123, 97, 255, .65)", borderColor: "#8b7aff", borderWidth: 1, borderRadius: 8 }] }, options: { responsive: true, maintainAspectRatio: false, plugins: { legend: { display: false } }, scales: { y: { beginAtZero: true, ticks: { color: "#9ca3af" }, grid: { color: "rgba(255,255,255,.06)" } }, x: { ticks: { color: "#9ca3af" }, grid: { display: false } } } } });
        }
    }
    function init() { state = window.app.getState(); render(); }
    window.analyticsModule = { init: init, render: render };
}());
