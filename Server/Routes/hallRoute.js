const express = require('express');
const Halls = require('../Schemas/Halls');
const router = express.Router();

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
router.put('/halls/:userId/:bookDate', async (req, res) => {
  const userId = req.params.userId;
  const bookDate = new Date(req.params.bookDate);

  try {
    // Find the hall that has the booking
    const hall = await Halls.findOne({ 'booking.user': userId, 'booking.bookDate': bookDate });

    if (!hall) {
      // Handle case when hall is not found
      return res.status(404).send('Booking not found');
    }

    // Modify the booking
    hall.booking.bookStartTime = new Date(req.body.bookStartTime);
    hall.booking.bookEndTime = new Date(req.body.bookEndTime);

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
// DELETE /halls/:userId/:bookDate
router.delete('/halls/:userId/:bookDate', async (req, res) => {
  try {
    const userId = req.params.userId;
    const bookDate = new Date(req.params.bookDate);

    // Find the hall that has the booking
    const hall = await Halls.findOne({ 'booking.user': userId, 'booking.bookDate': bookDate });

    if (!hall) {
      // Handle case when hall is not found
      return res.status(404).send('Booking not found');
    }

    // Remove the booking from the hall document
    hall.booking = null;

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



  module.exports = router;
  ///6439e50f2c77f75efe499c68
  /*
  {
    "name": "Hall 1",
    "location": "Location 1",
    "type": 100,
    "designs":{
"price": 500,
"description":"blblblb"
    },
    
    "booking": null
}
*/
/*
[
  {
      "booking": {
          "payment": {
              "paymentAmount": 100,
              "paymentDate": "2023-04-19T21:34:28.768Z"
          },
          "bookDate": "2023-04-20T00:00:00.000Z",
          "bookEndTime": "2023-04-20T12:00:00.000Z",
          "bookStartTime": "2023-04-20T10:00:00.000Z",
          "user": "643712da2a092f505aed5929"
      },
      "_id": "643f173191861de1b815da90",
      "name": "Hall -b ",
      "location": "tulkarm",
      "user": "6439c61b581c367502c79c5a",
      "type": "party",
      "designs": {
          "price": 5000,
          "description": "hall 2"
      }
  },
  {
      "_id": "643f176891861de1b815da91",
      "name": "Hall -c ",
      "location": "tulkarm",
      "type": "party",
      "designs": {
          "price": 5000,
          "description": "hall 2"
      }
  }
]*/