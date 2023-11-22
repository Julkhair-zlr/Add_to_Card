import {initializeApp} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-app.js";
import {getDatabase, ref, push, onValue, remove} from "https://www.gstatic.com/firebasejs/9.15.0/firebase-database.js";

const appSettings = {
  databaseURL : "https://realtime-database-33b8c-default-rtdb.asia-southeast1.firebasedatabase.app/"
}

const app = initializeApp(appSettings)
const database = getDatabase(app)
const shoppingListInDB = ref(database, "shoppingList")

const inputFieldEl = document.getElementById("input-field")
const addButtonEl = document.getElementById("add-button")
const shoppingListEl = document.getElementById("shopping-list")

addButtonEl.addEventListener("click", function() {
    let inputValue = inputFieldEl.value;
    
    let firstLetterCapital = inputValue[0].toUpperCase() + inputValue.slice(1);
    push(shoppingListInDB, firstLetterCapital)
    
    clearInputFieldEl()
})

onValue(shoppingListInDB, function(snapshot) {
    if (snapshot.exists()) {
        let itemsArray = Object.entries(snapshot.val())
        clearShoppingListEl()
        
        for (let i = 0; i < itemsArray.length; i++) {
            let currentItem = itemsArray[i]
            let currentItemID = currentItem[0]
            let currentItemValue = currentItem[1]
            
            appendItemToShoppingListEl(currentItem)
        }    
    } else {
        shoppingListEl.innerHTML = "No items here... yet..."
        shoppingListEl.style.color="#fff"
        shoppingListEl.style.fontWeight="bold"
    }
})

function clearShoppingListEl() {
    shoppingListEl.innerHTML = ""
}

function clearInputFieldEl() {
    inputFieldEl.value = ""
}


function appendItemToShoppingListEl(item) {
    let itemID = item[0]
    let itemValue = item[1]
    
    let newEl = document.createElement("li")
    newEl.textContent = itemValue
    let divEl = document.createElement("div")
    // Edit button (icon)
    let editButton = document.createElement("span")
    editButton.innerHTML = '<i class="fas fa-edit"></i>'
    editButton.classList.add('btn')
    
    editButton.addEventListener("click", function() {
        let newItemValue = prompt("Edit item:", itemValue);

        if (newItemValue !== null) {
            updateItemInDatabase(itemID, newItemValue);
        }
    })
    
    // Delete button (icon)
    let deleteButton = document.createElement("span")
    deleteButton.innerHTML = '<i class="fas fa-trash-alt"></i>'
    deleteButton.classList.add('btn')
    
    deleteButton.addEventListener("click", function() {
        let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
        remove(exactLocationOfItemInDB)
    })
    
    divEl.appendChild(editButton)
    divEl.appendChild(deleteButton)
    newEl.append(divEl)
    shoppingListEl.append(newEl)
}

function updateItemInDatabase(itemID, newItemValue) {
    let exactLocationOfItemInDB = ref(database, `shoppingList/${itemID}`)
    set(exactLocationOfItemInDB, newItemValue)
}
