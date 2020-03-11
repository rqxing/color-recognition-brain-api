const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

const register = require("./controllers/register.js");
const signin = require("./controllers/signin.js");

const db = knex({
    client: 'pg',
    connection: {
      host : '127.0.0.1',
      port:"3002",
      user : 'postgres',
      password : 'secret',
      database : 'color-recognition-brain'
    }
});

const app = express();
app.use(express.json());
app.use(cors());

app.get('/',(req,res)=>{
    res.send("homepage is working");
})

app.post('/signin',(req,res) => {signin.handleSignin(req,res,db,bcrypt)})

app.post('/register',(req,res) => {register.handleRegister(req,res,db,bcrypt)});

app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    db.select("*").from("users").where({id:id})
        .then(user =>{
            if(user.length){
                res.json(user[0]);
            }else{
                res.status(400).json('no such user');
            }
        })
        .catch(error=>{
            res.status(400).json('get profile failed');
        })
})

app.put('/image',(req,res)=>{
    const {id} = req.body;
    db("users").where('id','=',id)
        .increment("entries",1)
        .returning('entries')
        .then(entries => {
            if(entries.length){
                res.json(parseInt(entries[0]));
            }else{
                res.status(400).json('no such user');
            }
        })
        .catch(error=>{
            res.status(400).json('update entries failed');
        })
})

app.listen(3001,()=>{
    console.log('app is running on port 3001')
}) 