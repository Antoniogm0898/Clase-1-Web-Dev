  import axios from 'axios'
  import express from 'express'
  import cors from 'cors'
  app.use(express.json())
  app.use(cors())
  const app = express()
  let savedPkmn = {}
  let pokemonById = {}

  //Request the body, parameters and query when starting
  function processStart (req) {
      return Object.assign({}, req.body, req.params, req.query)
  }

  //Main
  app.get('/pokemon', function(req, res) {
    //Load the parameters
    let params = processStart(req)
    let pokemon_name = params.name

    //Check which of the pokemons has been saved already
    if(savedPkmn.hasOwnProperty(pokemon_name)) {
      //Load the pokemons attributes if they are found
        let attributes = savedPkmn[pokemon_name]
        //We let them know there is no error and send the info. We will resuse this
        res.send({fail: false, attributes})
        return;
    }
    //Get the information form the API
    axios.get('https://pokeapi.co/api/v2/pokemon/').then((ans) => {
          //Assign all the results to the pokedex
          let pokedex  = ans.data.results
          //Use the pokedex to find the desired pokemon
          let pokemon = pokedex.find(element => element.name === pokemon_name)
          //If a pokemon does not exist report the error and compile 
          if(pokemon === undefined){
            res.send({fail: true, message: "ERROR, Pokemon does not exist"})
            return;
          } //If it is found
          else{
            axios.get(pokemon.url).then((ans) => {
                //Set the attributes for each specific pokemon  
                let attributes = ans.data
                savedPkmn[pokemon_name] = attributes
                  pokemonById[attributes.id] = pokemon_name
                  res.send({fail: false, attributes})
                  return;
              })
              .catch(error => {
                res.send({fail: true, message: "ERROR, Pokemon could not be located"})
                return;
              })
          }
        })
  })

  //create which will create a new card(use the post http method)
  app.post('/create', function(req, res) {
    //To get new pokemon we init it
    let params = processStart(req)
    let attributes = {}
    let newPkmn = params.name

    //Set all the atribtues in their corresponding section
    attributes.id = params.id
    attributes.weight = params.weight
    attributes.height = params.height
    attributes.base_experience = params.base_experience
    attributes.types = params.types

    //Assign all to the correct pokemon
    pokemonById[attributes.id] = newPkmn
    savedPkmn[newPkmn] = attributes
  })

  //get which will return one card with the corresponding id(use the get http method, 
  //send id as a place holder of the api)

  app.get('/get/:id', function(req, res) {
    //Find the pokemon with the id and return it
      let pokemon_name = pokemonById[req.param.id]
      attributes = savedPkmn[pokemon_name]
      res.send(pokemon_name, attributes)
  })

  //getAll which will return all cards(use the get http method)
  app.get('/getAll', function(req, res) {
    //Sends all the pokemonisSavedPkmn
      res.send(savedPkmn)
  })

  //update which will update a card(use the put method, 
  //send id as a place holder and data as the body of request)

  app.put('/update/:id', function(req, res) {
    //To get new pokemon we init it
    let params = processStart(req)
    let attributes = {}

    //Get the attributes
    attributes.id = req.param.id
    attributes.weight = params.weight
    attributes.height = params.height
    attributes.base_experience = params.base_experience
    attributes.types = params.types

    //Set new pokemon
    let newPkmn = pokemonById[attributes.id]
    savedPkmn[newPkmn] = attributes
  })

  //Delete a card
  app.get('/delete/:id', function(req, res) {
    //Get the id
    let id = req.param.id
    let pokemon_name = pokemonById[id]
    //Delete the card
    delete pokemonById[id]
    delete savedPkmn[pokemon_name]
  })

  //Listen on port 3000
  app.listen(3000)
