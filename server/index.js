require('dotenv').config()
const {
    client, 
    createTables, 
    createProduct,
    createUser,
    createFavorite, 
    fetchProducts,
    fetchUsers,
    fetchFavoritesByUserId, 
    destroyFavorite
} = require('./db')

const express = require('express')
const app = express()
app.use(express.json())



const init = async() => {
    const port = 3000
    await client.connect()
    console.log('connected to database')

    await createTables()
    console.log('created tables')

    const [shoes, shirts, socks, dresses, bob, sam, theo, marcy] = await Promise.all([
        createProduct({ name: 'shoes'}),
        createProduct({ name: 'shirts'}),
        createProduct({ name: 'socks'}),
        createProduct({ name: 'dresses'}),
        createUser({ username: 'bobuser', password: 'bobpw'}),
        createUser({ username: 'samuser', password: 'sampw'}),
        createUser({ username: 'theouser', password: 'theopw'}),
        createUser({ username: 'marcyuser', password: 'marcypw'})

    ])
    console.log('seeded with products and users')

    console.log(await fetchProducts())
    console.log(await fetchUsers())

    console.log('attempt to fetch fav before adding,', await fetchFavoritesByUserId(marcy.id))
    const favorite = await createFavorite({ product_id: shoes.id, uesr_id: marcy.id})
    console.log('attempt to fetch fav after adding', favorite)

    await fetchFavoritesByUserId(marcy.id)
    await destroyFavorite({ user_id: marcy.id, id: favorite.id})

    console.log('----------CURL COMMANDS---------')
    console.log(`curl localhost:${port}/api/users`)

    console.log(`curl localhost:${port}/api/users/${marcy.id}/favorites`)
}

init()