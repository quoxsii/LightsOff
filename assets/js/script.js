var box;
var width = 71;
var height = 71;
var time;
var count;
var measureTime;
var jsTimer;
var lampGray = "../img/gray.png";
var lampBlue = "../img/blue.png";
var dbcount;
var points;
var player = null;

function startGame() { // ПОДГОТОВКА ЭЛЕМЕНТОВ МЕНЮ К НАЧАЛУ ИГРЫ
    if (player != null) {
        if (!document.getElementById("field_name")) {
            document.getElementById("scores").style.display = "none";
            document.getElementById("gm_header").innerHTML =
                'Время: <span id="timer"></span>(с)\
		    	<br/>Количество ходов: <span id="counter"></span>\
		    	<br/><span id="win_msg" class="err_msg"><br/></span>';
            document.getElementById("btn_start").innerHTML = 'Заново';
            document.getElementById("square").innerHTML = "";

            if (!document.getElementById("btn_menu")) {
                var btn_menu = document.createElement("button");
                btn_menu.setAttribute("class", "btn");
                btn_menu.setAttribute("id", "btn_menu");
                btn_menu.style.width = document.getElementById("btn_start").style.width;
                btn_menu.setAttribute("onclick", "openMenu();");
                btn_menu.innerHTML = 'Меню';
                document.getElementById("gm_footer").appendChild(btn_menu);
            }

            prepareTable();
        } else {
            for (i = 0; i < dbcount; i++) {
                document.getElementById("field_name").remove();
                document.getElementById("field_score").remove();
                document.getElementById("field_time").remove();
                document.getElementById("field_points").remove();
            }
            startGame();
        }
    } else {
        var error = document.getElementById('err_setname');
        error.style.color = 'red';
        error.innerHTML = 'Введите ник-нейм';
    }
}

function checkResult() { // ПРОВЕРКА РЕЗУЛЬТАТА ПОСЛЕ ХОДА
    var dark = 0;
    var light = 0;
    var win_msg = document.getElementById("win_msg");
    for (i = 0; i < 5; i = i + 1) {
        for (j = 0; j < 5; j = j + 1) {
            if (box[i][j] == 1) { dark++; }
            if (box[i][j] == 0) { light++; }
        }
    }
    if (dark == 5 * 5) { // ПРОИГРЫШ
        measureTime = 0;
        window.clearInterval(jsTimer);
        win_msg.style.color = "red";
        win_msg.innerHTML = "Вы проиграли, попробуйте заново";
    }
    if (light == 5 * 5) { // ВЫИГРЫШ
        measureTime = 0;
        window.clearInterval(jsTimer);
        points = 10000 - (count + time);
        db.put({
            _id: `${dbcount}`,
            name: `${player}`,
            score: `${count}`,
            time: `${time}`,
            points: `${points}`
        });
        dbcount++;
        win_msg.style.color = "green";
        win_msg.innerHTML = "Вы выиграли, посмотрите результаты в таблице победителей";
    }
}

function nextMove(i, j) { // ФУНКЦИЯ ОТВЕЧАЮЩАЯ ЗА КАЖДЫЙ ХОД ИГРОКА
    if (measureTime == 0) {
        return false;
    }
    changeColor(i, j);
    if (j - 1 >= 0) changeColor(i, j - 1);
    if (j + 1 < 5) changeColor(i, j + 1);
    if (i - 1 >= 0) changeColor(i - 1, j);
    if (i + 1 < 5) changeColor(i + 1, j);

    var chance = Math.random(); // ВЕРОЯТНОСТЬ 1 К 25 НА ВЫКЛЮЧЕНИЕ ЛАМПОЧКИ
    if (chance < 0.04) {
        for (i = 0; i < 5; i = i + 1) {
            for (j = 0; j < 5; j = j + 1) {
                var img = document.getElementById("img" + i + j);
                if (box[i][j] == "1") {
                    img.setAttribute("src", lampGray);
                    box[i][j] = 0;
                    return 0;
                }
            }
        }
    }
    countMovements();
    checkResult();
}

