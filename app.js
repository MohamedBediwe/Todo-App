const modePicker = document.querySelector("header .image")
const inputField = document.querySelector(".input input")
const container = document.querySelector(".container")
const listElement = document.querySelector('.tasks ul')
const addBtn = document.querySelector('.input .add')
const clearCompletedBtn = document.querySelector('.clear-com')
let storageArray = []
let tasksFromLocalStorage = localStorage.getItem('Tasks')

if (tasksFromLocalStorage) {
    storageArray = JSON.parse(tasksFromLocalStorage)
    for (let i = 0; i < storageArray.length; i++) {
        createLi(storageArray[i].text, storageArray[i].done, storageArray[i].id)
    }
    countLeft()
}
// Theme Changer function
if (localStorage.getItem("mode") === "dark") {
    document.body.classList.add("dark")
    container.classList.add("dark")
}
modePicker.addEventListener("click", function () {
    document.body.classList.toggle("dark");
    container.classList.toggle("dark");
    if (container.classList.contains("dark")) {
        localStorage.setItem("mode", "dark")
    }
    else {
        localStorage.setItem("mode", "light")
    }
})
// Function to make the add button work
inputField.addEventListener('keypress', function (e) {
    if (e.keyCode === 13) {
        addBtn.click()
    }
})
addBtn.addEventListener('click', function(e) {
    if (!inputField.value) return;
    const taskObj = {
        id: Date.now(),
        done: false,
        text: inputField.value
    }
    storageArray.push(taskObj)
    localStorage.setItem('Tasks', JSON.stringify(storageArray))
    createLi(taskObj.text, taskObj.done, taskObj.id)
    inputField.value = ""
    countLeft()
})
// Function of making the li elements and appending the elements to page
function createLi(text, done, id) {
    const li = document.createElement('li');
    // done btn
    const circleSpan = document.createElement('span')
    circleSpan.className = "circle"
    li.appendChild(circleSpan)
    // Complete Task Function
    circleSpan.addEventListener('click', function (ele) {
        li.classList.toggle('done')
        if (li.classList.contains('done')) {
            storageArray.forEach(function (item) {
                if (item.id == ele.currentTarget.parentElement.getAttribute('data-id')) {
                    item.done = true
                }
            })
        } 
        else {
            storageArray.forEach(function (item) {
                if (item.id == ele.currentTarget.parentElement.getAttribute('data-id')) {
                    item.done = false
                }
            })
        }
        localStorage.setItem('Tasks', JSON.stringify(storageArray))
        countLeft()
    })
    li.appendChild(document.createTextNode(text))
    // delete btn
    const delSpan = document.createElement('span')
    delSpan.className = "delete"
    li.appendChild(delSpan)
    // Delete Function
    delSpan.addEventListener('click', function (ele) {
        storageArray = storageArray.filter(function (item) {
            return item.id != ele.currentTarget.parentElement.getAttribute('data-id')
        })
        localStorage.setItem('Tasks', JSON.stringify(storageArray))
        ele.currentTarget.parentElement.remove();
        countLeft();
    })
    // Adding done class
    if (done) {
        li.className = "done"
    }
    // Adding the id
    li.setAttribute("data-id", id)
    listElement.appendChild(li)
}
// how many Tasks left
function countLeft() {
    let unDone = document.querySelectorAll("ul li").length - document.querySelectorAll("ul li.done").length;
    const number = document.querySelector('.number');
    number.textContent = unDone
}
// Shuffle Functions
const all = document.querySelector('.all')
const comp = document.querySelector('.completed')
const active = document.querySelector(".active")
all.addEventListener('click', function () {
    if (all.classList.contains('shown')) return;
    all.classList.add('shown')
    active.classList.remove('shown')
    comp.classList.remove('shown')
    document.querySelectorAll('ul li').forEach(item => item.classList.remove('hidden'))
})
active.addEventListener('click', function () {
    if (active.classList.contains('shown')) return;
    if (comp.classList.contains('shown')) document.querySelectorAll('ul li:not(li.done)').forEach(item => item.classList.remove('hidden'))
    active.classList.add('shown')
    comp.classList.remove('shown')
    all.classList.remove('shown')
    document.querySelectorAll('ul li.done').forEach(item => item.classList.add('hidden'))
})
comp.addEventListener('click', function () {
    if (comp.classList.contains('shown')) return;
    if (active.classList.contains('shown')) document.querySelectorAll('ul li.done').forEach(item => item.classList.remove('hidden'))
    comp.classList.add('shown')
    all.classList.remove('shown')
    active.classList.remove('shown')
    document.querySelectorAll('ul li:not(li.done)').forEach(item => item.classList.add('hidden'))
})
// Function to clear completed Tasks
clearCompletedBtn.addEventListener('click', function () {
    listElement.innerHTML = ""
    storageArray = storageArray.filter(function (ele) {
        return ele.done === false
    })
    storageArray.forEach((e) => {
        createLi(e.text, e.done, e.id)
    })
    localStorage.setItem('Tasks', JSON.stringify(storageArray))
    if (comp.classList.contains('shown')) {
        comp.classList.remove('shown')
        all.classList.add('shown');
    }
})