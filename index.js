const express = require("express");
const { MongoClient } = require("mongodb");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');

const app = express();

app.use(bodyParser.raw({inflate:true, limit: '100kb', type: 'application/json'}));

app.get("/", (req, res) => {
  console.log("MAIN");
});

app.listen(3001, () => {
  console.log(`Listening on port 3001`);
});

// DB Url --> mongodb+srv://SarimSaljook:sarim@cluster1.srbuvsf.mongodb.net/investment_insightDB
                                                                                                                                     
const url = "mongodb+srv://SarimSaljook:sarim@cluster1.srbuvsf.mongodb.net/investment_insightDB";
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
const mongoUrl = 'mongodb+srv://SarimSaljook:sarim@cluster1.srbuvsf.mongodb.net/investment_insightDB';
mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define User schema
const userSchema = new mongoose.Schema({
  _id: Object,  
  username: String,
  password: String,
  name: String,
  email: String,
  phone_number: String
});

// Define User model
const User = mongoose.model('users', userSchema);

// Define POST endpoint for adding user data to MongoDB
app.post('/addUser', async (req, res) => {
const { _id, username, password, name, email, phone_number } = JSON.parse(req.body);

  const user = new User({
    _id: _id,
    username: username,
    password: password,
    name: name,
    email: email,
    phone_number: phone_number
  }); 

  console.log(JSON.parse(req.body));

     await user.save().then(() => {
      console.log("USER ADDED SUCCESSFULLY!");   
      res.send({ "status" : "USER ADDED SUCCESSFULLY!" })
    }).catch((err) => console.log(err));

});


run().catch(console.dir);