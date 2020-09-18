//We will use the promise to get the pokemon by name
let get_pokemon_promise = (pokemonName) => {
  return new Promise((resolve, reject) => {
    let req = new XMLHttpRequest();
    req.open("GET", `https://pokeapi.co/api/v2/pokemon/${pokemonName}`, true);
    // Gets executed when readyState changes even if it is not a 4 state
    req.onreadystatechange = (req_event) => {
      console.log("inside the event handler of the request");
      // If request finished / received the answer
      if (req.readyState == 4) {
        // If it finished fine
        if (req.status == 200) {
          return resolve(req.response);
        } else {
          return reject(req.reject);
        }
      }
    };
    req.send(null);
  });
};

//Global variables
const pokemon_list = "item_list";
const add_pokemon = "add-pokemon";
const pokemon_input = "pokemon-input";
let total_weight = 0;

//We prepare everything to create the pokemon card
let get_pokemon_card = (name, weight, photo) => {
  //Declare the list and the division for the body
  //We also declare the name, weight and image
  let li = document.createElement("li");
  let image = document.createElement("img");
  let cardBody = document.createElement("div");
  let cardTitle = document.createElement("h4");
  let cardText = document.createElement("p");
  let spanWeight = document.createElement("span");

  //Assign the class name for each & src for the image
  li.className = "pokemon-li";
  image.className = "pokemon-img";
  image.src = photo;
  cardTitle.className = "card-title";
  cardText.className = "card-text";
  spanWeight.className = "pokemon-weight";

  spanWeight.append(document.createTextNode(weight));
  cardTitle.append(document.createTextNode(name));
  cardBody.append(cardTitle);
  cardBody.append(document.createTextNode("Weight: "));
  cardBody.append(spanWeight);


  //Create the pokemon's card and insert all the required elements
  let card = document.createElement("div");
  card.className = "card";
  card.style = "width: 20rem; margin-bottom: 2em;";
  card.append(image);
  card.append(cardBody);

  //We must be able to update the list: We added a button to remove each pokemon and the weight will be updated if they are removed
  let button = document.createElement("button");
  button.className = "btn btn-danger";
  button.append(document.createTextNode("Remove Pokemon"));

  button.addEventListener("click", (event) => {
    total_weight -= weight;
    document.getElementById(pokemon_list).removeChild(card);
    document.getElementById("total").innerHTML = `Total weight: ${total_weight}`;
  });
  card.append(button);

  // Add the weight of the pokemon to the sum
  total_weight += weight;
  document.getElementById("total").innerHTML = `Total weight: ${total_weight}`;

  return card;
};

function insert_pokemon_element_with_template(pokemonName, template_function) {
  let promise_thenable = (result) => {
    document.getElementById(pokemon_list).style.visibility = "visible";
    result = JSON.parse(result);
    let weight = result.weight;
    let sprite = result.sprites.front_default;
    let cardNode = template_function(pokemonName, weight, sprite);
    document.getElementById(pokemon_list).append(cardNode);
    checkPoke(true);
    return result;
  };

  get_pokemon_promise(pokemonName)
    .then(promise_thenable)
    .catch((err) => {
      checkPoke(false);
      return err;
    });
}


function checkPoke(worked) {
  let alarm_div = document.getElementById("alarm-space");
    alarm = "POKEMON DOES NOT EXIST"
  let alarm_id = "alarm";

  if(worked){
    if (alarm_div.hasChildNodes()){
      alarm_div.lastChild.remove();
    }
  }

  if (!worked &&   !(alarm_div.hasChildNodes())) {
    alarm_div.insertAdjacentText("beforeEnd", alarm);
  }



}

// When the DOM is loaded
document.addEventListener("DOMContentLoaded", function (event) {
  document.getElementById("total").innerHTML = "Total weight: 0";

  document.getElementById(add_pokemon).addEventListener("click", (event) => {
    pokeName = document
      .getElementById(pokemon_input)
      .value.trim()
      .toLowerCase();
    insert_pokemon_element_with_template(pokeName, get_pokemon_card);
  });
});

