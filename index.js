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

app.post('/loginUser', async (req, res) => {
  const { username, password } = JSON.parse(req.body);
  // Set up MongoDB connection
    const mongoUrl = 'mongodb+srv://SarimSaljook:sarim@cluster1.srbuvsf.mongodb.net/investment_insightDB';
    mongoose.connect(mongoUrl, { useNewUrlParser: true, useUnifiedTopology: true });
    const db = mongoose.connection;
    db.on('error', console.error.bind(console, 'MongoDB connection error:'));

    var collection = db.collection('users');  // get reference to the collection
  
    const query = { "username" : username, "password" : password };
    const projection = {
        "username": 1,
        "password": 1,
       }

    collection.findOne(query, projection)
    .then(result => {
      if(result) {
        console.log(`Successfully found: ${result.username}.`);
        res.send({ "status" : "USER FOUND" });
      } else {
        console.log("No document matches the provided query.");
        res.send({ "status" : "NO USER FOUND" });
      }
      return result;
    })
    .catch(err => {
      console.error(`Failed to find document: ${err}`);
      res.send({ "status" : "ERROR" });
    });
});

// Define User schema
const expenseSchema = new mongoose.Schema({
  user: String, 
  expense_title: String, 
  expense_amount: String, 
  expense_date: String
});

// Define User model
const Expense = mongoose.model('monthly_expenses', expenseSchema);

app.post('/addExpense', async (req, res) => {
  const { user, expense_title, expense_amount, expense_date } = JSON.parse(req.body);
  
    const expense = new Expense({
      user: user, 
      expense_title: expense_title, 
      expense_amount: expense_amount, 
      expense_date: expense_date
    }); 
  
    console.log(JSON.parse(req.body));
  
       await expense.save().then(() => {
        console.log("NEW EXPENSE ADDED SUCCESSFULLY!");   
        res.send({ "status" : "NEW EXPENSE ADDED SUCCESSFULLY!" })
      }).catch((err) => console.log(err));
  
  });

app.post('/getUserExpenses', async (req, res) => {
  const { user } = JSON.parse(req.body);
  console.log(JSON.parse(req.body));

  var collection = db.collection("monthly_expenses");

   const cursor = collection.find({
    user: user
  });

  const allValues = await cursor.toArray();

  console.log(allValues);

  res.send({ "User's Expenses" : allValues});
});

app.post('/setBudget', async (req, res) => {
  const { budget_amount, username } = JSON.parse(req.body);
  console.log(JSON.parse(req.body));

  try {

    var collection = db.collection("users");

    const filter = { username: username };
    // this option instructs the method to create a document if no documents match the filter
    const options = { upsert: true };
    // create a document that sets the budget
    const updateDoc = {
       $set: {
         "monthly_budget_target" : budget_amount
       }
    };
    const result = await collection.updateOne(filter, updateDoc, options);
    console.log(
      `${result.matchedCount} document(s) matched the filter, updated ${result.modifiedCount} document(s)`,
    );

  } finally {
    await client.close();
    res.send({ 
      "status" : "Budget for "+username+" Updated!"
    }) 
  }

}),

app.post('/getUserBudget', async (req, resp) => {
  const { user } = JSON.parse(req.body);
  console.log(JSON.parse(req.body));

  var collection = db.collection("users");

   await collection.findOne({
    username: user
  }).then((res) => {
    console.log(res);
    resp.send({ "User's Budget" : res.monthly_budget_target});
  }).catch((err) => {
    console.log(err);
    resp.send({ "Error" : err});
  });

});

run().catch(console.dir);