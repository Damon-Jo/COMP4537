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

app.use(express.json())

app.listen(process.env.PORT || port, async () => {
  try {
    await mongoose.connect('mongodb+srv://lunaticky:rhanchd6@cluster0.rfmec.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'); 

  } catch (error) {
    console.log('db error');
  }

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
        // userModel.collection.drop();
        if (!err && count === 0) {
          pokemonModel.create(pokemons);
        } else {
          pokemonModel.collection.drop();
          pokemonModel.create(pokemons);
        }
    });

    // pokemons.map(element => {
    //   //insert to db
    //   // console.log(element);
    //   element["base"]["Speed Attack"] = element["base"]["Sp. Attack"];
    //   delete element["base"]["Sp. Attack"];
    //   element["base"]["Speed Defense"] = element["base"]["Sp. Defense"];
    //   delete element["base"]["Sp. Defense"];
    //   pokemonModel.findOneAndUpdate({id: element["id"]}, {}, { upsert: true, new: true }, function (err, result) {
    //     if (err) console.log("11111111" + err);
    //     // saved!
    //     // console.log(result);
    //   });
    // })



      // let product = await pokemonModel.exists({id: 1});

      // if(product){
      //   pokemonModel.collection.drop();
      //   pokemonModel.create(pokemons);
      // } else {
      //   pokemonModel.create(pokemons);
      // }


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
  res.send(pokemonTypes);
})

// app.get('/api/v1/pokemons?count=2&after=10')     // - get all the pokemons after the 10th. List only Two.
app.get('/api/v1/pokemons', function(req, res) {
  var after = null
  var count = null

  var size = Object.keys(req.query).length
  if(size != 0){
    after = {id: {$gt: parseInt(req.query.after)}}
    count = parseInt(req.query.count)
    pokemonModel.find(after).limit(count)
    .then((doc)=>{
      if (doc.length == 0){
        return res.json({ errMsg : "Error : pokemon id should be between 1 and 809"});
      } else {
        res.json(doc)
      }
    })
    .catch(err=>{
      return res.json({errMsg: "Error : when getting a pokemon"})
    })
        }else {
          pokemonModel.find({})
              .then(doc => {
                res.json(doc)
               })
              .catch(err => {
                  console.error(err)
                  res.json({ msg: "Error : returning pokemon" })
          })
      }
})

// app.post('/api/v1/pokemon')                      // - create a new pokemon
app.post('/api/v1/pokemon', async (req,res)=>{
  var pokemonDex = req.body
  let product = await pokemonModel.exists({id: pokemonDex.id});
  
  var sizeOfObject = Object.keys(pokemonDex).length
  var dbQuerySize = Object.keys(pokemonModel).length
  let pokeNameLeng = req.body.name.english.length;

  if (pokeNameLeng>20){
    return res.json({errMsg : "ValidationError: check your ..."});
  }

  // var jsonLenth = parseInt(Object.keys(pokemonModel).length);

  //Check if there is an ID in the request body
  if(pokemonDex.id == null){
    return res.send({errMsg : 'The request body is invalid'});
  } else {
    try{
      if(!pokemonDex || sizeOfObject === 0){
        return res.send({errMsg : "Error : the request body is missing"});
      }else if(product){
        return res.json({ errMsg : "Error : the id is duplicated"});
      } else {
        pokemonModel.create(pokemonDex)
        .then((doc) => {
          return res.json({ msg: "post complited"})
        })     
      }
    } catch(err){
        console.log('err', err)
        return res.json({errMsg: "Error : when creating a pokemon"})
    }
  }
})



// app.get('/api/v1/pokemon/:id')                   // - get a pokemon
app.get('/api/v1/pokemon/:id', (req,res)=>{
  
  var id = req.params.id;
  // var regExp = /[a-zA-Z]/g;

  if(/[^0-9]/i.test(id)){
    return res.json({errMsg: "Cast Error: pass pokemon id between 1 and 811"});
  }else {
    pokemonModel.findOne({id: id})
    .then((doc)=>{
      if (doc == null){
        return res.json({ errMsg : "Error : pokemon id should be between 1 and 809"});
      } else {
        res.json(doc)
      }
    })
  }
});

// app.get('/api/v1/pokemonImage/:id')              // - get a pokemon Image URL
app.get('/api/v1/pokemonImage/:id', (req,res)=>{
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

  pokemonModel.findOne({id: id})
  .then((doc)=>{
    if (doc == null){
      res.json({value:"Error : pokemon id should be between 1 and 809"})
    } else {
      res.json({url:`https://raw.githubusercontent.com/fanzeyi/pokemon.json/master/images/${newId}.png`})
    }
  })
});

// app.put('/api/v1/pokemon/:id')                   // - upsert a whole pokemon document
app.put('/api/v1/pokemon/:id', (req, res) => {
  // upserts a whole pokemon document
  var inputId = parseInt(req.params.id);
  const { id, ...rest } = req.body;
      pokemonModel.findOneAndUpdate({ id: inputId }, rest, { runValidators: true, new:true, upsert: true }, function (err) {
      if (err) {
          res.json({ errMsg: "Invalid value" })
      } else {
          res.json({ msg:"Updated or created Successfully"})
      }
      });
}) 

// app.patch('/api/v1/pokemon/:id')                 // - patch a pokemon document or a portion of the pokemon document
app.patch('/api/v1/pokemon/:id', async (req,res)=>{
  var inputId = parseInt(req.params.id);
  const { id, ...rest } = req.body;

  var pokemon = await pokemonModel.find({id: inputId})
  if (pokemon.length == 0) {
    return res.json({errMsg: "this pokemon id is not exist"});
  }
  pokemonModel.updateOne({id: inputId}, rest, {new : true, runValidators:true}, function(err){
    if(err) {
      return res.json({errMsg: "this pokemon id is not exist"});
    } else {
      return res.json({msg: "Udtated Successfully"});
    }
  })
})

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
        return res.json({msg: "Delete completed"});
      }
    }
  })
}) 
// Improper Route
// app.get('*', function (req, res) {
//   res.json({msg: "Error : Improper route"});
// })

// app.get('/pokemonsAdvancedFiltering', function(req, res){
//   res.json({msg: "ss"});

// })

  




app.get('/pokemonsAdvancedFiltering', (req, res) => {
  // console.log(comparisonOperators)

    let filterArray = [];

    if (req.query.comparisonOperators) {

        const comparison = req.query.comparisonOperators.split(",");
        console.log(comparison);
        comparison.map(element => {
            element = element.trim();

            element = element.replace("<", "$lt");
            element = element.replace("<=", "$lte");
            element = element.replace(">", "$gt");
            element = element.replace(">=", "$gte");
            element = element.replace("==", "$eq");
            element = element.replace("!=", "$ne");

            const matches = element.match(regexForm);

            const comparisonElement = {
                ["base." + matches[1]]: {
                    [matches[2]]: matches[3]
                }
            }
            filterArray.push(comparisonElement);
        })
    }


    pokemonModel.find({ $and: filterArray
    }).exec((err, docs) => {
        console.log(filterArray);
        res.json(docs);
    })

})