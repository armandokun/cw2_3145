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

// Gets all data from collection
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
    req.collection.find({email: (req.params.email)}).toArray((e, result) => {
        if (e) return next(e);
        res.send(result);
    })
});

// get course by id
app.get('/collections/:collectionName/get/:id', (req, res, next) => {
    req.collection.find(mongoDB.ObjectId(req.params.id)).toArray((e, result) => {
        if (e) return next(e);
        res.send(result);
    })
});

// Get user who's status is ON
app.get('/collections/:collectionName/status/:status', (req, res, next) => {
    req.collection.findOne({on: true}, (err, result) => {
        if (err) return next(err);
        res.send(result);
    })
});

// retrieve data by email while registering
app.get('/collections/:collectionName/register/:email', (req, res, next) => {
    req.collection.findOne({email: (req.params.email)}, (e, result) => {
        if (e) return next(e);
        res.send(result);
    })
});

// update a user by email to logout
app.put('/collections/:collectionName/logout/:email', (req, res, next) => {
    req.collection.updateOne({email: (req.params.email)},
        {$set: {on: false}},
        {returnOriginal: false, upsert: true},
        (e, result) => {
            if (e) return next(e);
            res.send(result);
        })
});

// update a course by id
app.put('/collections/:collectionName/put/:id', (req, res, next) => {
    req.collection.updateOne({_id: mongoDB.ObjectId(req.params.id)},
        {
            $set: {
                topic: req.body.topic, price: req.body.price, about: req.body.about,
                rating: req.body.rating, location: req.body.location
            }
        },
        {returnOriginal: false, upsert: true}, (e, result) => {
            if (e) next(e);
            res.send((result.result.n === 1) ? {msg: 'success'} : {msg: 'error'})
        })
});

// reset ratings by id
app.put('/collections/:collectionName/rating/:id', (req, res, next) => {
    req.collection.updateOne({
        _id: mongoDB.ObjectId(req.params.id)
    }, {$set: {rating: []}}, (e, result) => {
        if (e) return next(e);
        res.send(result)
    })
});

// update ratings by id
app.put('/collections/:collectionName/update/:id-:user-:score', (req, res) => {
    req.collection.findOneAndUpdate({
            _id: mongoDB.ObjectID(req.params.id),
            "rating.user": (req.params.user)
        }, {$set: {"rating.$.score": (req.params.score)}})
        .then(results => {
            if (results.value === null) {
                req.collection.findOneAndUpdate({
                        _id: mongoDB.ObjectID(req.params.id)
                    },
                    {$push: {rating: {user: (req.params.user), score: (req.params.score)}}}
                )
                    .then(value => res.send(value))
                    .catch(err => res.send(err))
            } else {
                res.send(results)
            }
        })
        .catch(err => res.send(err));
});

// validate login by email and password
app.put('/collections/:collectionName/:email/:password', (req, res, next) => {
    req.collection.findOneAndUpdate({email: (req.params.email), password: (req.params.password)},
        {$set: {on: true}})
        .then(results => res.send(results))
        .catch(err => res.send(err))
});

// delete a course by id
app.delete('/collections/:collectionName/:id', (req, res, next) => {
    req.collection.deleteOne({_id: mongoDB.ObjectID(req.params.id)}, (e, result) => {
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
