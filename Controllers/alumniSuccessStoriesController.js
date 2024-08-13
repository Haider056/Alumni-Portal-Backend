const { alumniSuccessStoriesModel } = require('../Models/alumniSuccessStoriesModel');

class AlumniSuccessStoriesController {
  async getSuccessStoriesByEmail(req, res, email) {
    try {
    
      const successStories = await alumniSuccessStoriesModel.getSuccessStoriesByEmail(email);
  
      if (!successStories) {
        return res.status(404).json({ message: 'Success stories not found' });
      }
  
      res.status(200).json({ successStories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getAllSuccessStories(req, res) {
    try {
      const successStories = await alumniSuccessStoriesModel.getAllSuccessStories();
  
      if (!successStories || successStories.length === 0) {
        return res.status(404).json({ message: 'No success stories found' });
      }
  
      res.status(200).json({ successStories });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createSuccessStory(req, res) {
    try {
      const { alumni_name, graduation_year, department_name, success_story } = req.body;

      if (req.session.role !== 'alumni') {
        return res.status(403).json({ message: 'Forbidden: Only alumni can create success stories' });
      } else {
        await alumniSuccessStoriesModel.createSuccessStory({
          alumni_name,
          graduation_year,
          department_name,
          success_story,
          req, 
        });

        res.status(201).json({ message: 'Success story created successfully' });
        console.log('Success Story Created Successfully');
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async deleteSuccessStory(jobid,res){
    try{

      await alumniSuccessStoriesModel.DeleteSucessStory({
        id:jobid
      });
      res.status(201).json({ message: 'Success story Deleted successfully' });
      console.log('Success Story Deleted Successfully');
    }
    catch(error){
      console.error(error);
      res.status(500).json({message :'Internal server error'})
    }
  }
}

module.exports = new AlumniSuccessStoriesController();
