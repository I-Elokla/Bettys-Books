# Create database script for Bettys books

# Create the database
CREATE DATABASE IF NOT EXISTS bettys_books;
USE bettys_books;

# Create the tables
CREATE TABLE IF NOT EXISTS user (id INT AUTO_INCREMENT PRIMARY KEY,First_name VARCHAR(50),Last_name VARCHAR(50),Username VARCHAR(50),Email VARCHAR(100),Hashed_Password VARCHAR(255));

