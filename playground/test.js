const mongoose = require('mongoose');

main().catch(err => console.log(err));

async function main() {
  await mongoose.connect('mongodb://localhost:27017/test');
  
  // use `await mongoose.connect('mongodb://user:password@localhost:27017/test');` if your database has auth enabled
}

const { Schema } = mongoose;

const unicornSchema = new Schema({
  name:  String, // String is shorthand for {type: String}
  weight: Number,
  loves:  [String]
});

const unicornModel = mongoose.model('unicorns', unicornSchema); // unicorns is the name of the collection in db

// const aUnicornModel = new unicornModel();

// const unicornModel = mongoose.model('unicorns', unicornSchema);

// const aUnicornModel = new unicornModel({ name: 'test' });
// aUnicornModel.save(function (err) {
//   if (err) return handleError(err);
//   // saved!
// });

unicornModel.find({ name: 'Aurora' })
  .then(doc => {
    console.log(doc)
  })
  .catch(err => {
    console.error(err)
  })