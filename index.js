const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')
const jwt = require('jsonwebtoken')
const mongoose = require('mongoose')
const UserModel = require('./Schema/user')
const dotenv = require('dotenv').config()
const PORT = 5000 || process.env.PORT
//mongoose connection
mongoose.connect(process.env.DB_URL)
mongoose.connection.
once('open', () => console.log("Mongo Db Connected SuccesFully...."))
    .on('error', (error) => console.error("error:::", error))


//middle ware
app.use(cors())
app.use(bodyParser.json())



app.get('/', (req, res) => {
    res.send("hy im ready")
})

app.post('/api/user/register', async (req, res) => {
    try {
        const {
            userName,
            password
        } = req.body
        const UserExist = await UserModel.findOne({
            userName
        })
        if (UserExist) return res.status(400).json({
            message: "User Already Exist"
        })
        const create = await UserModel.create({userName, password})
        if (create) return res.status(200).json({
            message: "Register SuccesFully"
        })
    } catch (error) {
        console.log(error);
    }
})

app.post('/api/user/login', async (req, res) => {
    try {
        const {
            userName,
            password
        } = req.body
        console.log("data", req.body);

        const UserExist = await UserModel.findOne({
            userName
        })
        if (UserExist) {
            if (UserExist.password === password) {
                //user Rady To Login
                const token = await jwt.sign({
                    userName,
                    password
                }, "scecret_token", {
                    expiresIn: "1min"
                })

                return res.status(200).json({
                    message: "success login",
                    token
                })
            }
        }
        return res.status(400).json({
            message: "User Name or Password is Wrong"
        })


    } catch (error) {
        console.log(error);
    }
})

app.get('/profile', async (req, res) => {
    try {
        const {
            token
        } = req.body
        //verify Token
        console.log("token", token);

        const verify = await jwt.verify(token, 'scecret_token');
        console.log("verify", verify);

        if (verify) {
            return res.status(200).json({
                message: "You Can View This Profile SuccesFully"
            })
        }


    } catch (error) {
        console.log(error);
        return res.status(400).json({
            message: "Redirect To loGin Page"
        })
    }
})


app.listen(PORT, () => console.log("sERVER lISTEN in Port 5000"))