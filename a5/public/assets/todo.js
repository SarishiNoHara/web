var taskInput = $("#new-task"),
    dateInput = $("#new-date"),
    rateInput = $("#new-rate"),
    addButton = $("#addbutton"),
    incompleteTasksHolder = $("#incomplete-tasks"),
    completedTasksHolder = $("#completed-tasks"),
    sortTasksByDateHolder = $("#dateResults"),
    sortTasksByRatingHolder = $("#rateResults");
var newTaskId = 0;
$.getJSON("/todo", function(todos) {
    for (var key in todos) {
        newTaskId = todos[key].id;
    }
    console.log(newTaskId);
})

var overdue = function(date, listItem) {
    var d = new Date(date);
    var today = new Date();
    var item = listItem.children('.datelabel');
    if (d < today) {
        item.css('text-decoration', 'line-through').css('color', 'grey');
    } else {
        item.css('text-decoration', 'none').css('color', 'gery');
    }
}

var priority = function(rating, listItem) {
    var item = listItem.children('.ratelabel');
    if (rating > 3) {
        item.css('color', 'red');
    } else {
        item.css('color', 'grey');
    }
}

var createNewTaskElement = function(taskString, date, rate) {
    //Create List Item
    var listItem = $("<li/>");

    $("<button/>", {
        "class": "number",
        text: newTaskId
    }).appendTo(listItem);
    newTaskId++;

    $("<label/>", {
        "class": "tasklabel",
        text: taskString
    }).appendTo(listItem);

    $("<input/>", {
        "class": "task",
        "type": "text"
    }).appendTo(listItem);

    $("<label/>", {
        "class": "datelabel",
        text: date
    }).appendTo(listItem);

    $("<input/>", {
        "class": "dateinput",
        "type": "text"
    }).appendTo(listItem);

    $("<label/>", {
        "class": "ratelabel",
        text: rate
    }).appendTo(listItem);

    $("<input/>", {
        "class": "rateinput",
        "type": "text"
    }).appendTo(listItem);

    $("<button/>", {
        "class": "edit",
        text: "Edit"
    }).appendTo(listItem);

    $("<button/>", {
        "class": "delete",
        text: "Delete"
    }).appendTo(listItem);

    return listItem;
}

$(function() {
    $(".date").datepicker();
});

var sortByDate = function() {
    $("#dateResults").children("li").remove();
    var $list = $("#incomplete-tasks,#completed-tasks");
    var $listItem = $list.children("li")
    var listItem1 = $listItem.clone();
    listItem1.children("button").remove();
    var listItem1 =
        listItem1.sort(function(a, b) {
            var c = new Date($(a).children(".datelabel").text());
            var d = new Date($(b).children(".datelabel").text());
            return d - c;
        });
    for (var i = 0; i < listItem1.length; i++) {
        sortTasksByDateHolder.append(listItem1[i]);
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
        sortTasksByRatingHolder.append(listItem1[i]);
    }
}

var getId = function(listItem) {
    var label = listItem.children(".number");
    return Number(label.text());
}

// Add a new task
var addTask = function() {
    console.log("Add task...");
    //Create a new list item with the text from #new-task:
    var listItem = createNewTaskElement(taskInput.val(), dateInput.val(), rateInput.val());

    var item = {
        message: taskInput.val(),
        date: dateInput.val(),
        rating: rateInput.val(),
    };

    taskInput.val("");
    dateInput.val("");
    rateInput.val("");

    $.ajax({
        type: 'POST',
        url: '/todo',
        data: item,
        success: function() {
            console.log('complete');
            priority(item.rating, listItem);
            overdue(item.date, listItem);
            listItem.children('.number').text(newTaskId);
            incompleteTasksHolder.append(listItem);
            bindTaskEvents(listItem, taskCompleted);
        },
    }).done(function(message, success) {
        console.log("success");
    }).fail(function(error) {
        console.log(error);
    });
}

