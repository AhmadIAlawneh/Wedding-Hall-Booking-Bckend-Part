const mongoose =require('mongoose');
const rolesSchema= mongoose.Schema({
    roleName: {
        type: String
    },
});
module.exports = mongoose.model('Roles', rolesSchema)
