const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const { query } = require('express')
const app = express()
const port = 5000
const regexForm = /([a-zA-Z]*)(\$[a-z]*)([0-9]*)/
//var pokemonModel;
var pokemonTypes;
var pokemons;
var pokemonModel;
const { handleErr } = require("./errorHandler.js")

const { asyncWrapper } = require("./asyncWrapper.js")
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonNameLengthError,
  PokemonCastError
} = require("./errors.js")

app.use(express.json())

const start =asyncWrapper(async ()=> {
  app.listen(process.env.PORT || port, async (err) => {

    await mongoose.connect('mongodb+srv://lunaticky:rhanchd6@cluster0.rfmec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'); 
    if(err)
      throw new PokemonDbError(err)

  
    var data = "";
    https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json", async (res) => {
      res.on('data', (chunk) => {
        data += chunk // aggregate data
      });
      res.on('end', () => {
        console.log("The types of pokemons are loaded from the url.")
        pokemonTypes = JSON.parse(data).map(type => {
          return type.english;
        })
      })
    }).on('error', (e) => {
      // listen for error 
      console.log(e.message);
    });
  
    const { Schema } = mongoose;
    const pokemonSchema = new Schema({
      "id": {
        type: Number,
        unique: true
      },
      "name": {
        "english": {
          type: String,
          maxlength: 20
        },
        "japanese": {
          type: String
        },
        "chinese": {
          type: String
        },
        "french": {
          type: String
        }
      },
      "type": {
        type: [String],
        enum: pokemonTypes
      },
      "base": {
        "HP": Number,
        "Attack": Number,
        "Defense": Number,
        "Sp. Attack": Number,
        "Sp. Defense": Number,
        "Speed": Number
      }
    });
  
    pokemonModel = mongoose.model("pokemons", pokemonSchema)
  
    var chunks = ""
    https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/pokedex.json", async (res) => {
  
      res.on('data', (chunk) => {
        chunks += chunk;
      });
      res.on('end', async () => {
        pokemons = JSON.parse(chunks);
  
  
        pokemonModel.count(function (err, count) {
          if (!err && count === 0) {
            pokemonModel.create(pokemons);
          } else {
            pokemonModel.collection.drop();
            pokemonModel.create(pokemons);
          }
      });
  
        console.log("pokemons are loaded into database");
        // pokemons.forEach((pokemon)=>{
        //   const newPokemon = new pokemonModel(pokemon);
        //   newPokemon.save();
        // });
      })
    })
    console.log(`Example app listening on port ${port}`)
  })
})

start();


// 1 - establish the connectino the db
// 2 - create the schema
// 3 - create the model
// 4 - populate the db with pokemons

app.get('/', (req, res) => {
  res.send(pokemonTypes);
})

// app.get('/api/v1/pokemons?count=2&after=10')     // - get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons', asyncWrapper(async (req, res)=> {
  var after = null
  var count = null

  var size = Object.keys(req.query).length
  console.log(size)
  if(size != 0){
    if(req.query.after == null){
      throw new PokemonBadRequestMissingAfter()
    }
    after = {id: {$gt: parseInt(req.query.after)}}
    count = parseInt(req.query.count)
    const doc = await pokemonModel.find(after).limit(count)
    
      if (doc.length == 0){
        throw new PokemonNotFoundError()
      } else {
        res.json(doc)
      }
   } else {
          const doc = await pokemonModel.find({})
          if(doc)
            res.json(doc)
          else
            throw new PokemonBadRequest()
      }
      }
))

// app.post('/api/v1/pokemon')                      // - create a new pokemon
app.post('/api/v1/pokemon', asyncWrapper(async (req,res)=>{
  var pokemonDex = req.body
  let product = await pokemonModel.exists({id: pokemonDex.id});
  
  var sizeOfObject = Object.keys(pokemonDex).length
  var dbQuerySize = Object.keys(pokemonModel).length
  let pokeNameLeng = req.body.name.english.length;

  if (pokeNameLeng>20){
    throw new PokemonNameLengthError("");
  }

  // var jsonLenth = parseInt(Object.keys(pokemonModel).length);

  //Check if there is an ID in the request body
  if(!pokemonDex.id){
    throw new PokemonBadRequestMissingID("");
  } else {
      if(!pokemonDex || sizeOfObject === 0){
        throw new PokemonBadRequest("");
      }else if(product){
        throw new PokemonDuplicateError("");
      } else {
        pokemonModel.create(pokemonDex)
        .then((doc) => {
          return res.json({ msg: "post complited"})
        })     
      }
  }
}))



// app.get('/api/v1/pokemon/:id')                   // - get a pokemon
app.get('/api/v1/pokemon/:id', asyncWrapper(async (req,res)=>{
  
  var id = req.params.id;
  // var regExp = /[a-zA-Z]/g;

  if(/[^0-9]/i.test(id)){
   throw new PokemonCastError("")
  }
  const doc = await pokemonModel.findOne({id: id})
  if(doc){
    res.json(doc)
  } else {
    throw new PokemonNotFoundError("")
  }
  }
));

// app.get('/api/v1/pokemonImage/:id')              // - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', asyncWrapper(async (req,res)=>{
  var id = req.params.id;
  var newId;
  //Converts ID to three-character letters for use in image url
  if (id.length == 1){
    newId = '00' + id;
  } else if(id.length == 2){
    newId = '0' + id;
  } else {
    newId = id;
  }

  const doc = await pokemonModel.findOne({id: id})
    if (doc == null){
      throw new PokemonNotFoundError("")
    } else {
      res.json({url:`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${newId}.png`})
    }
  }));

// app.put('/api/v1/pokemon/:id')                   // - upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {
  // upserts a whole pokemon document
  var inputId = parseInt(req.params.id);
  const { id, ...rest } = req.body;
  const doc = await pokemonModel.findOneAndUpdate({ id: inputId }, rest, { runValidators: true, new:true, upsert: true })
  console.log('doc ==') 
  console.log(doc)
    if(doc){
      res.json({ msg:"Updated or created Successfully", pokeInfo: doc})
    } else {
      throw new PokemonNotFoundError("")
    }
}))


// app.patch('/api/v1/pokemon/:id')                 // - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', asyncWrapper(async (req,res)=>{
  var inputId = parseInt(req.params.id);
  const { id, ...rest } = req.body;

  const doc = await pokemonModel.findOneAndUpdate({ id: inputId }, rest, { runValidators: true, new:true})
  if (doc) {
    res.json({
      msg: "Updated Successfully",
      pokeInfo: doc
    })
  } else {
    
    throw new PokemonNotFoundError("");
  }
}))

// app.delete('/api/v1/pokemon/:id')                // - delete a  pokemon
app.delete('/api/v1/pokemon/:id', asyncWrapper(async (req, res) => {

    var id = parseInt(req.params.id);
    const docs = await pokemonModel.deleteOne({id:id})
    console.log(docs['deletedCount'])
    console.log(docs)
    if(docs['deletedCount'] == 0)
      throw new PokemonNotFoundError("");
    else
          res.json({
        msg: "Deleted Successfully"
      })
        
}))

// Improper Route
app.get('*', function (req, res) {
  // res.json({msg: "Error : Improper route"});
  throw new PokemonNoSuchRouteError("");
})

app.use(handleErr)