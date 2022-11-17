
const express = require("express")
const { handleErr } = require("./errorHandler.js")
const { asyncWrapper } = require("./asyncWrapper.js")
const dotenv = require("dotenv")
dotenv.config();
const userModel = require("./userModel.js")
const { connectDB } = require("./connectDB.js")
const tokenList = require("./tokenList");
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

const app = express()

const start = asyncWrapper(async () => {
  await connectDB();


  app.listen(process.env.authServerPORT, (err) => {
    if (err)
      throw new PokemonDbError(err)
    else
      console.log(`Phew! Server is running on port: ${process.env.authServerPORT}`);
  })
})
start()

app.use(express.json())

var userType;
const bcrypt = require("bcrypt")
app.post('/register', asyncWrapper(async (req, res) => {
  const { username, password, email } = req.body
  userType = username;
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  const userWithHashedPassword = { ...req.body, password: hashedPassword }

  const user = await userModel.create(userWithHashedPassword)
  res.send(user)
}))

const jwt = require("jsonwebtoken")
app.post('/login', asyncWrapper(async (req, res) => {
  const { username, password } = req.body
  const user = await userModel.findOne({ username })
  if (user == null) {
    throw new PokemonNotFoundUser("")
  }
  const isPasswordCorrect = await bcrypt.compare(password, user.password)
  if (!isPasswordCorrect) {
    throw new PokemonWrongPassword("")
  }

  // Create and assign a token
  if (user.token) {
    console.log(user.token);
    await tokenList.findOneAndUpdate(
      { token: user.token },
      { blocked: false }
    );
  } else {
    const token = jwt.sign({ _id: user._id }, process.env.TOKEN_SECRET);
    console.log(token);

    res.cookie("cookie", token);
    await userModel.findOneAndUpdate({ _id: user._id }, { token: token });
    if (userType != "Admin") {
      await tokenList.create({
        token: token,
        blocked: false,
        userType: "User",
      });
    } else {
      await tokenList.create({
        token: token,
        blocked: false,
        userType: "Admin",
      });
    }
  }
  res.send("log in sucessfully");
})
);


app.post("/logout", asyncWrapper(async (req, res) => {
    const token = req.query["appId"];
    const tokenData = await tokenList.findOneAndUpdate(
      { token: token },
      { blocked: true }
    );

    if (tokenData) {
      res.send("logout sucessfully");
    } else {
      res.send("Failed to log out, please check your token");
    }
  })
);



app.use(handleErr)
