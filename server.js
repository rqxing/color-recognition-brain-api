const express = require('express');
const bcrypt = require('bcryptjs');
const cors = require('cors')

const app = express();
app.use(express.json());
app.use(cors());

const database = {
    users:[
        {
            id:'0',
            name:'eva',
            email:'eva@gmail.com',
            entries:0,
            joined:new Date(),
            hash:bcrypt.hashSync('eva123', bcrypt.genSaltSync(10))
        },
        {
            id:'1',
            name:'shu',
            email:'shu@gmail.com',
            entries:0,
            joined:new Date(),
            hash:bcrypt.hashSync('shu123', bcrypt.genSaltSync(10))
        }
    ]
}
app.get('/',(req,res)=>{
    res.send(database.users);
})

app.post('/signin',(req,res)=>{
    const {email,password} = req.body;
    let found = false;
    database.users.forEach(user =>{
        if(user.email === email){
            found = true;
            if(bcrypt.compareSync(password, user.hash)){
                return res.json(user);
            }else{
                return res.status(400).json('wrong password');
            }
        }
    })
    if(found===false){
        res.status(400).json('no such user')
    }
})

app.post('/register',(req,res)=>{
    const {name,email,password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    const id = database.users.length.toString();
    database.users.push({
        id:id, 
        name:name,
        email:email,
        entries:0,
        joined:new Date(),
        hash:hash
    })
    res.json(database.users[database.users.length-1]);
})

app.get('/profile/:id',(req,res)=>{
    const {id} = req.params;
    let found = false;
    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            return res.json(user);
        }
    })
    if(found===false){
        res.status(400).json('no such user')
    }
})

app.put('/image',(req,res)=>{
    const {id} = req.body;
    let found = false;
    database.users.forEach(user =>{
        if(user.id === id){
            found = true;
            user.entries++
            return res.json(user.entries);
        }
    })
    if(found===false){
        res.status(400).json('no such user')
    }
})

app.listen(3001,()=>{
    console.log('app is running on port 3001')
}) 