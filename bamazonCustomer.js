require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');

// keys exports object that contains mysql password
var keys = require("./keys.js");

// globals
var productArr = [];


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

/* ==========================================================================
   SQL Statements
   ========================================================================== */
 

// display items and quantities
function readProducts() { 
    console.log("Selecting all products...\n");
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) {
            throw err;
        } else {
            // Log all results of the SELECT statement
            console.log('########################\n#### ITEMS FOR SALE #### \n########################\n');
            for (key in res) {
                let name = res[key].product_name.toUpperCase();
                // save product names to array for later use
                productArr.push(name);
                console.log(`${name} | price: $${res[key].price} | quantity: ${res[key].stock_quantity} | department: ${res[key].department_name} \n`);
            }
            console.log('########################\n');
        }

        // call mainPrompt for user selections
        mainPrompt();
    });
} // end readProducts



/* ==========================================================================
   Prompt User for Selection
   ========================================================================== */

function mainPrompt() {

    // prompt user for input
    inquirer.prompt([
    {
       type: "list",
       name: "product",
       message: "Which product would you like to purchase?",
       choices: ['flux capacitors','nimbus 2000', 'vibranium disks','infinity stones', 'light sabers', 'warp drive cores', 'squatch repellent','carbonite solos','aladdin lamps','3 headed dog food']
    } 

    // promise for the initial list of options
    ]).then((answer) => {
        console.log('you selected', answer.product); 
        // prompt for number to purchase
        inquirer.prompt([
        {
           type: "text",
           name: "number",
           message: "how many would you like to purchase?",
           validate: function(value) {
            if (isNaN(value) === false) {
              return true;
            }
            console.log('\nplease enter a number')
            return false;
          } // end validation
        } 
        ]).then((answer2) => {
            
            console.log('finding product\n');
            let sqlP = 'select stock_quantity, price from products where ?';
            let input = {product_name: answer.product};
            connection.query(sqlP, input,(err, results) => {
                if(err) {
                    throw err;
                } else {
                    // capture quantity in stock and price per item
                    for (key in results) {
                        var quantity = results[key].stock_quantity;
                        var itemPrice = results[key].price;
                    } // end for loop

                    // evaluate quantity
                    if (answer2.number > quantity) {
                        console.log(`insufficent quantity to fill request.\nnumber in stock: ${quantity}\nplease select again item\n\n`);
                        //send user back to main
                        mainPrompt();      
                    } else {
                        
                        // calculate amounte owed
                        let amtOwed = answer2.number * itemPrice;
                        // subtract purchased from total quantity
                        let diff = quantity - answer2.number;
                    
                        // update database quantity
                        console.log(`filling order of ${answer2.number} ${answer.product}...`);
                        let sqlU = 'update products set ? where ?';
                        let input1 = {stock_quantity: diff};
                        let input2 = {product_name: answer.product};
                        connection.query(sqlU,[input1, input2],(err, results) => {
                            if(err) {
                                throw err;
                            } else {
                                console.log(`total due for (${answer2.number}) ${answer.product} is $${amtOwed}.\n\n`);
                                mainPrompt();
                            }
                        }); // end query
        
                    } // end evaluate quantity

                } // end conditional
            
            }); // end quanity search query
               
        }); // end inner prompt

    }); // end outer prompt

} // end mainPrompt()

/* ==========================================================================
   Start
   ========================================================================== */
readProducts();



