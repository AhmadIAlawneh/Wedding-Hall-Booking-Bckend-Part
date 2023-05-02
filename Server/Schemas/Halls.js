const { object, array } = require('joi');
const mongoose =require('mongoose');
const hallSchema= mongoose.Schema({
  
name:{
type:String,
required:true,
},
type:{
type:String,

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

    designs: [
      {
        name:{
          type: String,
          required: true,
        },
        imageUrl: {
          type: String,
          required: true,
        },
        price: {
          type: Number,
          required: true,
        },
        description: {
          type: String,
          required: true,
        },
      },
    ],
booking: [{
  user: {
    type: Object,
    ref: 'User'
  },
  bookDate: {
    type: Date,
  },
  bookStartTime: {
    type: Date,
  },
  bookEndTime: {
    type: Date,
  },
  payment: {
    paymentDate: {
      type: Date,
    },
    paymentAmount: {
      type: Number,
    },
  },
}],

    
    
    

   
    

}

);
let Halls= mongoose.model('Halls', hallSchema);
module.exports =Halls;
