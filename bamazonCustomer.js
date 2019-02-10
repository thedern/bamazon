require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');


// keys exports object that contains mysql password
var keys = require("./keys.js");

// create DB connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.mysql_passwd,
    //password: "MYSQL4thewin!",
    database: "bamazon_db"
});

// test db connection
connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId + "\n");

});