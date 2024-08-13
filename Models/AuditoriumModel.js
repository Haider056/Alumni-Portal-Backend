const pool = require('../Src/Config/db');

class AuditoriumModel {
  async bookAuditorium({ eventTitle, eventDate, eventTime, eventEndTime }) {
    try {
      if (!eventTitle || !eventDate || !eventTime || !eventEndTime) {
        throw new Error('Event title, date, start time, and end time must be provided');
      }

      // Check for overlapping events
      const overlappingEvents = await this.getOverlappingEvents(eventDate, eventTime, eventEndTime);
      if (overlappingEvents.length > 0) {
        throw new Error('Event time overlaps with an existing event');
      }

      const [result] = await pool.execute(
        'INSERT INTO auditorium (eventTitle, eventDate, eventTime, eventEndTime) VALUES (?, ?, ?, ?)',
        [eventTitle, eventDate, eventTime, eventEndTime]
      );

      console.log('Booking successful:', result.insertId);
      return result.insertId;
    } catch (error) {
      console.error('Error booking auditorium:', error.message);
      throw error;
    }
  }

  async getOverlappingEvents(eventDate, eventTime, eventEndTime) {
    try {
      const [result] = await pool.execute(
        'SELECT * FROM auditorium WHERE eventDate = ? AND ((eventTime < ? AND eventEndTime > ?) OR (eventTime > ? AND eventEndTime < ?))',
        [eventDate, eventTime, eventEndTime, eventTime, eventEndTime]
      );

      return result;
    } catch (error) {
      console.error('Error fetching overlapping events:', error);
      throw error;
    }
  }

  async getAllBookings() {
    try {
      const [result] = await pool.execute('SELECT eventTitle, eventDate, eventTime, eventEndTime FROM auditorium ORDER BY eventDate, eventTime');
      return result;
    } catch (error) {
      console.error('Error fetching all bookings:', error);
      throw error;
    }
  }
}

module.exports = {
  auditoriumModel: new AuditoriumModel(),
};
