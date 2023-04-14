const mongoose =require('mongoose');
const userSchema= mongoose.Schema({
    idNumber:{
        type:Number,
        required:true,
        unique:true,
        },
userName:{
type:String,
required:true,
unique:true,
},
role:{
    type:Object,
ref:'Roles'
},
email:{
    type:String,
    required:true,
    unique:true,
    },
    name:{
        type:String,
        required:true,
      
        },
        phone:{
            type:String,
            required:true,
            unique:true,
            },
            address:{
                type:String,
                required:true,
              
                },
                password:{
                    type:String,
                    required:true,
                   
                    },
                

}

);
let User= mongoose.model('User', userSchema);
module.exports =User;
  
