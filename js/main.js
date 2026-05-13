var days = ['Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота', 'Воскресенье'];

function load(name) {
    var d = localStorage.getItem(name);
    return d ? JSON.parse(d) : [];
}
function save(name, data) {
    localStorage.setItem(name, JSON.stringify(data));
}

// ГЛАВНАЯ
function showPlan() {
    var div = document.getElementById('weekPlan');
    if (!div) return;

    var exs = load('exercises');
    var h = '';

    for (var d = 0; d < days.length; d++) {
        var day = days[d];
        var list = [];

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
                var repsStr = '';

                if (e.reps && e.reps.length) {
                    repsStr = e.reps.join(', ');
                } else {
                    repsStr = 'не указано';
                }

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

function finish(day) {
    var exs = load('exercises');
    var doneList = [];
    var rest = [];

    var allThisDay = 0;

    for (var i = 0; i < exs.length; i++) {
        if (exs[i].day === day) {
            allThisDay++;
            if (exs[i].done) {
                doneList.push(exs[i]);
            } else {
                rest.push(exs[i]);
            }
        } else {
            rest.push(exs[i]);
        }
    }

    if (allThisDay === 0) {
        alert('В этот день нет упражнений!');
        return;
    }

    if (doneList.length === 0) {
        alert('Нет выполненных упражнений!');
        return;
    }

    if (doneList.length < allThisDay) {
        alert('Не все упражнения выполнены! Сначала выполните все.');
        return;
    }

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

// МОДАЛЬНОЕ ОКНО
function openModal(day) {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Добавить упражнение — ' + day;
    document.getElementById('currentDay').value = day;
    document.getElementById('addForm').reset();
    document.getElementById('repsBlock').innerHTML = '';
    document.getElementById('successMsg').style.display = 'none';
}

function closeModal() {
    document.getElementById('addModal').style.display = 'none';
}

function makeRepsInputs() {
    var sets = parseInt(document.getElementById('exSets').value);
    var div = document.getElementById('repsBlock');
    div.innerHTML = '';

    if (!sets || sets < 1) return;

    var h = '<label style="font-weight:bold;">Повторения по подходам:</label>';
    for (var i = 1; i <= sets; i++) {
        h += '<div class="reps-row">';
        h += '<label>Подход ' + i + ':</label>';
        h += '<input type="number" class="repVal" min="1" value="8" required>';
        h += '</div>';
    }
    div.innerHTML = h;
}

document.addEventListener('DOMContentLoaded', function() {
    var inp = document.getElementById('exSets');
    if (inp) {
        inp.oninput = makeRepsInputs;
    }

    var form = document.getElementById('addForm');
    if (form) {
        form.onsubmit = function(e) {
            e.preventDefault();

            var name = document.getElementById('exName').value.trim();
            var sets = parseInt(document.getElementById('exSets').value);
            var weight = parseInt(document.getElementById('exWeight').value);
            var day = document.getElementById('currentDay').value;

            if (!name) { alert('Введите название'); return; }
            if (sets < 1 || isNaN(sets)) { alert('Подходов должно быть больше 0'); return; }
            if (weight < 0 || isNaN(weight)) { alert('Вес от 0'); return; }

            var repsInputs = document.getElementsByClassName('repVal');
            var reps = [];
            for (var i = 0; i < repsInputs.length; i++) {
                var v = parseInt(repsInputs[i].value);
                if (v < 1 || isNaN(v)) { alert('Заполните все повторения'); return; }
                reps.push(v);
            }

            var exs = load('exercises');
            exs.push({
                id: Date.now().toString(),
                day: day,
                name: name,
                sets: sets,
                reps: reps,
                weight: weight,
                done: false
            });
            save('exercises', exs);

            document.getElementById('addForm').reset();
            document.getElementById('repsBlock').innerHTML = '';
            var msg = document.getElementById('successMsg');
            msg.style.display = 'block';
            setTimeout(function() { msg.style.display = 'none'; }, 1500);
            showPlan();
        };
    }

    var calcForm = document.getElementById('calcForm');
    if (calcForm) {
        calcForm.onsubmit = function(e) {
            e.preventDefault();
            var w = parseFloat(document.getElementById('calcWeight').value);
            var r = parseFloat(document.getElementById('calcReps').value);

            if (w <= 0 || r < 1 || isNaN(w) || isNaN(r)) {
                alert('Введите корректные значения');
                return;
            }

            var formulas = [
                { name: 'Формула Эпли',     val: w * (1 + r / 30) },
                { name: 'Формула Бжицки',   val: w * (36 / (37 - r)) },
                { name: 'Формула Лэндера',  val: (100 * w) / (101.3 - 2.67123 * r) },
                { name: 'Формула Ломбарди', val: w * Math.pow(r, 0.1) },
                { name: 'Формула Мэйхью',   val: (100 * w) / (52.2 + (41.9 * Math.exp(-0.055 * r))) },
                { name: "Формула О'Коннор", val: w * (1 + 0.025 * r) },
                { name: 'Формула Ватана',   val: (100 * w) / (48.8 + (53.8 * Math.exp(-0.075 * r))) }
            ];

            var sum = 0;
            for (var i = 0; i < formulas.length; i++) sum += formulas[i].val;
            var avg = Math.round(sum / formulas.length);

            var h = '<div class="result-box">';
            h += '<h3>Максимальный вес: <span style="color:#4a90d9;">' + avg + ' кг</span></h3>';
            for (var i = 0; i < formulas.length; i++) {
                h += '<p class="result-formula">' + formulas[i].name + ': <strong>' + Math.round(formulas[i].val) + ' кг</strong></p>';
            }
            h += '</div>';

            document.getElementById('calcResult').innerHTML = h;
        };
    }

    showPlan();
    showHistory();
});

// ИСТОРИЯ
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
            var repsStr = '';
            if (items[j].reps && items[j].reps.length) {
                repsStr = items[j].reps.join(', ');
            } else {
                repsStr = 'не указано';
            }
            h += '<div class="history-item">';
            h += items[j].name + ' — ' + items[j].sets + ' подх., ' + items[j].weight + ' кг (повт: ' + repsStr + ')';
            h += '</div>';
        }
        h += '</div>';
    }

    div.innerHTML = h;
}

function clearHistory() {
    if (!confirm('Удалить всю историю?')) return;
    save('history', []);
    showHistory();
}