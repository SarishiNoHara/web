var taskInput = document.getElementById("new-task");
var dateInput = document.getElementById("new-date");
var rateInput = document.getElementById("new-rate");
var addButton = document.getElementById("addbutton");
//var addButton = document.getElementById("input");
var incompleteTasksHolder = document.getElementById("incomplete-tasks");
var completedTasksHolder = document.getElementById("completed-tasks");
var sortTasksByDateHolder = document.getElementById("dateResults");
var sortTasksByRatingHolder = document.getElementById("rateResults");
var newTaskId = 1;

var createNewTaskElement = function(taskString, date, rate) {
    //Create List Item
    var listItem = document.createElement("li");
    //input (checkbox)
    var checkBox = document.createElement("button"); // checkbox
    //create id 
    var number = document.createElement("label");
    //label
    var label = document.createElement("label");
    //input (text)
    var editInput = document.createElement("input"); // text
    //button.edit
    var datelabel = document.createElement("label");
    var editdateInput = document.createElement("input");
    var ratelabel = document.createElement("label");
    var editrateInput = document.createElement("input");
    var editButton = document.createElement("button");
    //button.delete
    var deleteButton = document.createElement("button");

    //Each element needs modifying

    checkBox.innerText = newTaskId;
    checkBox.className = "number";
    newTaskId++;

    editInput.type = "text";
    editInput.className = "task";
    editdateInput.type = "text";
    editdateInput.className = "dateinput";
    editrateInput.type = "text";
    editrateInput.className = "rateinput";

    editButton.innerText = "Edit";
    editButton.className = "edit";
    deleteButton.innerText = "Delete";
    deleteButton.className = "delete";

    label.innerText = taskString;
    label.className = "tasklabel";
    datelabel.innerText = date;
    datelabel.className = "datelabel";
    ratelabel.innerText = rate;
    ratelabel.className = "ratelabel";

    // each element needs appending
    listItem.appendChild(checkBox);
    listItem.appendChild(label);
    listItem.appendChild(editInput);
    listItem.appendChild(datelabel);
    listItem.appendChild(editdateInput);
    listItem.appendChild(ratelabel);
    listItem.appendChild(editrateInput);
    listItem.appendChild(editButton);
    listItem.appendChild(deleteButton);
    return listItem;
}

$(function() {
    $(".date").datepicker();
});

var sortByDate = function() {
    $("#dateResults").children("li").remove();
    var $list = $("#incomplete-tasks,#completed-tasks");
    var $listItem = $list.children("li");
    var listItem1 = $listItem.clone();
    listItem1.children("button").remove();
    var listItem1 =
        listItem1.sort(function(a, b) {
            var c = new Date($(a).children(".datelabel").text());
            var d = new Date($(b).children(".datelabel").text());
            return d - c;
        });
    for (var i = 0; i < listItem1.length; i++) {
        sortTasksByDateHolder.appendChild(listItem1[i]);
    }
}

var sortByRating = function() {
    $("#rateResults").children("li").remove();
    var $list = $("#incomplete-tasks,#completed-tasks");
    var $listItem = $list.children("li");
    var listItem1 = $listItem.clone();
    listItem1.children("button").remove();
    listItem1.sort(function(a, b) {
        var c = new Date($(a).children(".ratelabel").text());
        var d = new Date($(b).children(".ratelabel").text());
        return d - c;
    });
    for (var i = 0; i < listItem1.length; i++) {
        sortTasksByRatingHolder.appendChild(listItem1[i]);
    }
}

// Add a new task
var addTask = function() {
    console.log("Add task...");
    //Create a new list item with the text from #new-task:
    var listItem = createNewTaskElement(taskInput.value, dateInput.value, rateInput.value);

    var item = {
        message: taskInput.value,
        date: dateInput.value,
        rating: rateInput.value,
        completed: 0,
    };

    taskInput.value = "";
    dateInput.value = "";
    rateInput.value = "";

    $.ajax({
        type: 'POST',
        url: 'todo',
        data: item,
        dataType: 'json',
        complete: function() {
            console.log('complete');
            priority(item.rating, listItem);
            overdue(item.date, listItem);
            $(listItem).children('.number').text(newTaskId);
            incompleteTasksHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted);
        },
    }).done(success).error(fail);

}

