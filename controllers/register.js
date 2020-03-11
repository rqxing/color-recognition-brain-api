const  handleRegister = (req,res,db,bcrypt) => {
    const {name,email,password} = req.body;
    if(!name || !email || !password){
        return res.status(400).json("incorrect form submission")
    }
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
}

module.exports = {
    handleRegister: handleRegister
}