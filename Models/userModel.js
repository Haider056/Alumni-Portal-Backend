const pool = require('../Src/Config/db');

class UserModel {
  async createUser(name, email, password, country, cnic, mobile_number, city, role) {
    try {
      if (!name || !email || !password || !country || !cnic || !mobile_number || !city || !role) {
        throw new Error('All parameters must be defined');
      }
  
      const [result] = await pool.execute(
        'INSERT INTO users (name, email, password, country, cnic, mobile_number, city, role) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, password, country, cnic, mobile_number, city, role]
      );
  
      if (result && result.insertId) {
        return result.insertId;
      } else {
        throw new Error('Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      throw error;
    }
  }
  

  async getUserByEmail(email) {
    const [users] = await pool.execute('SELECT * FROM users WHERE email = ?', [email]);
    return users[0] || null;
  }

  async getUserRole(email) {
    try {
      const [users] = await pool.execute('SELECT role FROM users WHERE email = ?', [email]);
  
      if (!users || users.length === 0) {
        throw new Error(`No user found with email: ${email}`);
      }
  
      return users[0];
    } catch (error) {
      console.error('Error fetching user role:', error);
      throw error;
    }
  }
  
  
  
  async updateUserPassword(email, newPassword) {
    try {
      await pool.execute('UPDATE users SET password = ? WHERE email = ?', [newPassword, email]);
    } catch (error) {
      console.error('Error updating user password:', error);
      throw error;
    }
  }
}

module.exports = new UserModel();
