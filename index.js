const express = require('express');
const connectDB = require('./config/db');
const mongoose = require('mongoose');
const CampgroundModel = require('./models/campgroundModel');
const path = require('path');
const app = express();

connectDB();

app.set('view engine', 'ejs');
app.set('views directory', path.join(__dirname, 'views'));

app.get('/', (req, res) => {
  res.render('home');
});

app.get('/makecampground', async (req, res) => {
  const camp = new CampgroundModel({ title: 'My Backyard' });
  await camp.save();
  res.send(camp);
});

app.listen(3000, () => {
  console.log('Server is running on 3000');
});
