const express = require('express');
const Halls = require('../Schemas/Halls');
const router = express.Router();
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });
const { object,string, number } = require('joi');

// add hall 
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
//get a hall

router.get('/halls/:id', async (req, res) => {
  try {
    const hallId = req.params.id;

    // Find the hall by ID
    const hall = await Halls.findById(hallId);
    if (!hall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    res.status(200).json({ hall });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/halls', async (req, res) => {
  try {
    // Find all halls
    const halls = await Halls.find();

    res.status(200).json({ halls });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// delete a  hall 

router.delete('/halls/:id', async (req, res) => {
  try {
    const hallId = req.params.id;

    // Find the hall by ID and delete it
    const deletedHall = await Halls.findByIdAndDelete(hallId);
    if (!deletedHall) {
      return res.status(404).json({ error: 'Hall not found' });
    }

    res.status(200).json({ message: 'Hall deleted successfully' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Booking
//make booking
router.post('/halls/:hallId/bookings/:designId', async (req, res) => {
  try {
    const { hallId, designId } = req.params;
    const { userId, bookDate, bookStartTime, bookEndTime, paymentAmount } = req.body;

    const hall = await Halls.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Check if the hall is available for the given date and time
    const overlappingBooking = hall.booking.find((booking) => {
      const start = new Date(booking.bookStartTime);
      const end = new Date(booking.bookEndTime);
      const requestedStart = new Date(bookStartTime);
      const requestedEnd = new Date(bookEndTime);

      return (
        (requestedStart >= start && requestedStart < end) ||
        (requestedEnd > start && requestedEnd <= end) ||
        (requestedStart <= start && requestedEnd >= end)
      );
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Hall is not available for the given date and time' });
    }

    // Find the selected design by ID
    const selectedDesign = hall.designs.find((design) => design._id.toString() === designId);
    if (!selectedDesign) {
      return res.status(404).json({ message: 'Design not found' });
    }

    // Book the hall with the selected design
    const newBooking = {
      user: userId,
      bookDate: bookDate,
      bookStartTime: bookStartTime,
      bookEndTime: bookEndTime,
      payment: {
        paymentDate: new Date(),
        paymentAmount: paymentAmount
      },
      design: {
        _id: selectedDesign._id,
        name: selectedDesign.name,
        imageUrl: selectedDesign.imageUrl,
        price: selectedDesign.price,
        description: selectedDesign.description
      }
    };

    hall.booking.push(newBooking);
    await hall.save();

    res.json(newBooking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});
// delete all booking for an hall 

router.delete('/halls/:hallId/bookings', async (req, res) => {
  try {
    const { hallId } = req.params;
    
    // Find the hall by ID
    const hall = await Halls.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }
    
    // Delete all bookings for the hall
    hall.booking = [];
    
    await hall.save();
    
    res.json({ message: 'All bookings for the hall have been deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});


router.put('/halls/:hallId/bookings/:bookingId', async (req, res) => {
  try {
    const { hallId, bookingId } = req.params;
    const { userId, bookDate, bookStartTime, bookEndTime, paymentAmount } = req.body;

    const hall = await Halls.findById(hallId);
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    // Find the booking to be modified
    const bookingIndex = hall.booking.findIndex((booking) => booking._id.toString() === bookingId);
    if (bookingIndex === -1) {
      return res.status(404).json({ message: 'Booking not found' });
    }

    // Verify that the requesting user is the one who made the booking
    const booking = hall.booking[bookingIndex];
    if (booking.user.toString() !== userId) {
      return res.status(403).json({ message: 'You are not authorized to modify this booking' });
    }

    // Check if the hall is available for the modified booking date and time
    const overlappingBooking = hall.booking.find((booking, index) => {
      if (index === bookingIndex) {
        return false; // Skip the booking being modified
      }

      const start = new Date(booking.bookStartTime);
      const end = new Date(booking.bookEndTime);
      const requestedStart = new Date(bookStartTime);
      const requestedEnd = new Date(bookEndTime);

      return (
        (requestedStart >= start && requestedStart < end) ||
        (requestedEnd > start && requestedEnd <= end) ||
        (requestedStart <= start && requestedEnd >= end)
      );
    });

    if (overlappingBooking) {
      return res.status(400).json({ message: 'Hall is not available for the modified booking date and time' });
    }

    // Update the booking with the modified information
    booking.bookDate = bookDate;
    booking.bookStartTime = bookStartTime;
    booking.bookEndTime = bookEndTime;
    booking.payment.paymentAmount = paymentAmount;

    await hall.save();

    res.json(booking);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
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
    console.log({hallId})
    const updatedHall = await Halls.findByIdAndUpdate(hallId, { $push: { designs: design } }, { new: true });

    res.status(200).json({ 
      hall: updatedHall,
      imageUrl: imageUrl  // Include the image URL in the response
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

//modify design


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


// delete design

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

router.get('/halls/:hallId/bookings', async (req, res) => {
  try {
    const { hallId } = req.params;

    const hall = await Halls.findById(hallId).populate('designs').exec();
    if (!hall) {
      return res.status(404).json({ message: 'Hall not found' });
    }

    const bookings = hall.booking.map((booking) => {
      return {
        _id: booking._id,
        user: booking.user,
        bookDate: booking.bookDate,
        bookStartTime: booking.bookStartTime,
        bookEndTime: booking.bookEndTime,
        payment: booking.payment,
        design: booking.design
      };
    });

    res.json(bookings);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

  module.exports = router;