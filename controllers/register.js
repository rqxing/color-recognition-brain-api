const  handleRegister = (req,res,db,bcrypt) => {
    const {name,email,password} = req.body;
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    if(name && email.includes("@") && password.length>=6){
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
                    .catch(err => {
                        res.status(400).json("there is something wrong with database");
                    })
            })
            .then(trx.commit)
            .catch(trx.rollback)
        })
        .catch(err => {
            res.status(400).json("email has existed");
        })
    }else{
        return res.status(400).json("incorrect form submission");
    }

    
}

module.exports = {
    handleRegister: handleRegister
}