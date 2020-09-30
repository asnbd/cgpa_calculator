var totalSemesters = 0;

function loadForm(){
    var inputTotalSemseter = $('#inputTotalSemseter')[0].value;

    if(inputTotalSemseter == "0" || inputTotalSemseter == "" || isNaN(inputTotalSemseter)){
        $('#inputTotalSemseter')[0].focus();
        alert("Invalid Total Semesters!");
        return;
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

    localStorage.setItem("totalSemesters", totalSemesters);
    localStorage.setItem("semesterMarks", JSON.stringify(arr));
    localStorage.setItem("cgpa", cgpa.toFixed(2));
    localStorage.setItem("totalCredits", totalCredits);
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

init()