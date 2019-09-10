DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products(
    item_id INT auto_increment NOT NULL,
    product_name VARCHAR(100) NULL,
    department_name VARCHAR(100) NULL,
    price DECIMAL(10,2) NULL,
    stock_quantity INT NULL,
    product_sales DECIMAL (10,2) DEFAULT 0,
    primary key (item_id)

);

insert into products (product_name, department_name, price, stock_quantity, product_sales)
values ("Soup", "food", 4.99, 40,1000),("chicken", "food", 9.99, 50,1000),("Beef", "food", 5.99, 40,1000),
("PS4", "electronics", 299.99, 40,1000),("XBox 1", "electronics", 199.99, 40,1000),("Switch", "electronics", 299.99, 40,1000),
("Blink-182", "music", 4.99, 40,1000),("Disturbed", "music", 4.99, 40,1000),("Bowling for Soup", "music", 4.99, 40,1000),
("Tool", "music", 399.99, 40,1000);

CREATE table departments(
    department_id INT auto_increment NOT NULL,
    department _name VARCHAR (100) NULL,
    over_head_costs DECIMAL(10,2) NULL,
    PRIMARY KEY (department_id)
);

insert into departments (department_name, over_head_costs)
values ("music", 2000), ("electronics", 2000), ("food", 3000);

SELECT * FROM products;
SELECT * FROM departments;

SELECT department_id, departments.department_name, over_head_costs, SUM(product_sales) AS product_sales,
SUM(product_sales)- over_head_costs AS total_profit
FROM departments
INNER JOIN product
ON departments.department_name = products.department_name
GROUP BY department_id;