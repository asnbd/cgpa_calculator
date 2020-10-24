var totalSemesters = 0;
// const logServerURL = "http://localhost/server-log";

var protocol = "//";
var port = "";
var ip = "ubuntu.asswadsarker.me";
var dir = "/log/cgpa";

// if (window.location.href.indexOf('http://')==0){
//     protocol = "http://";
//     //port = ":8080";
// }

const logServerURL = protocol + ip + port + dir;

function loadForm(){
    var inputTotalSemseter = $('#inputTotalSemseter')[0].value;

    if(inputTotalSemseter == "0" || inputTotalSemseter == "" || isNaN(inputTotalSemseter)){
        $('#inputTotalSemseter')[0].focus();
        alert("Invalid Total Semesters!");
        return;
    }

    if(inputTotalSemseter < 0){
        $('#inputTotalSemseter')[0].value *= -1;
        inputTotalSemseter *= -1;
    }

    var str = '';

    for(i=1;i<=inputTotalSemseter;i++){
        str += '\
        <!-- Semester ' + i + ' -->\
        <div id="sem_' + i + '" class="form-row">\
            <div class="form-group col-auto my-1">Semester ' + i + ':</div>\
            <div class="form-group col">\
                <input type="text" class="form-control credits" placeholder="Credits">\
            </div>\
            <div class="form-group col">\
                <input type="text" class="form-control cgpa" placeholder="GPA">\
            </div>\
        </div>\
        ';
    }

    str += '\
        <button id="calculateBtn" class="btn btn-primary" onclick="calculateCGPA()">Calculate</button>';

    $('#semesterForm')[0].innerHTML = str;

    $('#resultForm')[0].innerHTML = "";

    totalSemesters = inputTotalSemseter;
    
    setActions();
}

function loadData(dept, data){
    var str = '';
    var credits = [];

    if(data == null){
        switch(dept){
            case 'cse3':
                credits = [20, 20.25, 20.25, 20.25, 20, 19.5, 17.25, 22.5];
                break;
            default:
                credits = [20, 20.25, 20.25, 20.25, 20, 19.5, 17.25, 22.5];
                break;
        }
        gpa = [];
    } else {
        id = data['id'];
        credits = data['credits'];
        gpa = data['gpa'];
        name = data['name'];

        if(id == 0){
            str += '<div id="id_info" class="alert alert-danger" role="alert"><strong>Invalid ID / Data doesn\'t exists</strong></div>'
        } else {
            str += '<div id="id_info" class="alert alert-warning" role="alert">ID: <strong>' + id + '</strong><br>Name: <strong>' + name + '</strong></div>'
        }
    }

    var inputTotalSemseter = credits.length;
    $('#inputTotalSemseter')[0].value = inputTotalSemseter;

    

    for(i=1;i<=inputTotalSemseter;i++){
        str += '\
        <!-- Semester ' + i + ' -->\
        <div id="sem_' + i + '" class="form-row">\
            <div class="form-group col-auto my-1">Semester ' + i + ':</div>\
            <div class="form-group col">\
                <input type="text" value="' + credits[i-1] + '" class="form-control credits" placeholder="Credits">\
            </div>\
            <div class="form-group col">\
                <input type="text" value="' + ((gpa.length==0)?'':gpa[i-1]) + '" class="form-control cgpa" placeholder="GPA">\
            </div>\
        </div>\
        ';
    }

    str += '\
        <button id="calculateBtn" class="btn btn-primary" onclick="calculateCGPA()">Calculate</button>';

    $('#semesterForm')[0].innerHTML = str;

    $('#resultForm')[0].innerHTML = "";

    totalSemesters = inputTotalSemseter;
    
    setActions();
}

function clearForm(){
    for(i=0;i<$('.cgpa').length;i++){
        $('.cgpa')[i].value = "";
        $('.credits')[i].value = "";
    }
    $('#id_info').remove();
    $('#resultForm')[0].innerHTML = "";
}

