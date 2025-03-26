const pg = require('pg')
const client = new pg.Client('postgres://localhost/the_acme_store_db')
const uuid = require('uuid')

const createTables = async() => {
    const SQL = `
    DROP TABLE IF EXISTS favorites;
    DROP TABLE IF EXISTS users;
    DROP TABLE IF EXISTS products;

    CREATE TABLE users (
         id UUID PRIMARY KEY, 
         username VARCHAR(20) UNIQUE NOT NULL,
         password VARCHAR(20) NOT NULL,
    );
    CREATE TABLE products (
         id UUID PRIMARY KEY, 
         name VARCHAR(200) NOT NULL,
    );
    CREATE TABLE favorites (
         id UUID PRIMARY KEY, 
         user_id UUID REFERENCES users(id) NOT NULL,
         product_id UUID REFERENCES products(id) NOT NULL,
         CONSTRAINT unique_user_id_and_product_id UNIQUE (user_id, product_id)

    )
    `;
    await client.query(SQL)
}

module.exports = {
    client, 
    createTables
}