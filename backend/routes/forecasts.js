const express = require("express");

const forecastRoute = express.Router();
const dbo = require("../db/conn");
const objectId = require("mongodb").ObjectId;


// get all the forecasts saved in db
forecastRoute.route("/forecasts").get(function(req, res) {
    let connection = dbo.getDb("weather");
    connection.collection("forecasts")
        .find({}).toArray(function (err, result) {
            if (err) throw err;
            res.json(result);
        });
});

// get one forecast based off user input of a city
forecastRoute.route("/forecasts/:city").get(function (req, res) {
    let connection = dbo.getDb();
    let query = {city: req.params.city};
    connection.collection("forecasts")
        .findOne(query, function(err, result) {
            if(err) throw err;
            res.json(result);
        });
});

// add a forecast to the db
forecastRoute.route("/forecasts/add").post(function (req, res) {
    let connection = dbo.getDb();
    let submission = {
        city: req.body.city,
        forecast: req.body.forecast
    };
    connection.collection("forecasts").insertOne(submission, function(err, result) {
        if(err) throw err;
        res.json(result);
    });
});

module.exports = forecastRoute;