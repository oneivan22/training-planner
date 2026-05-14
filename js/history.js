// Показать историю тренировок
function showHistory() {
    var div = document.getElementById('historyList');
    if (!div) return;

    var hist = load('history');
    var empty = document.getElementById('emptyHistory');

    if (hist.length === 0) {
        empty.style.display = 'block';
        return;
    }
    empty.style.display = 'none';

    // Группируем по датам
    var groups = {};
    for (var i = 0; i < hist.length; i++) {
        var key = hist[i].date + ' (' + hist[i].day + ')';
        if (!groups[key]) groups[key] = [];
        groups[key].push(hist[i]);
    }

    var h = '';
    var keys = Object.keys(groups);
    for (var k = keys.length - 1; k >= 0; k--) {
        h += '<div class="history-day">';
        h += '<h3>' + keys[k] + '</h3>';
        var items = groups[keys[k]];
        for (var j = 0; j < items.length; j++) {
            var repsStr = items[j].reps && items[j].reps.length ? items[j].reps.join(', ') : 'не указано';
            h += '<div class="history-item">';
            h += items[j].name + ' — ' + items[j].sets + ' подх., ' + items[j].weight + ' кг (повт: ' + repsStr + ')';
            h += '</div>';
        }
        h += '</div>';
    }

    div.innerHTML = h;
}

// Очистить всю историю
function clearHistory() {
    if (!confirm('Удалить всю историю?')) return;
    save('history', []);
    showHistory();
}