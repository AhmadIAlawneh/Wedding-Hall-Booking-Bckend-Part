
const { object, array, boolean } = require('joi');
const mongoose =require('mongoose');
const hallSchema= mongoose.Schema({
  
  name: {
    type: String,
    required: true,
  },
  type: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  availableTimes: {
    type: Date,
  },
  designs: [
    {
      name: {
        type: String,
  
      },
      imageUrl: {
        type: String,
        default: '',
        required: false,
        
      },
      price: {
        type: Number,
        
      },
      description: {
        type: String,
        default:false,
      },
    },
  ],
  booking: [
    {
      extraDecorations: {
        type: Boolean,
        
      },
      user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
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
          default: Date.now,
        },
        paymentAmount: {
          type: Number,
          required: true,
        },
      },
      design: {
      
        name: {
          type: String,
          
        },
        imageUrl: {
          type: String,
          default: '',
          required: false,
        
        },
        price: {
          type: Number,
         
        },
        description: {
          type: String,
          
        },
      },
    },
  ],
});
let Halls = mongoose.model("Halls", hallSchema);

module.exports = Halls;