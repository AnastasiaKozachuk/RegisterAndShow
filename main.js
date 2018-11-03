$("#button").click(function () {

    var validate = true;

    var login = $("#login").val();
    var password = $("#password").val();
    var pas_confirm = $("#confirm_password").val();
    var email = $("#email").val();

    if (!$.trim(login).length || !$.trim(password).length) {
        alert("Логін та пароль не повинні бути пустими");
        validate = false;
    }

    if (password != pas_confirm) {
        alert("Паролі не співпадають");
        validate = false;
    }

    var pattern = /^\b[A-Z0-9._%-]+@[A-Z0-9.-]+\.[A-Z]{2,4}\b$/i;

    if (!pattern.test(email)) {
        alert("Введена пошта є некоректною");
        validate = false;
    }

    if (validate) {

        $.post("http://localhost:8888/saveUser", {
            login: login,
            password: password,
            email: email
        }).done(function (data) {
            $('#table').empty();
            fillTable();
        });

    }

});

function filterJson(data) {

    var i = data.length - 1;
    for (i; i >= 0; i--) {
        delete data[i]["__v"];
        delete data[i]["_id"];
    }
    return data;
}


function fillTable() {
    $.get("http://localhost:8888/findAll", function (data) {
        var filteredJson = filterJson(data);
        buildHtmlTable(filteredJson);
    });
}

function buildHtmlTable(myList) {
    var selector = "#table";
    var columns = addAllColumnHeaders(myList, selector);

    for (var i = 0; i < myList.length; i++) {
        var row$ = $('<tr/>');
        for (var colIndex = 0; colIndex < columns.length; colIndex++) {
            var cellValue = myList[i][columns[colIndex]];
            if (cellValue == null) cellValue = "";
            row$.append($('<td/>').html(cellValue));
        }
        $(selector).append(row$);
    }
}

function addAllColumnHeaders(myList, selector) {
    var columnSet = [];
    var headerTr$ = $('<tr/>');

    for (var i = 0; i < myList.length; i++) {
        var rowHash = myList[i];
        for (var key in rowHash) {
            if ($.inArray(key, columnSet) == -1) {
                columnSet.push(key);
                headerTr$.append($('<th/>').html(key));
            }
        }
    }
    $(selector).append(headerTr$);

    return columnSet;
}

$(function () {

    fillTable();

})