// Edit an existing task
var editTask = function() {
    console.log("Edit Task...");

    var listItem = this.parentNode;

    var editInput = listItem.querySelector(".task");
    var label = listItem.querySelector(".tasklabel");

    var editdateInput = listItem.querySelector(".dateinput")
    var datelabel = listItem.querySelector(".datelabel");

    var editrateInput = listItem.querySelector(".rateinput")
    var ratelabel = listItem.querySelector(".ratelabel");

    $(function() {
        $(".dateinput").datepicker();
    });


    var containsClass = listItem.classList.contains("editMode");

    //if the class of the parent is .editMode 
    if (containsClass) {

        //switch from .editMode 
        //Make label text become the input's value
        var item = {
            message: editInput.value,
            date: editdateInput.value,
            rating: editrateInput.value,
            completed: 0,
        };

        var number = $(listItem).children(".number");
        var id = Number(number.text());
        $.ajax({
            type: 'PUT',
            url: '/todo/update/' + id,
            data: item,
            dataType: 'json',
            complete: function() {
                console.log('put method complete');
                priority(item.rating, listItem);
                overdue(item.date, listItem);
                label.innerText = editInput.value;
                datelabel.innerText = editdateInput.value;
                ratelabel.innerText = editrateInput.value;
            }
        })

    } else {
        //Switch to .editMode
        //input value becomes the label's text
        editInput.value = label.innerText;
        editdateInput.value = datelabel.innerText;
        editrateInput.value = ratelabel.innerText;
    }

    // Toggle .editMode on the parent
    listItem.classList.toggle("editMode");
}


// Delete an existing task
var deleteTask = function() {
    console.log("Delete task...");
    var listItem = this.parentNode;
    var ul = listItem.parentNode;
    var label = $(listItem).children(".number");
    var id = Number(label.text());

    $.ajax({
            type: 'DELETE',
            url: '/todo/delete/' + id,
            success: function(res) {
                console.log("delete method success");
                ul.removeChild(listItem);
                label.remove();
            }

        })
        //Remove the parent list item from the ul
}

// Mark a task as complete 
var taskCompleted = function() {
    //function taskCompleted() {
    console.log("Task complete...");
    //Append the task list item to the #completed-tasks
    var listItem = this.parentNode;
    var label = $(listItem).children(".number");
    var id = Number(label.text());

    $.ajax({
        type: 'PUT',
        url: '/todo/completed/' + id,
        complete: function() {
            $(listItem).children('.ratelabel').css('text-decoration', 'line-through').css('color', 'grey');
            completedTasksHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskIncomplete);
        }
    })
}

// Mark a task as incomplete
var taskIncomplete = function() {
    console.log("Task Incomplete...");
    // When checkbox is unchecked
    // Append the task list item #incomplete-tasks
    var listItem = this.parentNode;
    var label = $(listItem).children(".number");
    var id = Number(label.text());
    $.ajax({
        type: 'PUT',
        url: '/todo/incomplete/' + id,
        complete: function() {
            //  var listItem = this.parentNode;
            $(listItem).children('.ratelabel').css('text-decoration', 'none').css('color', 'red');
            incompleteTasksHolder.appendChild(listItem);
            bindTaskEvents(listItem, taskCompleted);
        }
    })

}

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    console.log("Bind list item events");
    //select taskListItem's children
    var checkBox = taskListItem.querySelector("button.number");
    // var checkBox = $(".number").eq(0);
    var editButton = taskListItem.querySelector("button.edit");
    var deleteButton = taskListItem.querySelector("button.delete");

    //bind editTask to edit button
    editButton.onclick = editTask;

    //bind deleteTask to delete button
    deleteButton.onclick = deleteTask;

    //bind checkBoxEventHandler to checkbox
    checkBox.onclick = checkBoxEventHandler;
}

var ajaxRequest = function() {
    console.log("AJAX Request");
}

// Set the click handler to the addTask function
//addButton.onclick = addTask;
addButton.addEventListener("click", addTask);
addButton.addEventListener("click", ajaxRequest);


// Cycle over the incompleteTaskHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children.length; i++) {
    // bind events to list item's children (taskCompleted)
    bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);
}
// Cycle over the completeTaskHolder ul list items
for (var i = 0; i < completedTasksHolder.children.length; i++) {
    // bind events to list item's children (taskIncompleted)
    bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);

}

var success = function(message) {
    console.log(message, success);
}

var fail = function(error) {
    console.log(error);
}

function overdue(date, listItem) {
    var d = new Date(date);
    var today = new Date();
    if (d < today) {
        var item = $(listItem).children('.datelabel');
        item.css('text-decoration', 'line-through').css('color', 'grey');
    }
}

function priority(rating, listItem) {
    console.log(rating);
    if (rating > 3) {
        var item = $(listItem).children('.ratelabel');
        console.log('rating', item);
        item.css('color', 'red');
    }
}

$.ajax({
    type: 'GET',
    url: 'todo',
    success: function(todos) {
        for (var key in todos) {
            var listItem = createNewTaskElement(todos[key].message, todos[key].date, todos[key].rating);

            var id = todos[key].id;
            $(listItem).children('.number').text(id);
            newTaskId = id;
            priority(todos[key].rating, listItem);
            overdue(todos[key].date, listItem);
            if (todos[key].completed === 0) {
                incompleteTasksHolder.appendChild(listItem);
                bindTaskEvents(listItem, taskCompleted);
            } else {
                completedTasksHolder.appendChild(listItem);
                bindTaskEvents(listItem, taskIncomplete);
            }
        }

        // var string = $('.number').text();
        // var array = string.split('').map(Number);
        // largest = Math.max.apply(Math, array);
        // console.log(array, largest);
    }
})