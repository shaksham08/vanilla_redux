function createStore(reducer) {
  const store = {
    todos: [],
  };

  function getStore() {
    return this.store;
  }

  function dispatch() {}
}

function reducer(storeData, action) {}
