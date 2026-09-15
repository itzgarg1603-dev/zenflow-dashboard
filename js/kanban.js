(function () {
    "use strict";
    var state;
    var statusNames = ["todo", "progress", "done"];
    function el(tag, className, text) {
        var node = document.createElement(tag);
        if (className) node.className = className;
        if (text !== undefined) node.textContent = text;
        return node;
    }
    function render() {
        statusNames.forEach(function (status) {
            var container = document.getElementById("cards-" + status);
            var count = document.getElementById("count-" + status);
            if (!container) return;
            container.replaceChildren();
            var tasks = state.tasks.filter(function (task) { return task.status === status; }).sort(function (a, b) {
                if (!a.dueDate && !b.dueDate) return 0;
                if (!a.dueDate) return 1;
                if (!b.dueDate) return -1;
                return a.dueDate.localeCompare(b.dueDate);
            });
            if (count) count.textContent = String(tasks.length);
            tasks.forEach(function (task) {
                var dueState = getDueState(task);
                var card = el("article", "task-card" + (dueState ? " task-" + dueState : ""));
                card.draggable = true;
                card.dataset.taskId = task.id;
                card.addEventListener("dragstart", function (event) {
                    event.dataTransfer.setData("text/plain", task.id);
                    card.classList.add("dragging");
                });
                card.addEventListener("dragend", function () { card.classList.remove("dragging"); });
                var meta = el("div", "task-card-meta");
                meta.appendChild(el("span", "card-priority " + task.priority, task.priority + " priority"));
                meta.appendChild(el("span", "card-tag", "#" + task.tag));
                if (task.dueDate) meta.appendChild(el("span", "card-due " + dueState, dueLabel(task.dueDate, dueState)));
                card.appendChild(meta);
                card.appendChild(el("h4", "", task.title));
                var actions = el("div", "task-card-actions");
                statusNames.filter(function (next) { return next !== status; }).forEach(function (next) {
                    var button = el("button", "task-action", next === "done" ? "Complete" : next === "progress" ? "Start" : "To Do");
                    button.type = "button";
                    button.addEventListener("click", function () { move(task.id, next); });
                    actions.appendChild(button);
                });
                var remove = el("button", "task-action task-delete", "Delete");
                remove.type = "button";
                remove.addEventListener("click", function () { state.tasks = state.tasks.filter(function (item) { return item.id !== task.id; }); save(); });
                actions.appendChild(remove);
                card.appendChild(actions);
                container.appendChild(card);
            });
        });
        renderMiniTasks();
        if (window.analyticsModule) window.analyticsModule.render();
        if (window.lucide) window.lucide.createIcons();
    }
    function renderMiniTasks() {
        var container = document.getElementById("mini-task-container");
        if (!container) return;
        container.replaceChildren();
        var pending = state.tasks.filter(function (task) { return task.status !== "done"; }).sort(compareDueDates).slice(0, 4);
        if (!pending.length) { container.appendChild(el("p", "empty-state", "No pending tasks today. Sit back and relax!")); return; }
        pending.forEach(function (task) {
            var row = el("div", "mini-task-row");
            row.appendChild(el("span", "mini-task-dot " + task.priority));
            row.appendChild(el("span", "", task.title));
            if (task.dueDate) row.appendChild(el("span", "mini-task-due " + getDueState(task), dueLabel(task.dueDate, getDueState(task))));
            container.appendChild(row);
        });
    }
    function compareDueDates(a, b) {
        if (!a.dueDate && !b.dueDate) return 0;
        if (!a.dueDate) return 1;
        if (!b.dueDate) return -1;
        return a.dueDate.localeCompare(b.dueDate);
    }
    function getDueState(task) {
        if (!task.dueDate || task.status === "done") return "";
        var today = new Date();
        var todayKey = today.getFullYear() + "-" + String(today.getMonth() + 1).padStart(2, "0") + "-" + String(today.getDate()).padStart(2, "0");
        return task.dueDate < todayKey ? "overdue" : task.dueDate === todayKey ? "today" : "upcoming";
    }
    function dueLabel(value, dueState) {
        if (dueState === "overdue") return "Overdue";
        if (dueState === "today") return "Due today";
        var parsed = new Date(value + "T00:00:00");
        return "Due " + parsed.toLocaleDateString([], { month: "short", day: "numeric" });
    }
    function move(id, status) {
        var task = state.tasks.find(function (item) { return item.id === id; });
        if (task) { task.status = status; save(); }
    }
    function save() { window.app.save(); render(); }
    function closeModal() { var modal = document.getElementById("task-modal"); if (modal) modal.classList.remove("active"); }
    function createTask() {
        var title = document.getElementById("task-title-input").value.trim();
        if (!title) { document.getElementById("task-title-input").focus(); return; }
        state.tasks.push({
            id: "task-" + Date.now(), title: title, priority: document.getElementById("task-priority-select").value,
            tag: document.getElementById("task-tag-select").value, status: "todo", createdAt: new Date().toISOString()
        });
        state.tasks[state.tasks.length - 1].dueDate = document.getElementById("task-due-date-input").value;
        document.getElementById("task-title-input").value = "";
        document.getElementById("task-due-date-input").value = "";
        closeModal(); save();
    }
    function init() {
        state = window.app.getState();
        var modal = document.getElementById("task-modal");
        document.getElementById("btn-add-task").addEventListener("click", function () { modal.classList.add("active"); document.getElementById("task-title-input").focus(); });
        ["modal-close-task", "modal-cancel-task"].forEach(function (id) { document.getElementById(id).addEventListener("click", closeModal); });
        document.getElementById("modal-save-task").addEventListener("click", createTask);
        document.getElementById("task-title-input").addEventListener("keydown", function (event) { if (event.key === "Enter") createTask(); });
        document.querySelectorAll(".kanban-column").forEach(function (column) {
            column.addEventListener("dragover", function (event) { event.preventDefault(); });
            column.addEventListener("drop", function (event) { event.preventDefault(); move(event.dataTransfer.getData("text/plain"), column.dataset.status); });
        });
        render();
    }
    window.kanbanModule = { init: init, render: render };
}());
