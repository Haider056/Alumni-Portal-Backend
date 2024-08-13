const pool = require('../Src/Config/db');

class AlumniSuccessStoriesModel {
  async createSuccessStory({ alumni_name, graduation_year, department_name, success_story, req }) {
    try {
      if (!req.session.userEmail) {
        throw new Error('User email not found in session');
      }

      if (!alumni_name || !graduation_year || !department_name || !success_story) {
        throw new Error('All parameters must be defined');
      }

      const [result] = await pool.execute(
        'INSERT INTO alumni_success_stories (alumni_name, alumni_email, graduation_year, department_name, success_story) VALUES (?, ?, ?, ?, ?)',
        [alumni_name, req.session.userEmail, graduation_year, department_name, success_story]
      );

      return result.insertId;
    } catch (error) {
      console.error('Error creating success story:', error);
      throw error;
    }
  }
  
  async getSuccessStoriesByEmail(email) {
    try {
      const [result] = await pool.execute('SELECT * FROM alumni_success_stories WHERE alumni_email = ?', [email.trim()]);
      if (result.length === 0) {
        return null;
      }
  
      return result;
    } catch (error) {
      console.error('Error fetching success stories by email:', error);
      throw error;
    }
  }

  async getAllSuccessStories() {
    try {
      const [result] = await pool.execute('SELECT * FROM alumni_success_stories');
      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error fetching all success stories:', error);
      throw error;
    }
  }
  async DeleteSucessStory({id}){
    const [result] = await pool.execute(`DELETE FROM alumni_success_stories WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}

module.exports = {
  alumniSuccessStoriesModel: new AlumniSuccessStoriesModel(),
};
