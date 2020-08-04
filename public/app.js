$(document).ready(function () {
    $.getJSON('/api/todos')
        .then(loadTodos)
        .catch(function (err) {
            console.error(err)
        })
    $('#todoInput').keypress(function (event) {
        if (event.which === 13) {
            var input = event.target.value
            createTodo(input)
        }
    })
    $('.list').on('click', 'span', function (event) {
        event.stopPropagation()
        removeTodo($(this).parent())
    })
    $('.list').on('click', 'li', function () {
        updateTodo($(this))
    })
})

function loadTodos(todos) {
    todos.forEach(todo => {
        addTodo(todo)
    });
}

function addTodo(todo) {
    var newTodo = $('<li class="task" >' + todo.name + '<span>X</span> </li>')
    newTodo.data('id', todo._id)
    newTodo.data('completed', todo.completed)
    if (todo.completed) {
        newTodo.addClass('done')
    }
    $('.list').append(newTodo)
}

function createTodo(input) {
    $.post('/api/todos', { name: input })
        .then(function (newTodo) {
            $('#todoInput').val('')
            addTodo(newTodo)
        })
        .catch(function (err) {
            console.error(err)
        })
}

function removeTodo(todo) {
    var selectedId = todo.data('id')
    var deleteUrl = '/api/todos/' + selectedId
    $.ajax({
        url: deleteUrl,
        type: 'DELETE'
    })
        .then(function (data) {
            todo.remove()
        })
        .catch(function (err) {
            console.error(err)
        })
}

function updateTodo(todo) {
    var isDone = todo.data('completed')
    var selectedId = todo.data('id')
    var updateUrl = '/api/todos/' + selectedId

    var updateData = { completed: !isDone }
    $.ajax({
        method: 'PUT',
        url: updateUrl,
        data: updateData
    })
        .then(function (updatedTodo) {
            todo.toggleClass('done')
            todo.data('completed', !isDone)
        })
}