function createStore(reducerFn, initialState) {
  let store = initialState;
  const reducer = reducerFn;
  const listeners = [];

  function getStore() {
    return store;
  }

  function dispatch(action) {
    store = reducer(store, action);
    listeners.forEach((listener) => listener());
  }

  function subscribe(listener) {
    listeners.push(listener);
    return () => {
      const index = listeners.indexOf(listener);
      if (index !== -1) {
        listeners.splice(index, 1);
      }
    };
  }

  return { getStore, dispatch, subscribe };
}

function reducer(state, action) {
  const { type, payload } = action;
  switch (type) {
    case "ADD_TODO": {
      return { ...state, todos: [...state.todos, payload] };
    }
    case "REMOVE_TODO": {
      const todos = state.todos.filter(({ id }) => id !== payload);
      return { ...state, todos };
    }
    case "CLEAR_TODO": {
      return { ...state, todos: [] };
    }
    default:
      return state;
  }
}

const initialState = {
  todos: [],
};

const store = createStore(reducer, initialState);

function renderTodoList() {
  const todoListDiv = document.getElementById("todoList");
  const todos = store.getStore().todos;
  todoListDiv.innerHTML = "";
  todos.forEach((todo) => {
    const todoDiv = document.createElement("div");
    todoDiv.classList.add("todoItem");
    todoDiv.textContent = todo.todo;

    const removeButton = document.createElement("button");
    removeButton.textContent = "Remove";
    removeButton.classList.add("removeButton");
    removeButton.setAttribute("data-id", todo.id);
    removeButton.addEventListener("click", () => removeTodo(todo.id));

    todoDiv.appendChild(removeButton);
    todoListDiv.appendChild(todoDiv);
  });
}

function addTodo() {
  const todoInput = document.getElementById("todoInput");
  const todoText = todoInput.value.trim();
  if (todoText) {
    const newTodo = {
      id: Date.now(),
      todo: todoText,
    };
    store.dispatch({
      type: "ADD_TODO",
      payload: newTodo,
    });
    todoInput.value = "";
  }
}

function removeTodo(todoId) {
  store.dispatch({
    type: "REMOVE_TODO",
    payload: todoId,
  });
}

// Initial rendering
renderTodoList();

function clearAllTodos() {
  store.dispatch({
    type: "CLEAR_TODO",
  });
}

store.subscribe(renderTodoList);
