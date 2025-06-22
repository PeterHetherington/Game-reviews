import express from "express"
import cors from "cors"
import dotenv from "dotenv"
import pg from "pg"

const app = express();

app.use(cors());
app.use(express.json());

dotenv.config();

const db = new pg.Pool({
    connectionString: process.env.DB_CONN
})

app.get('/', (req, res) => {
    res.json('on root route')
})

// get route 
app.get('/gameReviews', async (req, res) => {
    // fetch jokes from sql table
    const result = await db.query(`SELECT * FROM gameReviews ORDER BY game ASC`)

    res.json(result.rows)
})

// post route
app.post('/gameReviews', async (req, res) => {
    const body = req.body
    console.log(body)

    const nameFromClient = req.body.name
    const gameFromClient = req.body.game
    const reviewFromClient = req.body.review
    const ratingFromClient = req.body.rating

    const data = await db.query(`INSERT INTO gameReviews (name, game, review, rating) VALUES ($1, $2, $3, $4)`, [nameFromClient, gameFromClient, reviewFromClient, ratingFromClient])

    res.send('Done')
})

// likes GET route
app.get('/likes', async (req, res)=> {
    const id = req.query.id
    const result = await db.query(`SELECT id, likes FROM gameReviews WHERE id=$1`, [id])
    res.json(result.rows)
})

// update likes POST route
app.post('/likes', async (req, res) =>{
    const body = req.body
    const idFromClient = req.body.id
    const likesFromClient = req.body.likes
    // console.log(body)
    // console.log(idFromClient)
    // console.log(likesFromClient)
    const data = await db.query(`UPDATE gameReviews SET likes=$1 WHERE id=$2`, [likesFromClient, idFromClient])
    res.send('Done')
})




app.listen(8080, ()  => {
    console.log(`server running on port 8080`)
})