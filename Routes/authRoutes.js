const express = require('express');
const authController = require('../controllers/authController');
const UserPortfolioController = require('../controllers/UserPortfolioController');
const NewsController = require('../Controllers/AdminNewsController');
const PostJobOrInternshipController = require('../Controllers/postJobOrInternshipController'); 
const alumniSuccessStoriesController = require('../Controllers/alumniSuccessStoriesController');
const postJobOrInternshipController = require('../Controllers/postJobOrInternshipController');
const EventsController= require('../Controllers/EventsController');
const AdminNewsController = require('../Controllers/AdminNewsController');
const AuditoriumController = require('../Controllers/auditoriumController')
const router = express.Router();



const isLoggedIn = (req, res, next) => {
  if (req.session.isLoggedIn) {
    next(); 
  } else {
    console.log('Unauthorized access attempt to protected route'); 
    res.status(401).json({ message: 'Unauthorized: Please log in' });
  }
};
router.get('/bookings', AuditoriumController.getAllBookings);
router.post('/signup', authController.signup);
router.post('/login', authController.login);
router.post('/createNews', NewsController.createNews); 
router.use(isLoggedIn); 
router.post('/book', AuditoriumController.bookAuditorium);
router.post('/logout', authController.logout);
router.post('/createPortfolio', UserPortfolioController.createOrUpdatePortfolio);
router.get('/portfolio/:email', UserPortfolioController.getPortfolioByEmail);
router.post('/CreateEvents', EventsController.createEvent);
router.get('/eventsByEmail/:email', EventsController.getEventsByEmail);
router.get('/allEvents', EventsController.getAllEvents);
router.get('/event/:eventId', EventsController.getEventById);
router.get('/getnews',NewsController.getAllNews);
router.delete('/events/:eventId', EventsController.deleteEvent);
router.get('/PostedJobs/:email', PostJobOrInternshipController.getPostJobOrInternshipByEmail);
router.get('/successStories/:email', (req, res) => {
  const { email } = req.params;
  alumniSuccessStoriesController.getSuccessStoriesByEmail(req, res, email);
});
router.delete('/news/:newsId', NewsController.deleteNews);
router.post('/resetPassword', authController.resetPassword);
router.post('/createJobOrInternship', PostJobOrInternshipController.createPostJobOrInternship); 
router.post('/createSuccessStory', alumniSuccessStoriesController.createSuccessStory); 
router.get('/AllPostedJobs',PostJobOrInternshipController.getAllPostJobOrInternships);
router.get('/AllSuccessStories', alumniSuccessStoriesController.getAllSuccessStories);
router.get('/JobDescription/:jobId', PostJobOrInternshipController.getPostJobOrInternshipById);
router.get('/News/:newsId', AdminNewsController.getNewsId);

router.get('/jobApplications/:jobId', PostJobOrInternshipController.getApplicationsByJobId);

router.delete('/deleteSuccessStory/:jobid', (req, res) => {
  const id = req.params.jobid; 
  alumniSuccessStoriesController.deleteSuccessStory(id, res); 
});
router.delete('/DeleteJob/:jobid', (req, res) => {
  const id = req.params.jobid; 
  postJobOrInternshipController.DeleteJob(id,res)
});

router.post('/applyJob', (req, res) => {
  const { jobId, applicantEmail } = req.body;

  PostJobOrInternshipController.createApplication({ jobId, applicantEmail })
      .then(applicationId => {
          res.status(201).json({ applicationId, message: 'Application created successfully' });
      })
      .catch(error => {
          console.error('Error creating application:', error);
          res.status(500).json({ message: 'Internal Server Error' });
      });
});



module.exports = router;
