const mongoose =require('mongoose');
const hallSchema= mongoose.Schema({
  
name:{
type:String,
required:true,
},
type:{
type:String,
required:true,
},
location:{
    type:String,
    required:true,
    },
    user:{
        type:Object,
        ref:'User'
    },
    availableTimes :{
type:Date,

    },

    designs:{
    type:Object,
    required:true,
    price:{
        type:Number,
required:true,
    },
    description:{
        type:String,
        required:true,
    },
   
   

},
booking:{
    type:Object,
    user:[{
        
        "$ref": "User"
    }],
    bookDate:{
        type:Date,
        require:true
    },
    bookStartTime:{
type:Date,
require:true

    },
    bookEndTime:{
        type:Date,
        require:true
        
            },
    payment:{
        type:Object,
        paymentDate:{
type:Date,
required:true,

        },
        paymentAmount:{
type:Number,
required:true,
        },

    }

},

    
    
    

   
    

}

);
module.exports = mongoose.model('Halls', hallSchema)
