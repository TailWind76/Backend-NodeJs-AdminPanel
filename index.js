// app.js
const express = require('express');
const bodyParser = require('body-parser');
const MongoClient = require('mongodb').MongoClient;

const app = express();
const port = 3000;
const mongoUrl = 'mongodb://localhost:27017';
const dbName = 'admin_panel';
const collectionName = 'items';

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

MongoClient.connect(mongoUrl, { useUnifiedTopology: true }, (err, client) => {
  if (err) throw err;
  const db = client.db(dbName);
  const collection = db.collection(collectionName);

  // Create a new item
  app.post('/items', (req, res) => {
    const newItem = req.body;
    collection.insertOne(newItem, (err, result) => {
      if (err) throw err;
      res.json(result.ops[0]);
    });
  });

  // Get all items
  app.get('/items', (req, res) => {
    collection.find().toArray((err, items) => {
      if (err) throw err;
      res.json(items);
    });
  });

  // Update an item by ID
  app.put('/items/:id', (req, res) => {
    const itemId = req.params.id;
    const updatedItem = req.body;
    collection.updateOne({ _id: itemId }, { $set: updatedItem }, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

  // Delete an item by ID
  app.delete('/items/:id', (req, res) => {
    const itemId = req.params.id;
    collection.deleteOne({ _id: itemId }, (err, result) => {
      if (err) throw err;
      res.json(result);
    });
  });

  app.listen(port, () => {
    console.log(`Admin Panel app listening at http://localhost:${port}`);
  });
});
