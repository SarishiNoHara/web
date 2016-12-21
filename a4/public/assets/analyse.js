$(document).ready(function() {

    var getTable = function(url) {
        $.getJSON(url, function(data) {
            var tbl_body = document.createElement("tbody");
            var odd_even = false;
            $.each(data, function() {
                var tbl_row = tbl_body.insertRow();
                tbl_row.className = odd_even ? "odd" : "even";
                $.each(this, function(k, v) {
                    var cell = tbl_row.insertCell();
                    if (v === null) {
                        v = "null";
                    }
                    cell.appendChild(document.createTextNode(v.toString()));
                })
                odd_even = !odd_even;
            })
            $("#q1").append(tbl_body);
        });
    }

    $('#1').click(function() {
        $("#q1 tbody").remove();
        getTable('q1');
    })

    $('#2').click(function() {
        $("#q1 tbody").remove();
        getTable('q2');
    })

    $('#3').click(function() {
        $("#q1 tbody").remove();
        getTable('q3');
    })

    $('#4').click(function() {
        $("#q1 tbody").remove();
        getTable('q4');
    })

    $('#5').click(function() {
        $("#q1 tbody").remove();
        getTable('q5');
    })
    $('#6').click(function() {
        $("#q1 tbody").remove();
        getTable('q6');
    })
    $('#7').click(function() {
        $("#q1 tbody").remove();
        getTable('q7');
    })
    $('#8').click(function() {
        $("#q1 tbody").remove();
        getTable('q8');
    })
    $('#9').click(function() {
        $("#q1 tbody").remove();
        getTable('q9');
    })
    $('#10').click(function() {
        $("#q1 tbody").remove();
        getTable('q10');
    })
    $('#11').click(function() {
        // getTable('q11');
        $.getJSON('q11', function(data) {
            alert(data.text);
        })
    })

    $('#12').click(function() {
        $("#q1 tbody").remove();
        getTable('q12');
    })
    $('#13').click(function() {
        $("#q1 tbody").remove();
        getTable('q13');
    })




})