// Edit an existing task
var editTask = function() {
    console.log("Edit Task...");

    var listItem = $(this.parentNode);

    var editInput = listItem.children(".task"),
        label = listItem.children(".tasklabel"),

        editdateInput = listItem.children(".dateinput"),
        datelabel = listItem.children(".datelabel"),

        editrateInput = listItem.children(".rateinput"),
        ratelabel = listItem.children(".ratelabel");

    $(function() {
        $(".dateinput").datepicker();
    });

    var containsClass = listItem.hasClass("editMode");
    console.log(containsClass);

    //if the class of the parent is .editMode 
    if (containsClass) {
        var item = {
            message: editInput.val(),
            date: editdateInput.val(),
            rating: editrateInput.val(),
        };

        var id = getId(listItem);
        $.ajax({
            type: 'PUT',
            url: '/todo/update/' + id,
            data: item,
            success: function() {
                console.log('put method complete');

                var flag = listItem.parent('ul').attr('id');
                if (flag === 'incomplete-tasks') {
                    priority(item.rating, listItem);
                }

                overdue(item.date, listItem);

                label.text(editInput.val());
                datelabel.text(editdateInput.val());
                ratelabel.text(editrateInput.val());
            }
        })
    } else {
        //Switch to .editMode
        //input value becomes the label's text
        editInput.val(label.text());
        editdateInput.val(datelabel.text());
        editrateInput.val(ratelabel.text());
    }
    // Toggle .editMode on the parent
    listItem.toggleClass("editMode");
}

// Delete an existing task
var deleteTask = function() {
    console.log("Delete task...");
    var listItem = $(this.parentNode);

    var id = getId(listItem);
    $.ajax({
        type: 'DELETE',
        url: '/todo/delete/' + id,
        success: function(res) {
            console.log("delete method success");
            listItem.remove();
        }
    })
}

// Mark a task as complete 
var taskCompleted = function() {
    console.log("Task complete...");
    //Append the task list item to the #completed-tasks
    var listItem = $(this.parentNode);

    var id = getId(listItem);
    $.ajax({
        type: 'PUT',
        url: '/todo/completed/' + id,
        success: function() {
            listItem.children('.ratelabel').css('color', 'grey');
            completedTasksHolder.append(listItem);
            bindTaskEvents(listItem, taskIncomplete);
        }
    })
}

// Mark a task as incomplete
var taskIncomplete = function() {
    console.log("Task Incomplete...");
    // Append the task list item #incomplete-tasks
    var listItem = $(this.parentNode);

    var id = getId(listItem);
    $.ajax({
        type: 'PUT',
        url: '/todo/incomplete/' + id,
        success: function() {
            var text = listItem.children('.ratelabel').text();
            priority(text, listItem);
            incompleteTasksHolder.append(listItem);
            bindTaskEvents(listItem, taskCompleted);
        }
    })
}

//jquery------>DOM 什么鬼， 只绑定一次TODOTODOTODO
var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {
    console.log("Bind list item events");
    //select taskListItem's children
    var checkBox = taskListItem.get(0).querySelector("button.number"),
        editButton = taskListItem.get(0).querySelector("button.edit"),
        deleteButton = taskListItem.get(0).querySelector("button.delete");

    //bind editTask to edit button
    editButton.onclick = editTask;

    //bind deleteTask to delete button
    deleteButton.onclick = deleteTask;

    //bind checkBoxEventHandler to checkbox
    checkBox.onclick = checkBoxEventHandler;
}

// Set the click handler to the addTask function
addButton.click(addTask);
//addButton.addEventListener("click", addTask);

// Cycle over the incompleteTaskHolder ul list items
for (var i = 0; i < incompleteTasksHolder.children().length; i++) {
    // bind events to list item's children (taskCompleted)
    bindTaskEvents(incompleteTasksHolder.children().eq(i), taskCompleted);
}
// Cycle over the completeTaskHolder ul list items
for (var i = 0; i < completedTasksHolder.children().length; i++) {
    // bind events to list item's children (taskIncompleted)
    bindTaskEvents(completedTasksHolder.children().eq(i), taskIncomplete);

}