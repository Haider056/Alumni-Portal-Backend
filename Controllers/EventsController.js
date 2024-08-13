const express = require('express');
const path = require('path');
const multer = require('multer');
const EventModel = require('../Models/EventModel');

const app = express();

app.use('/images', express.static(path.join(__dirname, '../public/images')));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, '../public/images'); 
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg');
  }
});

const upload = multer({ storage: storage }).single('image');

class EventsController {
  static async createEvent(req, res) {
    try {
      upload(req, res, async function (err) {
        if (err) {
          console.error('Error uploading file:', err);
          return res.status(500).json({ message: 'Error uploading file' });
        }

        const { title, description, date, timing, locations } = req.body;
        const imageURL = `/images/${req.file.filename}`; 

        const formattedDate = new Date(date).toISOString().split('T')[0];

        const createdBy = 1; 

        const eventID = await EventModel.createEvent({ title, description, date: formattedDate, timing, locations, imageURL, createdBy });

        res.status(201).json({ eventID, imageURL }); 
      });
    } catch (error) {
      console.error('Error creating event:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getEventsByEmail(req, res) {
    try {
      const { email } = req.params;
      const events = await EventModel.getEventsByEmail(email);
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching events by email:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getAllEvents(req, res) {
    try {
      const events = await EventModel.getAllEvents();
      res.status(200).json(events);
    } catch (error) {
      console.error('Error fetching all events:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  static async getEventById(req, res) {
    try {
      const { eventId } = req.params;
      const event = await EventModel.getEventById(eventId);
      if (event) {
        res.status(200).json(event);
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error('Error fetching event by ID:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  static async deleteEvent(req, res) {
    try {
      const { eventId } = req.params;
      const result = await EventModel.deleteEvent(eventId);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'Event deleted successfully' });
      } else {
        res.status(404).json({ message: 'Event not found' });
      }
    } catch (error) {
      console.error('Error deleting event:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = EventsController;
