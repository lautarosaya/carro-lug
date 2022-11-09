import express, {Router, application} from 'express'
import dotenv from 'dotenv'
import mongoose from 'mongoose'
import indexRouter from './routes/api/index'
dotenv.config()

const app = express()

app.use(express.json({ limit: "10mb"}))
app.use(express.urlencoded({ extended: true}))
app.use('/api', indexRouter)

async function connectToDb() {
    if (process.env.DB_CONNECTION_STRING) {
        await mongoose.connect(process.env.DB_CONNECTION_STRING)
    } else{
        console.log('No hay string de conexion');
    }
}

app.listen(process.env.PORT, () => {
    console.log(`Servidor iniciado en puerto ${process.env.PORT}`)
    connectToDb()
    .then(() => console.log('Se conecto con la base de datos'))
    .catch((err) => console.log(err))
})

module.exports = app