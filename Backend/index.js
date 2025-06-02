import express from 'express'
import dotenv from 'dotenv'
import connectDB from './Database/db.js';
import cookieParser from 'cookie-parser';
import cors from 'cors'
import authRoutes from './Routes/authRoutes.js'

const app = express();

dotenv.config()

const port = process.env.PORT

//using Middlewares
app.use(express.json())
app.use(cookieParser())
app.use(cors())

//using Routes
app.use('/api/user', authRoutes)

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`)
    connectDB()
})