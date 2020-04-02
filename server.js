const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");
const profile = require("./controllers/profile.js");
const image = require("./controllers/image.js");

const db = knex({
    client: 'pg',
    connection: {
      host : process.env.host,
      port:process.env.port,
      user : process.env.user,
      password : process.env.password,
      database : process.env.database
    }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    db.select("*").from("users").orderBy("id")
        .then(users =>{
            if(users.length){
                res.json(users[0]);
            }else{
                res.status(400).json('Be the first one to register.');
            }
        })
        .catch(error=>{
            res.status(400).json('Server is working, but can not connect to database.');
        })
})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)});

app.get('/profile/:id',(req,res)=>{profile.handleProfileGet(req,res,db)})

app.put('/image',(req,res)=>{image.handleImage(req,res,db)})

app.listen(8080,"0.0.0.0",()=>{
    console.log('app is running on port 8080');
}) 