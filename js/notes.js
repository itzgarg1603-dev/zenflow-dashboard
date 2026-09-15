(function () {
    "use strict";
    var state, selectedId = null, activeTag = "all", saveTimer;
    function get(id) { return document.getElementById(id); }
    function noteById(id) { return state.notes.find(function (note) { return note.id === id; }); }
    function renderList() {
        var list = get("notes-list-container"), query = get("notes-search").value.trim().toLowerCase();
        list.replaceChildren();
        state.notes.filter(function (note) {
            return (activeTag === "all" || note.tag === activeTag) &&
                (!query || (note.title + " " + note.body).toLowerCase().indexOf(query) >= 0);
        }).forEach(function (note) {
            var item = document.createElement("button");
            item.type = "button"; item.className = "note-list-card" + (note.id === selectedId ? " active" : "");
            item.addEventListener("click", function () { select(note.id); });
            var title = document.createElement("strong"); title.className = "note-list-title"; title.textContent = note.title || "Untitled Note";
            var snippet = document.createElement("span"); snippet.className = "note-list-snippet"; snippet.textContent = note.body || "Empty note";
            var meta = document.createElement("span"); meta.className = "note-list-meta"; meta.textContent = "#" + note.tag;
            item.append(title, snippet, meta); list.appendChild(item);
        });
        if (!list.children.length) list.appendChild(Object.assign(document.createElement("p"), { className: "empty-state", textContent: "No notes found." }));
    }
    function select(id) {
        selectedId = id; var note = noteById(id);
        get("notes-content-container").querySelector(".note-view-empty").style.display = note ? "none" : "";
        get("notes-content-container").querySelector(".note-editor").style.display = note ? "" : "none";
        if (note) { get("note-title-input").value = note.title; get("note-body-input").value = note.body; get("note-tag-select").value = note.tag; }
        renderList();
    }
    function newNote() {
        var note = { id: "note-" + Date.now(), title: "", body: "", tag: "general", updatedAt: new Date().toISOString() };
        state.notes.unshift(note); selectedId = note.id; window.app.save(); select(note.id); get("note-title-input").focus();
    }
    function scheduleSave() {
        var note = noteById(selectedId); if (!note) return;
        note.title = get("note-title-input").value; note.body = get("note-body-input").value; note.tag = get("note-tag-select").value; note.updatedAt = new Date().toISOString();
        get("note-save-status").textContent = "Saving...";
        window.clearTimeout(saveTimer);
        saveTimer = window.setTimeout(function () { window.app.save(); get("note-save-status").textContent = "Saved"; renderList(); }, 350);
    }
    function removeNote() {
        if (!selectedId || !window.confirm("Delete this note?")) return;
        state.notes = state.notes.filter(function (note) { return note.id !== selectedId; }); selectedId = null; window.app.save(); select(null);
    }
    function init() {
        state = window.app.getState();
        get("notes-search").addEventListener("input", renderList);
        get("btn-new-note").addEventListener("click", newNote); get("btn-create-first-note").addEventListener("click", newNote);
        ["note-title-input", "note-body-input", "note-tag-select"].forEach(function (id) { get(id).addEventListener("input", scheduleSave); get(id).addEventListener("change", scheduleSave); });
        get("btn-delete-note").addEventListener("click", removeNote);
        document.querySelectorAll(".tag-filter").forEach(function (filter) { filter.addEventListener("click", function () { activeTag = filter.dataset.tag; document.querySelectorAll(".tag-filter").forEach(function (item) { item.classList.toggle("active", item === filter); }); renderList(); }); });
        renderList(); select(null);
    }
    window.notesModule = { init: init, render: renderList };
}());