function calculateCGPA(){
    var totalCredits = 0;
    var total = 0;

    var arr = [];

    for(i=1;i<=totalSemesters;i++){
        var credits = $('#sem_' + i).contents().find('.credits')[0].value;
        var cgpa = $('#sem_' + i).contents().find('.cgpa')[0].value;

        if(credits == "0" || credits == "" || isNaN(credits)){
            $('#sem_' + i).contents().find('.credits')[0].focus();
            alert("Invalid Credits Value of Semester " + i + "!");
            return;
        }

        if(cgpa == "0" || cgpa == "" || isNaN(cgpa)){
            $('#sem_' + i).contents().find('.cgpa')[0].focus();
            alert("Invalid CGPA Value of Semester " + i + "!");
            return;
        }

        var credits = parseFloat(credits);
        var cgpa = parseFloat(cgpa);

        totalCredits += credits;
        total += cgpa * credits;
        
        arr[i-1] = {credits: credits, cgpa: cgpa};
    }

    var cgpa = total / totalCredits;

    var result = '\
    <div class="alert alert-success" role="alert">CGPA: <strong>' + cgpa.toFixed(2) + '</strong></div>\
    <div class="alert alert-primary" role="alert">Total Credits: <strong>' + totalCredits + '</strong></div>';

    $('#resultForm')[0].innerHTML = result;

    // Local Storage
    // localStorage.setItem("totalSemesters", totalSemesters);
    // localStorage.setItem("semesterMarks", JSON.stringify(arr));
    // localStorage.setItem("cgpa", cgpa.toFixed(2));
    // localStorage.setItem("totalCredits", totalCredits);

    // Log to Server
    var logData = {};
    logData['totalSemesters'] = totalSemesters;
    logData['semesterMarks'] = arr;
    logData['cgpa_original'] = cgpa;
    logData['cgpa'] = cgpa.toFixed(2);
    logData['totalCredits'] = totalCredits;
    console.log(logData)

    logToServer(logData);
}

function init(){
    totalSemesters = localStorage.getItem("totalSemesters");
    if(totalSemesters != null){
        $('#inputTotalSemseter')[0].value = totalSemesters;
        loadForm();

        var semesterMarks = JSON.parse(localStorage.getItem("semesterMarks"));
        if(semesterMarks != null){
            for(i=1;i<=totalSemesters;i++){
                $('#sem_' + i).contents().find('.credits')[0].value = semesterMarks[i-1].credits;
                $('#sem_' + i).contents().find('.cgpa')[0].value = semesterMarks[i-1].cgpa;
            }
            
            var result = '\
            <div class="alert alert-success" role="alert">CGPA: <strong>' + localStorage.getItem("cgpa") + '</strong></div>\
            <div class="alert alert-primary" role="alert">Total Credits: <strong>' + localStorage.getItem("totalCredits") + '</strong></div>';

            $('#resultForm')[0].innerHTML = result;
        }
    }
}

$(document).ready(function(){
    //init();

    $("#inputTotalSemseter").on("keydown", function(e) {
        if (e.keyCode === 13) {
            loadForm();
        }
    });

    processParameters();
});

function setActions(){
    $('.credits').on("keydown", function(e) {
        if (e.keyCode === 13) {
            this.parentElement.nextElementSibling.children[0].focus();
        }
    });

    $('.cgpa').on("keydown", function(e) {
        if (e.keyCode === 13) {
            if(this.parentElement.parentElement.nextElementSibling.type == "submit"){
                calculateCGPA();
            } else {
                this.parentElement.parentElement.nextElementSibling.children[1].children[0].focus();
            }
        }
    });
}


function processParameters(){
    const queryString = window.location.search;

    const urlParams = new URLSearchParams(queryString);

    if(urlParams.has('id')){
        const id = urlParams.get('id')
        console.log(id);

        var res = {};
        $.ajax({
            url: "data.json",
            success: function(result) {
                //console.log(result["id"][id]);

                if(result['id'].hasOwnProperty(id)){
                    var idData = result['id'][id];
                    var batch = idData['batch'];
                    name = idData['name'];
                    var gpa = idData['gpa'];

                    res = {
                        'credits':result['credits'][batch],
                        'gpa': gpa,
                        'id': id,
                        'name': name,
                        'batch': batch
                    };

                    console.log(res);
                    loadData('cse3', res);
                    calculateCGPA();
                } else {
                    console.log("ID Not Found!");
                    res = {
                        'credits':[0],
                        'gpa': [0],
                        'id': 0,
                        'name': "Not Found",
                        'batch': 0
                    };
                    loadData('cse3', res);
                }
            },
            error: function(xhr, ajaxOptions, thrownError){
                alert(xhr.status);
                alert(thrownError);
            }
        });
    }
}

function logToServer(logData){
    $.ajax({
        url: logServerURL + "/log.php",
        method: "post",
        data: {data: JSON.stringify(logData)},
        success: function(result) {
            console.log(result);
            
        },
        error: function(xhr, ajaxOptions, thrownError){
            console.log("logToServer(): " + xhr.status);
            console.log("logToServer(): " + thrownError);
        }
    });
}

// function getJSONData(id){
//     var res = {};
//     $.ajax({
//         url: "data.json",
//         success: function(result) {
//             //console.log(result["id"][id]);

//             var idData = result['id'][id];
//             var batch = idData['batch'];
//             var gpa = idData['gpa'];

//             res = {
//                 'credits':result['credits'][batch],
//                 'gpa': gpa,
//                 'id': id,
//                 'batch': batch
//             };

//             //console.log(res);

//             return res;
//         },
//         error: function(xhr, ajaxOptions, thrownError){
//             alert(xhr.status);
//             alert(thrownError);
//         }
//       });
// }