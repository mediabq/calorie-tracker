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
    addBtn: '.add-btn',
    itemNameInput: '#item-name',
    itemCaloriesInput: '#item-calories',
    totalCalories: '.total-calories'
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
    hideList: function() {
      document.querySelector(UISelectors.itemList).style.display = 'none';
    },
    clearInput: function() {
      document.querySelector(UISelectors.itemNameInput).value = '';
      document.querySelector(UISelectors.itemCaloriesInput).value = '';
    },
    showTotalCalories: function(totalCalories) {
      document.querySelector(
        UISelectors.totalCalories
      ).textContent = totalCalories;
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

  //Public Methods
  return {
    init: function() {
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
