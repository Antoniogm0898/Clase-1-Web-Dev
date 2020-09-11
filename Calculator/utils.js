function get_element_li (name, price) {
  return `<li class="added-item">name: ${name} price: <span class="price">${price}</span> <button class="remove-item">remove</button></li>`
}

let add_item_to_list_with_template = () => {
  return (event) => {

      //Create item to add
      let item_name = document.querySelector("#item-name").value;
      let item_value = document.querySelector("#item-value").value;
      let li_template = get_element_li(item_name, item_value);

      //Check the input
      if (!isValid(item_name, item_value)) {
          return;
      }

      //If the input is correct we will add it to the list
      //We create the item listand append the element created
      let item_list = document.getElementById("item-list");
      let item_element = document.createElement("li");
      item_element.innerHTML = li_template;
      item_list.appendChild(item_element);

      //We need to add teh event listener inside the function so it knows which node to remove
      let btn = item_element.getElementsByClassName("remove-item")[0];
      btn.addEventListener("click", remove_item());

      // add the value to the total
      updateTotal();
  }
}

let remove_item = () => {
  return (event) => {
      let select = event.target;
      //After clarifying which node to remove we remove the elements and the list
      select.parentNode.parentNode.remove();
      updateTotal();
  }
}

function isValid(inputName, inputValue) {
  //If either field is left empty or a string was inserted in value it will report an error.
  let container = document.getElementById("container"); 
  if (inputName.length == 0 || inputValue.length == 0 || isNaN(inputValue)){
    //If the input is invalid the container will be set red
    container.style.borderColor = "red";
    return false;
  }
  //If the input is valid the container will not change, in case it was red it will be set white
  container.style.borderColor = "white";
  return true;
}

function updateTotal () {
  //We call item list to get the amount of rows in the list
  let item_rows = document.getElementById("item-list").getElementsByClassName("added-item")
  let total = 0.0;
  //We add all the elements in the list
  for (var i = 0; i < item_rows.length; i++) {
      let price_value = Number(item_rows[i].getElementsByClassName("price")[0].innerHTML);
      total += price_value;
  }
  //If we empty the list we let the user know the list is now empty
  if(total == 0){
    document.getElementById("total").innerHTML = "Lista vacia"
  }
  else{
    document.getElementById("total").innerHTML = total;
  }
}


document.getElementById("add-item").addEventListener("click", add_item_to_list_with_template());
