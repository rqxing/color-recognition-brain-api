const  handleImage = (req,res,db) => {
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
}

module.exports = {
    handleImage: handleImage
}