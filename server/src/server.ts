import express from 'express'
import routes from './routes/routes'
import cors from 'cors'
import { errors } from 'celebrate'

//porta
const port = 5000
const app = express()
app.use(express.json())
app.options('*', cors());
app.use(cors())



app.use('/uploads', express.static('uploads'))
app.use(routes)

app.use(errors())

app.listen(port)
