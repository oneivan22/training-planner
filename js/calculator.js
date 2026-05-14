// Настроить калькулятор жима
function setupCalculator() {
    var form = document.getElementById('calcForm');
    if (!form) return;

    form.onsubmit = function(e) {
        e.preventDefault();
        var w = parseFloat(document.getElementById('calcWeight').value);
        var r = parseFloat(document.getElementById('calcReps').value);

        if (w <= 0 || r < 1 || isNaN(w) || isNaN(r)) {
            alert('Введите корректные значения');
            return;
        }

        // 7 формул расчёта максимума
        var formulas = [
            { name: 'Формула Эпли',     val: w * (1 + r / 30) },
            { name: 'Формула Бжицки',   val: w * (36 / (37 - r)) },
            { name: 'Формула Лэндера',  val: (100 * w) / (101.3 - 2.67123 * r) },
            { name: 'Формула Ломбарди', val: w * Math.pow(r, 0.1) },
            { name: 'Формула Мэйхью',   val: (100 * w) / (52.2 + (41.9 * Math.exp(-0.055 * r))) },
            { name: "Формула О'Коннор", val: w * (1 + 0.025 * r) },
            { name: 'Формула Ватана',   val: (100 * w) / (48.8 + (53.8 * Math.exp(-0.075 * r))) }
        ];

        // Среднее значение
        var sum = 0;
        for (var i = 0; i < formulas.length; i++) sum += formulas[i].val;
        var avg = Math.round(sum / formulas.length);

        // Вывод результата
        var h = '<div class="result-box">';
        h += '<h3>Максимальный вес: <span style="color:#4a90d9;">' + avg + ' кг</span></h3>';
        for (var i = 0; i < formulas.length; i++) {
            h += '<p class="result-formula">' + formulas[i].name + ': <strong>' + Math.round(formulas[i].val) + ' кг</strong></p>';
        }
        h += '</div>';

        document.getElementById('calcResult').innerHTML = h;
    };
}