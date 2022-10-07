const express = require('express')
const mongoose = require('mongoose')
const https = require('https')
const { get } = require('http')

const app = express()
const port = 5000

//var pokemonModel;
var pokemonTypes;
var pokemons;
var pokemonModel;

app.use(express.json())





app.listen(process.env.PORT || port, async () => {
  try {
    // mongoose.connect('mongodb+srv://lunaticky:rhanchd6@cluster0.rfmec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority')
    mongoose.connect('mongodb+srv://lunaticky:rhanchd6@cluster0.rfmec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'); 

  } catch (error) {
    console.log('db error');
  }

  var data = "";
  https.get("https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/types.json", async (res) => {
    res.on('data', (chunk) => {
      data += chunk // aggregate data
    });
    res.on('end', () => {
      // once data is completly fetched do JSON.parse();
      console.log('No more data in response.')
      // pokemonTypes = JSON.parse(data);
      pokemonTypes = JSON.parse(data).map(type => {
        return type.english;
      })
      // console.log(pokemonTypes)
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
      // once data is completly fetched do JSON.parse();
      console.log('No more data in response.')
      pokemons = JSON.parse(chunks);


      let product = await pokemonModel.exists({id: 1});

      if(product){
        pokemonModel.collection.drop();
        pokemonModel.create(pokemons);
      } else {
        pokemonModel.create(pokemons);
      }


      console.log("pokemons are loaded into database");
      // pokemons.forEach((pokemon)=>{
      //   const newPokemon = new pokemonModel(pokemon);
      //   newPokemon.save();
      // });
    })
  })




  console.log(`Example app listening on port ${port}`)
})


// 1 - establish the connectino the db

// 2 - create the schema

// 3 - create the model

// 4 - populate the db with pokemons

app.get('/', (req, res) => {
  // res.send(pokemonTypes)
  res.send(pokemonTypes);
})

// app.get('/api/v1/pokemons?count=2&after=10')     // - get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons', function(req, res) {
  console.log(req.query);
  var after = null
  var count = null

  if(req.query){
    after = {id: {$gt: parseInt(req.query.after)}}
    console.log(after)
    count = parseInt(req.query.count)


    pokemonModel.find(after).limit(count)
    .then((doc)=>{

      if (doc.length == 0){
        return res.status(200).json({ msg : "Error : pass pokemon id between 1 and 811"});
        // res.json({value:"Cast Error: pass pokemon id between 1 and 811"})
      } else {
        console.timeLog(doc)
        res.json(doc)
      }
    })
    .catch(err=>{
      return res.status(500).json({status: "ServerErrror", errMsg: "Error : when getting a pokemon"})
    })

  }else {
          pokemonModel.find({})
              .then(docs => { lengthChecker(res, docs) })
              .catch(err => {
                  console.error(err)
                  res.json({ msg: "Error returning all pokemon" })
          })
      }
})

// app.post('/api/v1/pokemon')                      // - create a new pokemon
app.post('/api/v1/pokemon', async (req,res)=>{
  var pokemonDex = req.body
  let product = await pokemonModel.exists({id: pokemonDex.id});

  if(!pokemonDex){
    return res.send('Invalid body');
  }else if(product){
    return res.status(200).json({ msg : "Error the id is duplicated"});
  } else {
    pokemonModel.create(pokemonDex)
    .then((doc) => {
      console.log('doc', doc)
      return res.status(200).json({status: "Success", msg: "post complited",data: doc})
    })
    .catch((err) => {
      console.log('err', err)
      return res.status(500).json({status: "ServerErrror", errMsg: "Error encountered when creating a pokemon"})
    })
  }
})

// app.get('/api/v1/pokemon/:id')                   // - get a pokemon
app.get('/api/v1/pokemon/:id', (req,res)=>{
  var id = req.params.id;
  pokemonModel.findOne({id: id})
    .then((doc)=>{

      if (doc == null){
        return res.status(200).json({ msg : "Error : pass pokemon id between 1 and 811"});
        // res.json({value:"Cast Error: pass pokemon id between 1 and 811"})
      } else {
        res.json(doc)
      }
    })
    .catch(err=>{
      return res.status(500).json({status: "ServerErrror", errMsg: "Error : when getting a pokemon"})
    })
});

// app.get('/api/v1/pokemonImage/:id')              // - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', (req,res)=>{
  var id = req.params.id;
  var newId;

  console.log(typeof id);
  if (id.length == 1){
    newId = '00' + id;
  } else if(id.length == 2){
    newId = '0' + id;
  } else {
    newId = id;
  }

  pokemonModel.findOne({id: id})
  .then((doc)=>{
    if (doc == null){
      res.json({value:"Cast Error: pass pokemon id between 1 and 811"})
    } else {
      res.json({url:`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${newId}.png`})
    }
  })
});

// app.put('/api/v1/pokemon/:id')                   // - upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', (req, res)=>{
  var inputId = req.params.id;
  pokemonModel.findOne({id: inputId})
  .then((doc)=>{
    if (doc == null){
      res.json({value:"Cast Error: pass pokemon id between 1 and 811"})
    } else {

      const filter = {id : inputId}
      console.log(filter)
      const update = {data : req.body}
      console.log(update)

      pokemonModel.findOneAndUpdate(filter, update, {
        upsert: true
      });      
    }
  })
})

// app.patch('/api/v1/pokemon/:id')                 // - patch a pokemon document or a portion of the pokemon document

// app.delete('/api/v1/pokemon/:id')                // - delete a  pokemon

app.delete('/api/v1/pokemon/:id', (req,res)=>{
  var id = parseInt(req.params.id);
  pokemonModel.deleteOne({id:id}, function(err, result){
    if (err) {
      return res.json({errMsg: "Error : this pokemon id is not exist"});
    } else {

      if (result.deletedCount == 0){
        return res.json({errMsg: "Error : this pokemon id is not exist"});
      } else {
        return res.json({msg: "Delete complited"});
      }
    }
   
  })
}) 