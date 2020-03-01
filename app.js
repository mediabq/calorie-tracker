//Storage Controller

//Item Controller
const ItemCtrl = (function() {
  //Item Constructor
  const Item = function(id, name, calories) {
    this.id = id;
    this.name = name;
    this.calories = calories;
  };

  //Data Structure / State
  const state = {
    items: [
      //   { id: 0, name: 'Steak Dinner', calories: 1200 },
      //   { id: 1, name: 'Cookie', calories: 400 },
      //   { id: 2, name: 'Eggs', calories: 300 }
    ],
    currentItem: null,
    totalCalories: 0
  };

  //Public Methods
  return {
    getItems: function() {
      return state.items;
    },

    addItem: function(name, calories) {
      //Create ID
      if (state.items.length > 0) {
        ID = state.items[state.items.length - 1].id + 1;
      } else {
        ID = 0;
      }

      //calories to number
      calories = parseInt(calories);

      //Create new item
      newItem = new Item(ID, name, calories);
      state.items.push(newItem);

      return newItem;
    },
    getItemById: function(id) {
      let found = null;
      //Loop through items
      state.items.forEach(function(item) {
        if (item.id === id) {
          found = item;
        }
      });
      return found;
    },
    updateItem: function(name, calories) {
      //Calories to number
      calories = parseInt(calories);

      let found = null;

      state.items.forEach(function(item) {
        if (item.id === state.currentItem.id) {
          item.name = name;
          item.calories = calories;
          found = item;
        }
      });
      return found;
    },
    deleteItem: function() {
      let found = null;

      state.items.forEach(function(item) {
        if (item.id === state.currentItem.id) {
          found = item;
          state.items.splice(item.id, 1);
        }
      });
      return found;
    },
    clearAllItems: function() {
      state.items = [];
    },
    setCurrentItem: function(item) {
      state.currentItem = item;
    },
    getCurrentItem: function() {
      return state.currentItem;
    },
    getTotalCalories: function() {
      let total = 0;

      //Loop through items and add cals
      state.items.forEach(function(item) {
        total += item.calories;
      });

      //Set total cal in data structure
      state.totalCalories = total;

      //Return total
      return state.totalCalories;
    },
    logState: function() {
      //Public Methods
      return state;
    }
  };
})();

// UI Controller
const UICtrl = (function() {
  const UISelectors = {
    itemList: '#item-list',
    listItems: '#item-list li',
    addBtn: '.add-btn',
    updateBtn: '.update-btn',
    deleteBtn: '.delete-btn',
    backBtn: '.back-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories',
    clearBtn: '.clear-btn'
  };

  return {
    populateItemList: function(items) {
      let html = '';

      items.forEach(function(item) {
        html += `<li class="collection-item" id="item-${item.id}">
                    <strong>${item.name}: </strong><em>${item.calories} Calories</em>
                    <a href="#" class="secondary-content">
                        <i class="edit-item fas fa-pencil-alt"></i>
                    </a>
                </li>`;
      });

      //Insert list items
      document.querySelector(UISelectors.itemList).innerHTML = html;
    },

    getItemInput: function() {
      return {
        name: document.querySelector(UISelectors.itemNameInput).value,
        calories: document.querySelector(UISelectors.itemCaloriesInput).value
      };
    },

    addListItem: function(item) {
      // Show the list
      document.querySelector(UISelectors.itemList).style.display = 'block';

      //Create li element
      const li = document.createElement('li');
      li.className = 'collection-item';
      li.id = `item-${item.id}`;

      //Add HTML
      li.innerHTML = `
            <strong>${item.name}: </strong><em>${item.calories} Calories</em>
            <a href="#" class="secondary-content">
                <i class="edit-item fas fa-pencil-alt"></i>
            </a>
        `;

      //Insert item
      document
        .querySelector(UISelectors.itemList)
        .insertAdjacentElement('beforeend', li);
    },
    updateListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).innerHTML = `
              <strong>${item.name}: </strong><em>${item.calories} Calories</em>
              <a href="#" class="secondary-content">
              <i class="edit-item fas fa-pencil-alt"></i>
          </a>`;
        }
      });
    },
    deleteListItem: function(item) {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      listItems = Array.from(listItems);
      listItems.forEach(function(listItem) {
        const itemID = listItem.getAttribute('id');

        if (itemID === `item-${item.id}`) {
          document.querySelector(`#${itemID}`).remove();
        }
      });
    },
    removeAllItems: function() {
      let listItems = document.querySelectorAll(UISelectors.listItems);

      //turn node list into array
      listItems = Array.from(listItems);
      listItems.forEach(function(item) {
        item.remove();
      });

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total cal to UI
      UICtrl.showTotalCalories(totalCalories);

      UICtrl.hideList();
    },
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    addItemToForm: function() {
      document.querySelector(
        UISelectors.itemNameInput
      ).value = ItemCtrl.getCurrentItem().name;
      document.querySelector(
        UISelectors.itemCaloriesInput
      ).value = ItemCtrl.getCurrentItem().calories;
      UICtrl.showEditState();
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
    },
    clearEditState: function() {
      UICtrl.clearInput();
      document.querySelector(UISelectors.updateBtn).style.display = 'none';
      document.querySelector(UISelectors.deleteBtn).style.display = 'none';
      document.querySelector(UISelectors.backBtn).style.display = 'none';
      document.querySelector(UISelectors.addBtn).style.display = 'inline';
    },
    showEditState: function() {
      document.querySelector(UISelectors.updateBtn).style.display = 'inline';
      document.querySelector(UISelectors.deleteBtn).style.display = 'inline';
      document.querySelector(UISelectors.backBtn).style.display = 'inline';
      document.querySelector(UISelectors.addBtn).style.display = 'none';
    },
    getSelectors: function() {
      return UISelectors;
    }
  };
})();

