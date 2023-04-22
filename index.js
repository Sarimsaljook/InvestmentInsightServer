const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(express.json());
app.get("/", (req, res) => {
  console.log("MAIN");
});

app.listen(3001, () => {
  console.log(`Listening on port 3001`);
});

// DB Url --> mongodb://atlas-sql-644266307e2fa467f5d27127-utayl.a.query.mongodb.net/sample_analytics?ssl=true&authSource=admin
 
// Replace the following with your Atlas connection string                                                                                                                                        
const url = "mongodb://atlas-sql-644266307e2fa467f5d27127-utayl.a.query.mongodb.net/sample_analytics?ssl=true&authSource=admin";
const client = new MongoClient(url);

async function run() {
    try {
        await client.connect();
        console.log("Connected correctly to server");

    } catch (err) {
        console.log(err.stack);
    }
    finally {
        await client.close();
    }
}

// Set up MongoDB connection
const mongoUrl = 'mongodb://atlas-sql-644266307e2fa467f5d27127-utayl.a.query.mongodb.net/sample_analytics?ssl=true&authSource=admin';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User schema
const userSchema = new mongoose.Schema({
  id: Object,  
  username: String,
  password: String,
  name: String,
  email: String,
  phone_number: String
});

// Define User model
const User = mongoose.model('User', userSchema);

// Define POST endpoint for adding user data to MongoDB
app.post('/addUser', (req, res) => {
  const { id, username, password, name, email, phone_number } = req.body;

  const user = new User({
    id: id,
    username: username,
    password: password,
    name: name,
    email: email,
    phone_number: phone_number
  });

  user.save((err) => {
    if (err) {
      console.error(err);
      res.status(500).send('Error saving user data to MongoDB');
    } else {
      res.status(200).send('User data saved to MongoDB');
    }
  });
});


run().catch(console.dir);