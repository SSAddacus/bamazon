var inquirer = require ("inquirer");
var mysql = require("mysql");
var consoleTableNPM= require("console.table");

var connection = mysql.createConnection({
	host: "localhost",
	port: 3306,
	user: "root",
	password: "Zaon47882!",
	database: "bamazon_db"
});

// connect to db
connection.connect(function(error){
	if (error) throw error;
	// welcome customer
	console.log("\n-----------------------------------------------------------------" 
		+ "\nWelcome to Bamazon! Check out what we've got for you!\n" 
		+ "-----------------------------------------------------------------\n");
	// start the app
	welcome();
});

function welcome(){
    inquirer.prompt([
{
        name:"action",
        type: "list",
        choices: ["View items for sale", "Leave the store"],
        message: "Please select what you would like to do."
    
}
    ]).then(function(action){
        if(action.action === "View items for sale"){
            viewItems();
        } else if (action.action === "Leave the store"){
            exit();
        }

    });
}


function viewItems(){
    var query = "SELECT * FROM products";
    connection.query(query, function(err, res){
        if (err) throw err;
        consoleTable(results);
        

        inquirer.prompt([
            {
                name: "id",
                message: "Please enter the ID of the item that you would like to purchase.",
                validate: function(value){
                    if (value > 0 && isNaN(value) === false && value <= results.length){
                        return true;
                    }
                        return false;
                }
            },
            {
                name: "qty",
                message: "What quantity would you like to purchase?",
                validate: function(value){
                    if (value > 0 && isNaN(value) === false){
                        return true;
                    }
                        return false;
                }

            }
        ]).then(function(transaction){
                var itemQty;
                var itemPrice;
                var itemName;
                var productSales;
                
                for (var j = 0; j< results.length; j++){
                    if(parseInt(transaction.id)=== results[j].item_id){
                        itemQty= results[j].stock_quantity;
                        itemPrice= results[j].price;
                        itemName= results[j].product_name;
                        productSales= results[j].product_sales;
                    }
                }
                    if (parseInt(transaction.qty) > itemQty){
                        console.log("\nInventory Low. We have " + itemQty + "in stock.\n");
                        welcome();
                    } else if (parseInt(transaction.qty) <= itemQty){
                        console.log("\n You Bought " + transaction.qty + "of" + itemName + ".");
                        lowerQty(transaction.id, transaction.qty, itemQty, itemPrice);
                        salesRevenue(transaction.id, transaction.qty, productSales, itemPrice);
                    }
        });

    });
}

function consoleTable(results){
    var values = [];
    for (var i = 0; results.length; i++){
        var resultsObject = {
            ID: results[i].item_id,
            Item: results[i].product_name,
            Price: "$" + results[i].price
        };
        values.push(resultsObject);
    }
    console.table("\nItems for Sale", values);
}

function lowerQty(item, purchaseQty, stockQty, price){
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
                stock_quantity: stockQty - parseInt(purchaseQty)
            },
            {
                item_id: parseInt(item)
            }
        ],
        function(err, res){
            if (err) throw err
        }
        );
}

function salesRevenue(item, purchaseQty, productSales, price){
    var customerCost = parseInt(purchaseQty) * price;
    connection.query(
        "UPDATE products SET ? WHERE ?",
        [
            {
            product_sales: productSales + customerCost
            },
            {
                item_id: parseInt(item)
            }
        ],
        function(err,res){
            if (err) throw err;
        console.log("Your Total Is $" + customerCost.toFixed(2) + ". Thank You!\n");
    welcome();        
} );    
}
function exit(){
    console.log("\nThank You For Coming!");
    connection.end();
}