//App Controller
const App = (function(ItemCtrl, UICtrl) {
  //Load Event Listeners
  const loadEventListeners = function() {
    //Get UI Selectors
    const UISelectors = UICtrl.getSelectors();

    //Add Item Event
    document
      .querySelector(UISelectors.addBtn)
      .addEventListener('click', itemAddSubmit);

    // Disable submit on enter
    document.addEventListener('keypress', function(e) {
      if (e.keyCode === 13 || e.which === 13) {
        e.preventDefault();
        return false;
      }
    });

    //Edit Icon click
    document
      .querySelector(UISelectors.itemList)
      .addEventListener('click', itemEditClick);

    //Back Button Click
    document
      .querySelector(UISelectors.backBtn)
      .addEventListener('click', UICtrl.clearEditState);

    //Delete Button Click
    document
      .querySelector(UISelectors.deleteBtn)
      .addEventListener('click', itemDelete);

    //Clear Button Click
    document
      .querySelector(UISelectors.clearBtn)
      .addEventListener('click', clearAllItemsClick);

    //Update Item Event
    document
      .querySelector(UISelectors.updateBtn)
      .addEventListener('click', itemUpdateSubmit);
  };

  //Add item submit
  const itemAddSubmit = function(e) {
    //Get for imput from ui component
    const input = UICtrl.getItemInput();

    //check for name and calories input
    if (input.name !== '' && input.calories !== '') {
      //add item
      const newItem = ItemCtrl.addItem(input.name, input.calories);

      // Add item to UI list
      UICtrl.addListItem(newItem);

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total cal to UI
      UICtrl.showTotalCalories(totalCalories);

      //Clear fields
      UICtrl.clearInput();
    }
    e.preventDefault();
  };

  //Click Edit Item
  const itemEditClick = function(e) {
    if (e.target.classList.contains('edit-item')) {
      //Get list item ID
      const listId = e.target.parentNode.parentNode.id;
      console.log('test');

      //Break into an array
      const listIdArr = listId.split('-');

      //Get the Id number
      const id = parseInt(listIdArr[1]);

      //Get the item
      const itemToEdit = ItemCtrl.getItemById(id);

      //Set Current Item
      ItemCtrl.setCurrentItem(itemToEdit);

      //Add Item to edit
      UICtrl.addItemToForm();
    }
    e.preventDefault();
  };

  const itemUpdateSubmit = function(e) {
    const input = UICtrl.getItemInput();

    const updatedItem = ItemCtrl.updateItem(input.name, input.calories);

    UICtrl.updateListItem(updatedItem);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total cal to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    e.preventDefault();
  };

  const itemDelete = function(e) {
    const itemToDelete = ItemCtrl.deleteItem();

    UICtrl.deleteListItem(itemToDelete);

    //Get total calories
    const totalCalories = ItemCtrl.getTotalCalories();

    //Add total cal to UI
    UICtrl.showTotalCalories(totalCalories);

    UICtrl.clearEditState();

    const items = ItemCtrl.getItems();

    if (items.length === 0) {
      UICtrl.hideList();
    }

    e.preventDefault();
  };

  const clearAllItemsClick = function(e) {
    //Delete All Items from data
    ItemCtrl.clearAllItems();

    //Remove all items from UI
    UICtrl.removeAllItems();
  };

  //Public Methods
  return {
    init: function() {
      //Set initial state
      UICtrl.clearEditState();

      const items = ItemCtrl.getItems();

      //Check if any items exist
      if (items.length === 0) {
        UICtrl.hideList();
      } else {
        UICtrl.populateItemList(items);
      }

      //Get total calories
      const totalCalories = ItemCtrl.getTotalCalories();

      //Add total cal to UI
      UICtrl.showTotalCalories(totalCalories);

      //Load Event Listeners
      loadEventListeners();
    }
  };
})(ItemCtrl, UICtrl);

App.init();
