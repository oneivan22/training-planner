// Открыть окно добавления упражнения
function openModal(day) {
    document.getElementById('addModal').style.display = 'block';
    document.getElementById('modalTitle').textContent = 'Добавить упражнение — ' + day;
    document.getElementById('currentDay').value = day;
    document.getElementById('addForm').reset();
    document.getElementById('repsBlock').innerHTML = '';
    document.getElementById('successMsg').style.display = 'none';
}

// Закрыть окно
function closeModal() {
    document.getElementById('addModal').style.display = 'none';
}

// Создать поля для повторений каждого подхода
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

// Обработка формы добавления
function setupAddForm() {
    var form = document.getElementById('addForm');
    if (!form) return;

    form.onsubmit = function(e) {
        e.preventDefault();

        var name = document.getElementById('exName').value.trim();
        var sets = parseInt(document.getElementById('exSets').value);
        var weight = parseInt(document.getElementById('exWeight').value);
        var day = document.getElementById('currentDay').value;

        // Проверка полей
        if (!name) { alert('Введите название'); return; }
        if (sets < 1 || isNaN(sets)) { alert('Подходов должно быть больше 0'); return; }
        if (weight < 0 || isNaN(weight)) { alert('Вес от 0'); return; }

        // Собираем повторения
        var repsInputs = document.getElementsByClassName('repVal');
        var reps = [];
        for (var i = 0; i < repsInputs.length; i++) {
            var v = parseInt(repsInputs[i].value);
            if (v < 1 || isNaN(v)) { alert('Заполните все повторения'); return; }
            reps.push(v);
        }

        // Сохраняем упражнение
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

        // Очистка формы
        document.getElementById('addForm').reset();
        document.getElementById('repsBlock').innerHTML = '';
        var msg = document.getElementById('successMsg');
        msg.style.display = 'block';
        setTimeout(function() { msg.style.display = 'none'; }, 1500);
        showPlan();
    };
}