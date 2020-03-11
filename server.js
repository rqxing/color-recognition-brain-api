const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors');
const knex = require('knex');

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

app.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    db.select("email","hash").from("login")
        .where("email", "=", email)
        .then(data=>{
            if(data.length){
                const isValid = bcrypt.compareSync(password, data[0].hash);
                if(isValid){
                    return db.select("*").from("users").where("email","=",email)
                    .then(user => {
                        if(user.length){
                            res.json(user[0])
                        }else{
                            res.status(400).json("can not load user profile");
                        }
                    })
                    .catch(error=>{
                        res.status(400).json('unable signin');
                    }) 
                }else{
                    res.status(400).json('wrong password');
                }
            }else{
                res.status(400).json('no such user');
            }
        })
        .catch(error=>{
            res.status(400).json('unable signin');
        })
})

app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    db.transaction(trx => {
        trx.insert({
            email:email,
            hash:hash
        })
        .into("login")
        .returning("email")
        .then(loginEmail =>{
            return db('users')
                .returning("*")
                .insert({
                    email:loginEmail[0],
                    name:name,
                    joined:new Date()
                })
                .then(user => {
                    res.json(user[0]);
                })
        })
        .then(trx.commit)
        .catch(trx.rollback)
    })
    .catch(err => {
        res.status(400).json("unable to register, may be the email has existed");
    })
});

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