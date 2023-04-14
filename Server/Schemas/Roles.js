const mongoose =require('mongoose');
const rolesSchema= mongoose.Schema({
roles:{
    type:Object,
    roleName:['owner','user'],

}
});
module.exports = mongoose.model('Roles', rolesSchema)
