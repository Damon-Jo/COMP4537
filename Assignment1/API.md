**COMP4537 Assigiment1 API Docs**
----
  <h3>Kwanyong Jo </h3>
  <h3>A01207367</h3>

* **URL**

  + herokuapp : https://limitless-waters-28521.herokuapp.com/
  * git : https://github.com/Damon-Jo/COMP4537_SETU/tree/master/Assignment1
  * youtube : https://www.youtube.com/watch?v=jqanSqtPkHg

* **Method:**
  
  <_The request type_>

  `GET` | `POST` | `PUT` | `PATCH` | `DELETE`

   + app.get('/api/v1/pokemons?count=<number>&after=<number>')<br>
&nbsp;&nbsp; to get all the pokemons after the `after`. List only `count` number of pokemons


   * app.post('/api/v1/pokemon')<br>
&nbsp;&nbsp; to create a new pokemon

   * app.get('/api/v1/pokemon/:id')<br>
&nbsp;&nbsp; to get a pokemon by specific `id`

   * app.get('/api/v1/pokemonImage/:id')<br>
&nbsp;&nbsp; to get a pokemon Image URL by specific `id`
   
   * app.put('/api/v1/pokemon/:id')<br>
&nbsp;&nbsp; to upsert a whole pokemon document by specific `id`

   * app.patch('/api/v1/pokemon/:id')<br>
&nbsp;&nbsp; to patch a pokemon doc or portion of the pokemon doc by specific `id`   

   * app.delete('/api/v1/pokemon/:id')<br>
&nbsp;&nbsp; to delete a pokemon by specific `id`




*  **schema rules**
  * id <br>
    > type : Number, unique : true
  
  * name <br>
    > type : Object with following elements
    > english, type:String, maxlength:20
    > japanese, type:String,
    > chinese, type:String,
    > french, type:String,
  * type <br>
    > type : String Array from pokemonTypes enum
  
  * base <br>
    > type : Object with following elements
    > HP, type:Number,
    > Attack, type:Number,
    > Defense, type:Number,
    > Sp. Attack, type:Number,
    > Sp. Defense, type:Number,
    > Speed, type:Number,


*  **Sample Request and Responses**
   * This is response of get request `app.get('/api/v1/pokemon/:id')`
    <p>
    <pre>
{
  "name": {
    "english": "Bulbasaur",
    "japanese": "フシギダネ",
    "chinese": "妙蛙种子",
    "french": "Bulbizarre"
  },
  "base": {
    "Sp": {
      " Attack": 65,
      " Defense": 65
    },
    "HP": 45,
    "Attack": 49,
    "Defense": 49,
    "Speed": 45
  },
  "_id": "6341dbc3b6f7ee4b228ca0e0",
  "id": 1,
  "type": [
    "Grass",
    "Poison"
  ],
  "__v": 0
}
</pre>
  * This is response of get request `{{URL}}pokemons?count=2&after=10`
<pre>
  [
  {
    "name": {
      "english": "Metapod",
      "japanese": "トランセル",
      "chinese": "铁甲蛹",
      "french": "Chrysacier"
    },
    "base": {
      "Sp": {
        " Attack": 25,
        " Defense": 25
      },
      "HP": 50,
      "Attack": 20,
      "Defense": 55,
      "Speed": 30
    },
    "_id": "6341dbc3b6f7ee4b228ca0ea",
    "id": 11,
    "type": [
      "Bug"
    ],
    "__v": 0
  },
  {
    "name": {
      "english": "Butterfree",
      "japanese": "バタフリー",
      "chinese": "巴大蝶",
      "french": "Papilusion"
    },
    "base": {
      "Sp": {
        " Attack": 90,
        " Defense": 80
      },
      "HP": 60,
      "Attack": 45,
      "Defense": 50,
      "Speed": 70
    },
    "_id": "6341dbc3b6f7ee4b228ca0eb",
    "id": 12,
    "type": [
      "Bug",
      "Flying"
    ],
    "__v": 0
  }
]```
</pre>

* **Notes:**
