const express = require('express');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()
const authRoute = require('./routes/auth')
const credentials = require('./middleware/credentional')
const corsOptions = require('./config/corOptions')
const postRoute = require('./routes/post')
const userRoute = require('./routes/user')
const profileRoute = require('./routes/profile')
const verifyJWT = require('./middleware/verifyJWT')
const db = process.env.DB_CONNECTION_STRING
var morgan = require('morgan')

//initail setup
const app = express()
const port = process.env.PORT || 5000
app.use(morgan('tiny'))
app.use(credentials);
app.use(cors(corsOptions))
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.json());
app.use(bodyParser.json())
app.use(cookieParser())

//routes
app.use('/api/v1/auth', authRoute)
app.use('/api/v1/post', verifyJWT, postRoute)
app.use('/api/v1/user', verifyJWT, userRoute)
app.use('/api/v1/suggestion', verifyJWT, userRoute)
app.use('/api/v1/profile', verifyJWT, profileRoute)

app.listen(port, async () => {
    console.log('server running on port ' + port + ' waiting to connect with data base')
    try {
        await mongoose.connect(db)
        console.log('db connected successfully')

    } catch (error) {
        console.log("error", error)
    }
})

module.exports = app