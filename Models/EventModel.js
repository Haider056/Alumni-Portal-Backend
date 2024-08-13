const pool = require('../Src/Config/db');

class EventModel {
  static async createEvent(eventData) {
    try {
      const { title, description, date, timing, locations, imageURL, createdBy } = eventData;

      const eventTiming = new Date(timing);
      
      if (!(eventTiming instanceof Date && !isNaN(eventTiming))) {
        console.error('Timing value is not a valid Date object');
      } else {
        const eventTimingFormatted = eventTiming.toISOString().slice(0, 19).replace('T', ' ');

        const query = `
          INSERT INTO events (eventTitle, eventDescription, eventDate, eventTiming, eventLocations, imageURL, createdBy)
          VALUES (?, ?, ?, ?, ?, ?, ?)
        `;
        const values = [title, description, date, eventTimingFormatted, locations, imageURL, createdBy];
        const result = await pool.query(query, values);
        return result.insertId; 
      }
    } catch (error) {
      throw error;
    }
  }

  static async getEventsByEmail(email) {
    try {
      const query = `
        SELECT *
        FROM events
        WHERE createdBy = (
          SELECT id FROM users WHERE email = ?
        )
      `;
      const [rows] = await pool.query(query, [email]);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getAllEvents() {
    try {
      const query = `
        SELECT *
        FROM events
      `;
      const [rows] = await pool.query(query);
      return rows;
    } catch (error) {
      throw error;
    }
  }

  static async getEventById(eventId) {
    try {
      const query = `
        SELECT *
        FROM events
        WHERE id = ?
      `;
      const [rows] = await pool.query(query, [eventId]);
      return rows[0];
    } catch (error) {
      throw error;
    }
  }
  static async deleteEvent(eventId) {
    try {
      const query = `
        DELETE FROM events
        WHERE id = ?
      `;
      const [result] = await pool.query(query, [eventId]);
      return result;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = EventModel;
