const express = require('express');
const bodyParser = require('body-parser');
const mongoDB = require('mongodb');
const cors = require('cors');

let app = express();

app.use(bodyParser.json());
app.use(cors({
    origin: true,
    credentials: true,
}));

// Connecting to the database
let db;
mongoDB.MongoClient.connect('mongodb://localhost:27017/', {useUnifiedTopology: true}, (err, client) => {
    db = client.db('cst3145-cw2');
    console.log(client ? ('Connection established.') : (err));
});

// Define Collection and DB names
app.param('collectionName', (req, res, next, collectionName) => {
    req.collection = db.collection(collectionName);
    return next()
});


//Express end-routes


// Info message
app.get('/', (req, res) => {
    res.send('Select a collection, e.g., /collections/messages')
});

// Retrieves all data from collection
app.get('/collections/:collectionName', (req, res, next) => {
    req.collection.find({}).toArray((e, results) => {
        if (e) return next(e);
        res.send(results)
    })
});

// Inserts a new query of data
app.post('/collections/:collectionName', (req, res, next) => {
    req.collection.insert(req.body, (e, results) => {
        if (e) return next(e);
        res.send(results);
    })
});

// retrieve data by email
app.get('/collections/:collectionName/:email', (req, res, next) => {
    req.collection.findOne({email: (req.params.email)}, (e, result) => {
        if (e) return next(e);
        res.send(result);
    })
});

// validate login by email and password
app.get('/collections/:collectionName/:email/:password', (req, res, next) => {
    req.collection.findOne({email: (req.params.email), password: (req.params.password)}, (e, result) => {
        if (e) return next(e);
        res.send(result)
    })
});

// update a user by email
app.put('/collections/:collectionName/:email', (req, res, next) => {
    req.collection.updateOne({email: (req.params.email)},
        {$set: req.body},
        {safe: true, multi: false}, (e, result) => {
            if (e) return next(e);
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        })
});

// delete a user by email
app.delete('/collections/:collectionName/:email', (req, res, next) => {
    req.collection.deleteOne({email: (req.params.email)}, (e, result) => {
        if (e) return next(e);
        res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
    })
});

// Start the server
let port = 3000;
app.listen(port, console.log(`Server is listening on :${port}`));
