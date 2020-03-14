const  handleSignin = (req,res,db,bcrypt) => {
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
                            res.status(400).json("there is something wrong with database");
                        }
                    })
                    .catch(error=>{
                        res.status(400).json('there is something wrong with database');
                    }) 
                }else{
                    res.status(400).json('wrong password');
                }
            }else{
                res.status(400).json('no such user');
            }
        })
    .catch(error=>{
        res.status(400).json('there is something wrong with database');
    })
}

module.exports = {
    handleSignin: handleSignin
}