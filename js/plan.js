var days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

// Рисуем все дни с упражнениями
function showPlan() {
    var div = document.getElementById('weekPlan');
    if (!div) return;

    var exs = load('exercises');
    var h = '';

    for (var d = 0; d < days.length; d++) {
        var day = days[d];
        var list = [];

        // Собираем упражнения для этого дня
        for (var i = 0; i < exs.length; i++) {
            if (exs[i].day === day) list.push(exs[i]);
        }

        h += '<div class="day-block">';
        h += '<div class="day-header">';
        h += '<h3>' + day + '</h3>';
        h += '<button class="btn btn-blue btn-small" onclick="openModal(\'' + day + '\')">+ Добавить</button>';
        h += '</div>';

        if (list.length === 0) {
            h += '<p style="color:#999;">Нет упражнений</p>';
        } else {
            for (var j = 0; j < list.length; j++) {
                var e = list[j];
                var done = e.done ? '✅' : '';
                var btnText = e.done ? 'Отменить' : '✓ Выполнено';
                var repsStr = e.reps && e.reps.length ? e.reps.join(', ') : 'не указано';

                h += '<div class="exercise-card">';
                h += '<div class="exercise-info">';
                h += '<strong>' + e.name + '</strong> — ' + e.sets + ' подх., ' + e.weight + ' кг ' + done;
                h += '<div class="exercise-detail">Повторения: ' + repsStr + '</div>';
                h += '</div>';
                h += '<div>';
                h += '<button class="btn btn-green btn-small" onclick="toggle(\'' + e.id + '\')">' + btnText + '</button> ';
                h += '<button class="btn btn-red btn-small" onclick="del(\'' + e.id + '\')">Удалить</button>';
                h += '</div>';
                h += '</div>';
            }

            h += '<button class="btn btn-orange btn-small" onclick="finish(\'' + day + '\')">Завершить тренировку</button>';
        }

        h += '</div>';
    }

    div.innerHTML = h;
}

// Отметить упражнение как выполненное
function toggle(id) {
    var exs = load('exercises');
    for (var i = 0; i < exs.length; i++) {
        if (exs[i].id === id) {
            exs[i].done = !exs[i].done;
            break;
        }
    }
    save('exercises', exs);
    showPlan();
}

// Удалить упражнение
function del(id) {
    if (!confirm('Удалить упражнение?')) return;
    var exs = load('exercises');
    var n = [];
    for (var i = 0; i < exs.length; i++) {
        if (exs[i].id !== id) n.push(exs[i]);
    }
    save('exercises', n);
    showPlan();
}

// Завершить тренировку дня — перенести в историю
function finish(day) {
    var exs = load('exercises');
    var doneList = [];
    var rest = [];
    var allThisDay = 0;

    for (var i = 0; i < exs.length; i++) {
        if (exs[i].day === day) {
            allThisDay++;
            if (exs[i].done) doneList.push(exs[i]);
            else rest.push(exs[i]);
        } else {
            rest.push(exs[i]);
        }
    }

    if (allThisDay === 0) { alert('В этот день нет упражнений!'); return; }
    if (doneList.length === 0) { alert('Нет выполненных упражнений!'); return; }
    if (doneList.length < allThisDay) { alert('Не все упражнения выполнены!'); return; }
    if (!confirm('Завершить тренировку за ' + day + '?')) return;

    var hist = load('history');
    var now = new Date();
    var dateStr = now.getDate() + '.' + (now.getMonth() + 1) + '.' + now.getFullYear();

    for (var i = 0; i < doneList.length; i++) {
        hist.push({
            date: dateStr,
            day: doneList[i].day,
            name: doneList[i].name,
            sets: doneList[i].sets,
            reps: doneList[i].reps || [],
            weight: doneList[i].weight
        });
    }

    save('history', hist);
    save('exercises', rest);
    alert('Тренировка завершена!');
    showPlan();
}