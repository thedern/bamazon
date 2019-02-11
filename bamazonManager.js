require("dotenv").config();
var mysql = require('mysql');
var inquirer = require('inquirer');

// globals
var quantity;
var productArr = [];

/*
If a manager selects View Products for Sale, the app should list every available item: the item IDs, names, prices, and quantities.
If a manager selects View Low Inventory, then it should list all items with an inventory count lower than five.
If a manager selects Add to Inventory, your app should display a prompt that will let the manager "add more" of any item currently in the store.
If a manager selects Add New Product, it should allow the manager to add a completely new product to the store.
*/

// create DB connection
var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: process.env.mysql_passwd,
    database: "bamazon_db"
});

// test db connection
connection.connect(function(err) {
    if (err) throw err;
    // console.log("connected as id " + connection.threadId + "\n");

});


/* ==========================================================================
   Managers View
   ========================================================================== */

function managersView () {

    /* ==========================================================================
       Main input
       ========================================================================== */

    inquirer.prompt([
        {
           type: "list",
           name: "action",
           message: "manage inventory",
           choices: ['View Products','View Low Inventory','Add to Inventory','Add New Product']
        } 
    
        // promise for the initial list of options
        ]).then((answer) => {

            /* ==========================================================================
               View Products
               ========================================================================== */
            
            if (answer.action === "View Products") {
                console.log("Selecting all products...\n");
                connection.query("SELECT * FROM products", function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        // Log all results of the SELECT statement
                        console.log('########################\n#### ITEMS FOR SALE #### \n########################\n');
                        for (key in res) {
                            let name = res[key].product_name;
                            productArr.push(name);
                            console.log(`${name} | price: $${res[key].price} | quantity: ${res[key].stock_quantity} | department: ${res[key].department_name} \n`);
                        }
                        console.log('########################\n');
                    }

                    // call mainPrompt for user selections
                    managersView();
                });
            } // end View Products


            /* ==========================================================================
               View Low Inventory
               ========================================================================== */
            
            if (answer.action === "View Low Inventory") {
                console.log("Selecting all products with stock less than 5...\n");
                connection.query("SELECT * FROM products where stock_quantity <= 5;", function(err, res) {
                    if (err) {
                        throw err;
                    } else {
                        // Log all results of the SELECT statement
                        console.log('#########################################\n#### ITEMS WITH QUANTITY LESS THAN 5 #### \n#########################################\n');
                        for (key in res) {
                            let name = res[key].product_name;
                            productArr.push(name);
                            console.log(`${name} | price: $${res[key].price} | quantity: ${res[key].stock_quantity} | department: ${res[key].department_name} \n`);
                        }
                        console.log('########################\n');
                    }

                    // call mainPrompt for user selections
                    managersView();
                });
            } // end View Low Inventory


            /* ==========================================================================
               Add to Inventory
               ========================================================================== */
            
            if (answer.action === "Add to Inventory") {
                inquirer.prompt([
                    // prompt user for input

                    {
                        
                    type: "input",
                    name: "product",
                    message: "Please 'View Products', and consult the list in order to enter a product for inventory update:\n"
                
                    } 
                
                    // promise for the initial list of options
                    ]).then((answer) => {
                        console.log('you entered', answer.product); 
                        var n = productArr.includes(answer.product);
                        if (n === false) {
                            console.log('please enter a valid product');
                            managersView();
                        } else {
                        // prompt for update of inventory
                            inquirer.prompt([
                            {
                                type: "text",
                                name: "number",
                                message: "how many would you like to add?",
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
                                let sqlP = 'select stock_quantity from products where ?';
                                let input = {product_name: answer.product};
                                connection.query(sqlP, input,(err, results) => {
                                    if(err) {
                                        throw err;
                                    } else {
                                        for (key in results) {
                                            quantity = results[key].stock_quantity;
                                        } // end loop
                                    } // end condtional
                                    
                                    // add the update to current quantity in stock
                                    answer2.number = parseInt(answer2.number);
                                    var updatedQuantity = answer2.number + quantity;


                                    // update quantity in database
                                    let sqlU = 'update products set ? where ?;';
                                    let input1 = {stock_quantity: updatedQuantity};
                                    let input2 = {product_name: answer.product};
                                    connection.query(sqlU,[input1, input2],(err, results) => {
                                        if(err) {
                                            throw err;
                                        } else {
                                            //capture quantity in stock
                                            console.log(`${answer2.number} added, update successful\n\n`);
                                            managersView();
                                        } // end conditonal

                                    }); // end inventory update query
        
                                }); // end inventory select query

                            }); // end inner inventory promise

                        } // end user input validation

                    }); // end outer inventory promise

            } // end add to inventory


            /* ==========================================================================
               Add New Product
               ========================================================================== */
            
            if (answer.action === "Add New Product") {
                inquirer.prompt([
                    {
                       type: "text",
                       name: "product",
                       message: "Which new product would you like add inventory?",
                    },
                    {
                        type: "text",
                        name: "department",
                        message: "To which department does the product belong?",
                    },
                    {
                        type: "text",
                        name: "quantity",
                        message: "How many items will be in inventory?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                            return true;
                            }
                            console.log('\nplease enter a number')
                            return false;
                        } // end validation
                    },
                    {
                        type: "text",
                        name: "price",
                        message: "What is the item price?",
                        validate: function(value) {
                            if (isNaN(value) === false) {
                            return true;
                            }
                            console.log('\nplease enter a number')
                            return false;
                        } // end validation
                    }
                
                    // promise for the initial list of options
                ]).then((answer) => {
                    console.log('you entered: ',answer.product, answer.department, answer.price, answer.quantity);

                    // convert strings
                    answer.price = parseInt(answer.price);
                    answer.quantity = parseInt(answer.quantity);

                    //update database with new product
                    var productData = {product_name: answer.product, 
                                        department_name: answer.department, 
                                        price: answer.price, 
                                        stock_quantity: answer.quantity};

                    var sqlI = 'INSERT INTO products SET ?';

                    connection.query(sqlI, productData,(err, results) => {
                         if(err) {
                             throw err;
                         } else {
                             //capture quantity in stock
                             console.log(`${answer.product} added, update successful\n\n`);
                             managersView();
                         } // end conditonal

                    }); // end inventory update query

                }); // end promise

            }// end add new product

        }) // end outermost promise

} // end managers view function



managersView();