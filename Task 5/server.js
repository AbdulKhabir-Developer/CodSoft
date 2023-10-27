
import connectToMongo from './db.js';
import express from 'express';
import cors from 'cors';
import auth from './routes/auth.js'
import quiz from './routes/quiz.js';
import dotenv from 'dotenv';
// import user from './models/User.js';


dotenv.config();

connectToMongo();
// var cors = require('cors')
const app = express()


app.use(cors())
app.use(express.json())//if we want to use req.body this middleware is required

// Available Routes
app.use('/api/auth', auth)
app.use('/api/quiz', quiz)

app.get('/', (req, res) => {
  res.send(
      '<h1>Welcome to ecommerece app</h1> '
  );

});

const PORT = process.env.PORT || 8080;


app.listen(PORT, () => {
  console.log(`Server Running on ${process.env.DEV_MODE} mode on port ${PORT}`);
})


