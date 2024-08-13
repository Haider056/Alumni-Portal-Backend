const { auditoriumModel } = require('../Models/AuditoriumModel');

exports.bookAuditorium = async (req, res) => {
  const { eventTitle, eventDate, eventTime, eventEndTime } = req.body;

  try {
    if (!eventTitle || !eventDate || !eventTime || !eventEndTime) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    const startTime = new Date(`${eventDate} ${eventTime}`);
    const endTime = new Date(`${eventDate} ${eventEndTime}`);

    const overlappingEvents = await auditoriumModel.getOverlappingEvents(eventDate, eventTime, eventEndTime);
    if (overlappingEvents.length > 0) {
      return res.status(400).json({ message: 'Event time overlaps with an existing event' });
    }

    const bookingId = await auditoriumModel.bookAuditorium({ eventTitle, eventDate, eventTime, eventEndTime });

    return res.status(201).json({ message: 'Auditorium booked successfully', bookingId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

exports.getAllBookings = async (req, res) => {
  try {
    const allBookings = await auditoriumModel.getAllBookings();
    const formattedBookings = allBookings.map(booking => ({
      ...booking,
      eventDate: new Date(booking.eventDate).toISOString().split('T')[0]
    }));
    return res.status(200).json(formattedBookings);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};