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

   + app.get('/api/v1/pokemons?count=<number>&after=<number>')
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




*  **URL Params**

   <_If URL params exist, specify them in accordance with name mentioned in URL section. Separate into optional and required. Document data constraints._> 

   **Required:**
 
   `id=[integer]`

   **Optional:**
 
   `photo_id=[alphanumeric]`

* **Data Params**

  <_If making a post request, what should the body payload look like? URL Params rules apply here too._>

* **Success Response:**
  
  <_What should the status code be on success and is there any returned data? This is useful when people need to to know what their callbacks should expect!_>

  * **Code:** 200 <br />
    **Content:** `{ id : 12 }`
 
* **Error Response:**

  <_Most endpoints will have many ways they can fail. From unauthorized access, to wrongful parameters etc. All of those should be liste d here. It might seem repetitive, but it helps prevent assumptions from being made where they should be._>

  * **Code:** 401 UNAUTHORIZED <br />
    **Content:** `{ error : "Log in" }`

  OR

  * **Code:** 422 UNPROCESSABLE ENTRY <br />
    **Content:** `{ error : "Email Invalid" }`

* **Sample Call:**

  <_Just a sample call to your endpoint in a runnable format ($.ajax call or a curl request) - this makes life easier and more predictable._> 

* **Notes:**

  <_This is where all uncertainties, commentary, discussion etc. can go. I recommend timestamping and identifying oneself when leaving comments here._> 