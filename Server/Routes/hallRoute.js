const express = require('express');
const Halls = require('../Schemas/Halls');

const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { object,string, number } = require('joi');

router.post('/halls', async (req, res) => {
  const hall = req.body;
  try{
    await Halls.create(hall);
    res.status(200).json({
      message: "Success"
    })
  }catch(e) {
    res.status(500).json({
      message: "something went wrong",
      error: e
    })

  }
  
})

// Booking
router.post('/halls/:hallId/bookings', async (req, res) => {
  try {
    const { hallId } = req.params;
    const { userId, bookDate, bookStartTime, bookEndTime, paymentAmount } = req.body;

    const hall = await Halls.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Check if the hall is available for the given date and time
    const bookings = hall.booking;
    const currentDate = new Date();
    const bookedDates = bookings.filter((booking) => {
      const start = new Date(booking.bookStartTime);
      const end = new Date(booking.bookEndTime);
      return start <= currentDate && end >= currentDate;
    });

    for (let i = 0; i < bookedDates.length; i++) {
      const booking = bookedDates[i];
      const start = new Date(booking.bookStartTime);
      const end = new Date(booking.bookEndTime);
      if (start <= new Date(bookStartTime) && end >= new Date(bookEndTime)) {
        return res.status(400).json({ message: 'Hall is not available for the given date and time' });
      }
    }

    // Book the hall
    hall.booking.push({
      user: userId,
      bookDate: bookDate,
      bookStartTime: bookStartTime,
      bookEndTime: bookEndTime,
      payment: {
        paymentDate: new Date(),
        paymentAmount: paymentAmount
      }
    });

    await hall.save();

    res.json(hall);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


// Get all halls with booking and payments


router.get('/api/halls', async (req, res) => {
  try {
    const halls = await Halls.find().populate({
      path: 'booking.user',
      model: 'User'
    });
    res.send(halls);
  } catch (ex) {
    console.log(ex.message);
    res.status(500).send('Error occurred while getting halls.');
  }
});

// PUT /halls/:userId/:bookDate


router.put('/halls/:userId/:bookDate/:bookStartTime', async (req, res) => {
  const userId = req.params.userId;
  const bookDate = new Date(req.params.bookDate);
  const bookStartTime = new Date(req.params.bookStartTime);

  try {
    // Find the hall that has the booking
    const hall = await Halls.findOne({ 'booking.user': userId, 'booking.bookDate': bookDate });

    if (!hall) {
      // Handle case when hall is not found
      return res.status(404).send('Booking not found');
    }

    // Find the booking in the hall's booking array
    const booking = hall.booking.find(b => b.user === userId && b.bookDate.getTime() === bookDate.getTime() && b.bookStartTime.getTime() === bookStartTime.getTime());

    if (!booking) {
      // Handle case when booking is not found
      return res.status(404).send('Booking not found');
    }

    // Modify the booking
    booking.bookDate = new Date(req.body.bookDate);
    booking.bookStartTime = new Date(req.body.bookStartTime);
    booking.bookEndTime = new Date(req.body.bookEndTime);

    // Save the updated hall document
    await hall.save();

    // Send response to client
    return res.send('Booking modified successfully');
  } catch (err) {
    // Handle error
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

//delete booking 


router.delete('/halls/:userId/:bookDate/:bookStartTime', async (req, res) => {
  const userId = req.params.userId;
  const bookDate = new Date(req.params.bookDate);
  const bookStartTime = new Date(req.params.bookStartTime);

  try {
    // Find the hall that has the booking
    const hall = await Halls.findOne({ 'booking.user': userId, 'booking.bookDate': bookDate, 'booking.bookStartTime': bookStartTime });

    if (!hall) {
      // Handle case when hall is not found
      return res.status(404).send('Booking not found');
    }

    // Remove the booking from the hall document
    hall.booking.pull({ user: userId, bookDate, bookStartTime });
    
    // Save the updated hall document
    await hall.save();

    // Send response to client
    return res.send('Booking deleted successfully');
  } catch (err) {
    // Handle error
    console.error(err);
    return res.status(500).send('Internal Server Error');
  }
});

// add design
const Joi = require('joi'); 
const addDesignSchema = Joi.object({
  name: Joi.string().required(),
  price: Joi.number().required(),
  description: Joi.string().required(),
});


router.post('/halls/:hallId/designs', upload.single('image'), async (req, res) => {
  try {
    const hallId = req.params.hallId;

    const { name, price, description } = await addDesignSchema.validateAsync(req.body);

    const imageUrl = req.file.path; // assuming multer saves the image to the "uploads" directory

    const design = { name, price, description, imageUrl };

    const updatedHall = await Halls.findByIdAndUpdate(hallId, { $push: { designs: design } }, { new: true });

    res.status(200).json(updatedHall);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.patch('/halls/:hallId/designs/:designId', async (req, res) => {
  try {
    const hallId = req.params.hallId;
    const designId = req.params.designId;

    const { name, price, description } = await addDesignSchema.validateAsync(req.body);

    const design = await Halls.findOneAndUpdate(
      { _id: hallId, 'designs._id': designId },
      { 
        $set: { 
          'designs.$.name': name,
          'designs.$.price': price,
          'designs.$.description': description,
        }
      },
      { new: true }
    );

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.status(200).json(design);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/hallsdel/:hallId/designs/:designId', async (req, res) => {
  try {
    const hallId = req.params.hallId;
    const designId = req.params.designId;

    const design = await Halls.findOneAndUpdate(
      { _id: hallId },
      { $pull: { designs: { _id: designId } } },
      { new: true }
    );

    if (!design) {
      return res.status(404).json({ error: 'Design not found' });
    }

    res.status(200).json(design);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//get all halls  

router.get('/halls', async (req, res) => {
  try {
    const halls = await Halls.find({});
    res.status(200).json(halls);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});
  module.exports = router;