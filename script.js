const todoList = JSON.parse(localStorage.getItem('todoList')) || [];

const savedTheme = localStorage.getItem('theme');

if (savedTheme === 'dark') {
  document.body.classList.add('dark-mode');
}

document.querySelector('.js-theme-toggle')
  .addEventListener('click', () => {

    document.body.classList.toggle('dark-mode');

    if (document.body.classList.contains('dark-mode')) {
      localStorage.setItem('theme', 'dark');
    } else {
      localStorage.setItem('theme', 'light');
    }
  });


let currentFilter = 'all';

function updateStats() {
  const total = todoList.length;
  const completed = todoList.filter(todo => todo.completed).length;
  const active = total - completed;

  document.querySelector('.js-total-count').innerText = total;
  document.querySelector('.js-completed-count').innerText = completed;
  document.querySelector('.js-active-count').innerText = active;
}


function renderTodoList() {

  let todoListHTML = '';

  todoList.forEach((todoObject, index) => {

    const { name, dueDate, tag, completed } = todoObject;

    const isOverdue =
      dueDate &&
      !completed &&
      new Date(dueDate) < new Date().setHours(0, 0, 0, 0);

    if (
      (currentFilter === 'completed' && !completed) ||
      (currentFilter === 'active' && completed)
    ) {
      return;
    }

    const html = ` 
     

    <div class="
    ${completed ? 'completed-task' : ''}
    ${isOverdue ? 'overdue-task' : ''}
    ">
    <input type="checkbox" ${completed ? 'checked' : ''}
    class="js-complete-checkbox"
    data-index=${index}>
    ${name} 
    
    </div>

    <div>${dueDate}</div>

    <div class="
    ${completed ? 'completed-task' : ''}
    ${isOverdue ? 'overdue-task' : ''}
    ">
    ${tag ? `<span class="tag">#${tag}</span>` : ''}
    </div>

    

    <button class="delete-todo-button 
    js-delete-todo-button">DELETE</button>
    
    `;
    todoListHTML += html;


  })




  document.querySelector('.js-todo-list')
    .innerHTML = todoListHTML;

  updateStats();

  document.querySelectorAll('.js-complete-checkbox')
    .forEach((checkbox) => {
      checkbox.addEventListener('change', (event) => {
        const index = event.target.dataset.index;
        todoList[index].completed = event.target.checked;

        saveToLocalStorage();
        renderTodoList();
      })

    });

  document.querySelectorAll('.js-delete-todo-button')
    .forEach((deleteButton, index) => {

      deleteButton.addEventListener('click', () => {
        todoList.splice(index, 1);

        saveToLocalStorage();
        renderTodoList();
      });
    });
}

document.querySelectorAll('.js-filter-button')
  .forEach((button) => {
    button.addEventListener('click', () => {

      document.querySelector('.active')
        .classList.remove('active');

      button.classList.add('active');

      currentFilter = button.dataset.filter;

      renderTodoList();
    });
  });


document.querySelector('.js-add-todo-button')
  .addEventListener('click', () => {
    addTodo();
  });

document.addEventListener('keydown', (event) => {
  if (event.key === 'Enter') {
    addTodo();
  }

  if (event.ctrlKey && event.key.toLowerCase() === 'd') {
    if (todoList.length === 0) return;

    const lastIndex = todoList.length - 1;
    todoList[lastIndex].completed = !todoList[lastIndex].completed;

    saveToLocalStorage();
    renderTodoList();
  }


  if (event.key === 'Delete') {
    if (todoList.length === 0) return;

    todoList.pop();
    saveToLocalStorage();
    renderTodoList();
  }
});

function addTodo() {
  const inputElement = document.querySelector('.js-name-input')
  const name = inputElement.value;

  const dateInputElement = document.querySelector('.js-dueDate-input');
  const dueDate = dateInputElement.value;

  const tagInput = document.querySelector('.js-tag-input')
  const tag = tagInput.value;

  todoList.push({

    name,
    dueDate,
    tag,
    completed: false
  });


  inputElement.value = '';
  tagInput.value = '';



  saveToLocalStorage();
  renderTodoList();
}

function saveToLocalStorage() {
  localStorage.setItem('todoList', JSON.stringify(todoList));
}

renderTodoList();