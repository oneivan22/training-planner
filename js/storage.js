// Читаем данные из localStorage
function load(name) {
    var d = localStorage.getItem(name);
    return d ? JSON.parse(d) : [];
}

// Сохраняем данные в localStorage
function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}