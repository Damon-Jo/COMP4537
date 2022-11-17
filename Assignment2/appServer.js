const mongoose = require("mongoose")
const express = require("express")
const { connectDB } = require("./connectDB.js")
const { populatePokemons } = require("./populatePokemons.js")
const { getTypes } = require("./getTypes.js")
const { handleErr } = require("./errorHandler.js")
const {
  PokemonBadRequest,
  PokemonBadRequestMissingID,
  PokemonBadRequestMissingAfter,
  PokemonDbError,
  PokemonNotFoundError,
  PokemonDuplicateError,
  PokemonNoSuchRouteError,
  PokemonNameLengthError,
  PokemonCastError,
  PokemonNoToken,
  PokemonNotAdmin,
  PokemonNotFoundUser,
  PokemonWrongPassword
} = require("./errors.js")

const cookieParser = require("cookie-parser");
const tokenList = require("./tokenList");

const { asyncWrapper } = require("./asyncWrapper.js")

const dotenv = require("dotenv")
dotenv.config();

const app = express()
var pokemonModel = null;

const start = asyncWrapper(async () => {
  await connectDB();
  const pokemonTypes = await getTypes();
  pokemonModel = await populatePokemons(pokemonTypes);

  app.listen(process.env.pokeServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.pokeServerPORT}`);
  })
})
start()
app.use(express.json())

const jwt = require("jsonwebtoken")

const auth = asyncWrapper(async (req, res, next) => {
  // const token = req.header('auth-token')
  const token = req.query["appId"];
  console.log("token");
  console.log(token);
  if (!token) {
    throw new PokemonNoToken("")
  }
  // ###################################################
  const tokenData = await tokenList.findOne({ token: token });
  console.log("tokenData");
  console.log(tokenData);
  if (!tokenData) throw new PokemonNoToken("");
  // console.log(tokenDB);
  if (tokenData.blocked) {
    throw new PokemonNoToken("");
  }
  try {
    const verified = jwt.verify(token, process.env.TOKEN_SECRET); // nothing happens if token is valid
    next();
  } catch (err) {
    throw new PokemonBadRequest("");
  }
});





app.use(auth) // Boom! All routes below this line are protected
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

const authFromAdmin = asyncWrapper(async (req, res, next) => {
  const token = req.query["appId"];
  const tokenData = await tokenList.findOne({ token: token });
  if (tokenData.userType === "Admin") {
    next();
  } else {
    throw new PokemonNotAdmin();
  }
});

app.use(authFromAdmin);
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

// Improper Route
app.get('*', function (req, res) {
  // res.json({msg: "Error : Improper route"});
  throw new PokemonNoSuchRouteError("");
})


app.use(handleErr)
