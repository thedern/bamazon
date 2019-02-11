
CREATE DATABASE bamazon_db;

use bamazon_db;

CREATE table products (
	ID int NOT NULL AUTO_INCREMENT,
    product_name varchar(100) not null,
    department_name varchar(100),
    price decimal(10,2),
    stock_quantity integer(10),
    PRIMARY KEY (ID)
);

insert into products (product_name, department_name, price, stock_quantity) values ('flux capacitors', 'time travel', '1000.00', 10);
insert into products (product_name, department_name, price, stock_quantity) values ('nimbus 2000', 'transportation', '100.00', 20);
insert into products (product_name, department_name, price, stock_quantity) values ('vibranium disks', 'hardware', '75.00', 100);
insert into products (product_name, department_name, price, stock_quantity) values ('inifinity stones', 'fine jewelery', '20000.00', 6);
insert into products (product_name, department_name, price, stock_quantity) values ('light sabers', 'home defense', '575.00', 30);
insert into products (product_name, department_name, price, stock_quantity) values ('warp drive cores', 'electrical', '120.00', 15);
insert into products (product_name, department_name, price, stock_quantity) values ('squatch repellent', 'sporting goods', '5.00', 1000);
insert into products (product_name, department_name, price, stock_quantity) values ('carbonite solos', 'home decor', '5500.00', 1);
insert into products (product_name, department_name, price, stock_quantity) values ('aladdin lamp', 'kitchen appliances', '50.00', 75);
insert into products (product_name, department_name, price, stock_quantity) values ('3 headed dog food', 'pet supplies', '35.00', 200);

select * from products;

select * from products where product_name='carbonite solos';

select stock_quantity from products where product_name='squatch repellent';
