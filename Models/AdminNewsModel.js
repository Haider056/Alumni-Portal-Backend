const pool = require('../Src/Config/db');

class NewsModel {
  async createNews({ newsTitle, newsDescription, newsImageURL }) {
    try {
      const query = 'INSERT INTO news (newsTitle, newsDescription, newsImageURL) VALUES (?, ?, ?)';
      await pool.query(query, [newsTitle, newsDescription, newsImageURL]);
      console.log('News created successfully');
    } catch (error) {
      console.error('Error creating news:', error);
      throw error;
    }
  }
  async getAllNews() {
    try {
      const [rows] = await pool.execute('SELECT * FROM news');
      return rows;
    } catch (error) {
      console.error('Error fetching all news:', error);
      throw error;
    }
  }
  async getNewsId(newsId) {
    try {
      const [result] = await pool.execute(
        'SELECT * FROM news WHERE id = ?',
        [newsId]
      );

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      console.error('Error fetching News by ID:', error);
      throw error;
    }
  }
  async deleteNews(newsId) {
    try {
      const query = 'DELETE FROM news WHERE id = ?';
      const [result] = await pool.query(query, [newsId]);
      return result;
    } catch (error) {
      console.error('Error deleting news:', error);
      throw error;
    }
  }
}

module.exports = { NewsModel }; 
