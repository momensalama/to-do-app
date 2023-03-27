// selectors
const todoForm = document.querySelector("header form");
const mainInput = document.querySelector("header form input");
const todoList = document.querySelector(".todos");
const totalTasks = document.querySelector("section .total-task");
const completedTasks = document.querySelector("section .completed-task");
const remainingTasks = document.querySelector("section .remaining-task");

let tasks = JSON.parse(localStorage.getItem("tasks")) || [];

function sotreTasksToLocalStorage(tasks) {
  localStorage.setItem("tasks", JSON.stringify(tasks));
}

if (localStorage.getItem("tasks")) {
  tasks.map((task) => createTask(task));
}

todoForm.addEventListener("submit", (e) => {
  e.preventDefault();

  const inputValue = mainInput.value;

  if (inputValue === "") return;

  const task = {
    id: new Date().getTime(),
    name: inputValue,
    isComoleted: false,
  };

  tasks.push(task);
  sotreTasksToLocalStorage(tasks);

  createTask(task);
  todoForm.reset();
  mainInput.focus();
});

todoList.addEventListener("click", (e) => {
  if (e.target.classList.contains("remove-task")) {
    const task = e.target.closest("li").id;

    removeTask(task);
  }
});

todoList.addEventListener("input", (e) => {
  const taskId = e.target.closest("li").id;

  updateTask(taskId, e.target);
});

todoList.addEventListener("keydown", function (e) {
  if (e.keyCode === 13) {
    e.preventDefault();
    e.target.blur();
  }
});

function createTask(task) {
  let html = `
  <li id="${task.id}" class='${task.isCompleted ? "complete" : ""}'>
    <div>
      <input type="checkbox" name="tasks" ${
        task.isCompleted ? "checked" : ""
      } />
      <span ${!task.isCompleted ? "contenteditable" : ""}>${task.name}</span>
    </div>
    <button class="remove-task">x</button>
</li>
  `;

  todoList.insertAdjacentHTML("beforeend", html);
  countTasks();
}

function countTasks() {
  const completedTasksArray = tasks.filter((task) => task.isCompleted === true);
  totalTasks.textContent = tasks.length;

  completedTasks.textContent = completedTasksArray.length;

  remainingTasks.textContent = tasks.length - completedTasksArray.length;
}

function removeTask(taskId) {
  tasks = tasks.filter((task) => task.id != taskId);

  sotreTasksToLocalStorage(tasks);

  document.getElementById(taskId).remove();

  countTasks();
}

function updateTask(taskId, el) {
  const task = tasks.find((task) => task.id == taskId);

  if (el.hasAttribute("contenteditable")) {
    task.name = el.textContent;
  } else {
    const span = el.nextElementSibling;
    const parent = el.closest("li");

    task.isCompleted = !task.isCompleted;

    if (task.isCompleted) {
      span.removeAttribute("contenteditable");
      parent.classList.add("complete");
    } else {
      span.setAttribute("contenteditable", true);
      parent.classList.remove("complete");
    }
  }
  sotreTasksToLocalStorage(tasks);
  countTasks();
}