function changeColor(i, j) { // ФУНКЦИЯ СМЕНЫ ЛАМПОЧКИ
    var img = document.getElementById("img" + i + j);
    if (box[i][j] == "1") {
        img.setAttribute("src", lampGray);
        box[i][j] = 0;
    } else {
        img.setAttribute("src", lampBlue);
        box[i][j] = 1;
    }
}

function prepareTable() { // ПОДГОТОВКА ПОЛЯ К ИГРЕ
    box = new Array(5);
    for (i = 0; i < 5; i = i + 1) {
        box[i] = new Array(5);
    }

    for (i = 0; i < 5; i = i + 1) {
        for (j = 0; j < 5; j = j + 1) {
            box[i][j] = 1; //Math.round(Math.random());
        }
    }

    var square = document.getElementById("square");
    for (i = 0; i < 5; i = i + 1) {
        for (j = 0; j < 5; j = j + 1) {
            var img = document.createElement("img");
            img.setAttribute("id", "img" + i + j);
            img.setAttribute("data-x", i);
            img.setAttribute("data-y", j);
            img.style.marginRight = "4px";
            if (box[i][j] == 1) {
                img.setAttribute("src", lampBlue);
            } else {
                img.setAttribute("src", lampGray);
            }
            img.setAttribute("width", width);
            img.setAttribute("height", height);
            img.setAttribute("onClick", "javascript:nextMove(" + i + "," + j + ");");
            square.appendChild(img);
        }
        var br = document.createElement("br");
        square.appendChild(br);
    }
    count = -1;
    countMovements();
    measureTime = 1;
    time = -1;
    startTimer();
    window.clearInterval(jsTimer);
    jsTimer = self.setInterval(startTimer, 1000);
}

function startTimer() { // СЕКУНДНЫЙ ТАЙМЕР
    if (measureTime == 1) {
        if (time >= 5000 || count >= 5000) {
            measureTime = 0;
            window.clearInterval(jsTimer);
            win_msg.style.color = "red";
            win_msg.innerHTML = "Вы проиграли, попробуйте заново";
        }
        time = time + 1;
        var timer = document.getElementById("timer");
        timer.innerHTML = time;
    }
}

function countMovements() { // СЧЁТЧИК ХОДОВ
    count = count + 1;
    var counter = document.getElementById("counter");
    counter.innerHTML = count;
}

function openMenu() { // ОТКРЫТИЕ МЕНЮ
    measureTime = 0;
    window.clearInterval(jsTimer);
    document.getElementById("btn_menu").remove();
    document.getElementById("scores").style.display = "block";
    document.getElementById("btn_start").innerHTML = 'Игарть';
    document.getElementById("gm_header").innerHTML = '';
    for (i = 0; i < 5; i = i + 1) {
        for (j = 0; j < 5; j = j + 1) {
            var img = document.getElementById("img" + i + j);
            img.remove();
        }
    }
    showScores(dbcount);
}

function showScores(count) { // ЗАПОЛНЕНИЕ ТАБЛИЦЫ ПОБЕДИТЕЛЕЙ
    dbcount = 0;
    for (i = 0; i < count; i++) {
        db.get(String(i)).then(function(doc) {
            if (doc._id != null) { dbcount++; }
            document.getElementById("tab_name").insertAdjacentHTML('beforeend', `<p id="field_name">${doc.name}</p>`);
            document.getElementById("tab_score").insertAdjacentHTML('beforeend', `<p id="field_score">${doc.score}</p>`);
            document.getElementById("tab_time").insertAdjacentHTML('beforeend', `<p id="field_time">${doc.time}</p>`);
            document.getElementById("tab_points").insertAdjacentHTML('beforeend', `<p id="field_points">${doc.points}</p>`);
            console.clear();
        });
    }
}

function setName() { // ПРОВЕРКА НИК-НЕЙМА
    var check = document.getElementById('pname').value;
    var error = document.getElementById('err_setname');

    if (/[^a-zA-Z0-9]/g.test(check)) {
        error.style.color = 'red';
        error.innerHTML = 'Только буквы латинского алфавита от Aa-Zz и цифры 0-9';
    } else if (check.length < 3 || check.length > 10) {
        error.style.color = 'red';
        error.innerHTML = 'Количество символов от 3 до 10';
    } else {
        error.style.color = 'green';
        error.innerHTML = 'Ник-нейм сохранён';
        player = check;
    }
}