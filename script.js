let todoInput
let errorInfo
let addBtn
let ulList
let popup
let popupInfo
let todoToEdit
let popupInput
let popupAddBtn
let popupCloseBtn
let inputDate
let popupDate
let todoArray = []
let todoSearch

const main = () => {
    prepareDOMElements()
    prepareDOMEvents()
    loadTodosFromLocalStorage()
}

const prepareDOMElements = () => {
    todoInput = document.querySelector('.todo-input')
    inputDate = document.querySelector('.input-date')
    errorInfo = document.querySelector('.error-info')
    addBtn = document.querySelector('.btn-add')
    ulList = document.querySelector('.todolist ul')
    popup = document.querySelector('.popup')
    popupInfo = document.querySelector('.popup-info')
    popupDate = document.querySelector('.popup-date')
    popupInput = document.querySelector('.popup-input')
    popupAddBtn = document.querySelector('.accept')
    popupCloseBtn = document.querySelector('.cancel')
    todoSearch = document.querySelector('.todo-search')
}

const prepareDOMEvents = () => {
    addBtn.addEventListener('click', addNewTodo)
    ulList.addEventListener('click', checkClick)
    popupCloseBtn.addEventListener('click', closePopup)
    popupAddBtn.addEventListener('click', changeTodoValue)
    todoSearch.addEventListener('input', searchTodos)
}

const addNewTodo = () => {
    let actualDate = new Date()
    let compareDate = new Date(inputDate.value)
    let compareTodoInput = todoInput.value.trim()

    if (compareTodoInput.length >= 3 && compareTodoInput.length <= 255) {

        if (actualDate <= compareDate) {
            const newTodo = document.createElement('li')
            const newTodoDate = document.createElement('p')

            newTodoDate.textContent = inputDate.value
            newTodo.textContent = todoInput.value

            newTodo.append(newTodoDate)
            createToolsArea(newTodo)
            ulList.append(newTodo)

            todoArray.push({
                text: todoInput.value,
                date: inputDate.value,
                completed: false,
            })

            saveTodosToLocalStorage()

            todoInput.value = ''
            inputDate.value = ''
            errorInfo.textContent = ''
        } else {
            errorInfo.textContent = 'aktualna data nie może być wcześniejsza niz dzisiaj'
        }

    }
    else if (compareTodoInput.length < 3) {
        errorInfo.textContent = 'Treść zadania musi mieć minimum 3 znaki'
    }
    else if (compareTodoInput.length >= 255) {
        errorInfo.textContent = 'Treść zadania nie może mieć więcej niż 255 znaki'
    }
}

const createToolsArea = (newTodo) => {
    const toolsPanel = document.createElement('div')
    toolsPanel.classList.add('tools')
    newTodo.append(toolsPanel)

    const completeBtn = document.createElement('button')
    completeBtn.classList.add('complete')
    completeBtn.innerHTML = '<i class="fas fa-check"></i>'

    const deleteBtn = document.createElement('button')
    deleteBtn.classList.add('delete')
    deleteBtn.innerHTML = '<i class="fas fa-times"></i>'

    toolsPanel.append(completeBtn, deleteBtn)
}

const checkClick = event => {
    if (event.target.matches('.complete')) {
        event.target.closest('li').classList.toggle('completed')

        const todoElement = event.target.closest('li')
        const index = Array.from(todoElement.parentNode.children).indexOf(todoElement)
        todoArray[index].completed = !todoArray[index].completed

        saveTodosToLocalStorage()
    }
    else if (event.target.matches('li')) {
        editTodo(event)
    }
    else if (event.target.matches('.delete')) {
        deleteTodo(event)
    }
}

const editTodo = event => {
    todoToEdit = event.target.closest('li')
    popupInput.value = todoToEdit.firstChild.textContent
    popupDate.value = todoToEdit.childNodes[1].textContent

    popup.style.display = 'flex'
}

const closePopup = () => {
    popup.style.display = 'none'
}

const changeTodoValue = () => {
    let actualDate = new Date()
    let compareDate = new Date(inputDate.value)
    let compareTodoInput = todoInput.value.trim()

    if (compareTodoInput.length >= 3 && compareTodoInput.length <= 255) {
        if (actualDate <= compareDate) {
            todoToEdit.firstChild.textContent = popupInput.value
            todoToEdit.childNodes[1].textContent = popupDate.value
            popup.style.display = 'none'
            popupInfo.textContent = ''
            errorInfo.textContent = ''

            const index = Array.from(todoToEdit.parentNode.children).indexOf(todoToEdit)
            todoArray[index].text = popupInput.value
            todoArray[index].date = popupDate.value

            saveTodosToLocalStorage()
        } else {
            errorInfo.textContent = 'aktualna data nie może być wcześniejsza niz dzisiaj'
        }

    }
    else if (compareTodoInput.length < 3) {
        errorInfo.textContent = 'Treść zadania musi mieć minimum 3 znaki'
    }
    else if (compareTodoInput.length >= 255) {
        errorInfo.textContent = 'Treść zadania nie może mieć więcej niż 255 znaki'
    }
}

const deleteTodo = event => {
    const todoElement = event.target.closest('li')
    if (todoElement) {
        todoElement.remove()

        const index = todoArray.findIndex(todo => todo.text === todoElement.firstChild.textContent)
        if (index !== -1) {
            todoArray.splice(index, 1)
        }

        saveTodosToLocalStorage()

        const allTodos = document.querySelectorAll('li')
        if (allTodos.length === 0) {
            errorInfo.textContent = 'Brak zadań na liście'
        }
    }
}

const saveTodosToLocalStorage = () => {
    localStorage.setItem('todos', JSON.stringify(todoArray))
}

const loadTodosFromLocalStorage = () => {
    const todos = localStorage.getItem('todos')

    if (todos) {
        todoArray = JSON.parse(todos)

        todoArray.forEach(todo => {
            const newTodo = document.createElement('li')
            const newTodoDate = document.createElement('p')

            newTodoDate.textContent = todo.date
            newTodo.textContent = todo.text;

            newTodo.append(newTodoDate)
            createToolsArea(newTodo)
            ulList.append(newTodo)

            if (todo.completed) {
                newTodo.classList.add('completed')
            }
        })
    }
}

const searchTodos = () => {
    const searchQuery = todoSearch.value.trim().toLocaleLowerCase()
    if (searchQuery.length >= 2) {
        ulList.innerHTML = ''

        todoArray.forEach(todo => {
            if (todo.text.toLocaleLowerCase().includes(searchQuery)) {
                const newTodo = document.createElement('li');
                const newTodoDate = document.createElement('p')

                newTodoDate.textContent = todo.date
                newTodo.textContent = todo.text

                const searchRegex = new RegExp(`(${searchQuery})`, 'gi')
                newTodo.innerHTML = newTodo.textContent.replace(searchRegex, '<span class="highlighted">$1</span>')

                newTodo.append(newTodoDate)
                createToolsArea(newTodo)
                ulList.append(newTodo)

                if (todo.completed) {
                    newTodo.classList.add('completed')
                }
            }
        })
    } else {
        ulList.innerHTML = ''
        loadTodosFromLocalStorage()
    }
}

document.addEventListener('DOMContentLoaded', main)