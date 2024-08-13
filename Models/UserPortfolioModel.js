const db = require('../Src/Config/db');

class UserPortfolioModel {
  async createUser({
    name,
    email,
    profession,
    about,
    education,
    Gpa,
    address,
    number,
    experiences,
    projects,
    skills,
  }) {
    try {
      const [result] = await db.execute(
        'INSERT INTO portfolio (name, email, profession, about, education, Gpa, address, number, skills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [name, email, profession, about, education, Gpa, address, number, skills]
      );

      const portfolioId = result.insertId;

 
      await Promise.all(experiences.map(async (exp) => {
        await db.execute(
          'INSERT INTO experience (portfolio_id, companyName, designation, startDate, endDate, experienceDescription) VALUES (?, ?, ?, ?, ?, ?)',
          [portfolioId, exp.companyName, exp.designation, exp.startDate, exp.endDate, exp.experienceDescription]
        );
      }));

      
      await Promise.all(projects.map(async (project) => {
        await db.execute(
          'INSERT INTO projects (portfolio_id, projectName, description) VALUES (?, ?, ?)',
          [portfolioId, project.projectName, project.description]
        );
      }));

      return portfolioId;
    } catch (error) {
      console.error('Error creating user portfolio:', error);
      throw error;
    }
  }

  async getUserPortfolioByEmail(email) {
    try {
      const [result] = await db.execute('SELECT * FROM portfolio WHERE email = ?', [email]);

      if (result.length === 0) {
        return null;
      }

      const portfolio = { ...result[0] };

  
      const [experiences] = await db.execute('SELECT * FROM experience WHERE portfolio_id = ?', [portfolio.id]);  
      portfolio.experiences = experiences;

      const [projects] = await db.execute('SELECT * FROM project WHERE portfolio_id = ?', [portfolio.id]);  
      portfolio.projects = projects;

      return portfolio;
    } catch (error) {
      console.error('Error fetching portfolio by email:', error);
      throw error;
    }
  }

  async updateUserPortfolioByEmail({
    name,
    email,
    profession,
    about,
    education,
    Gpa,
    address,
    number,
    experiences,
    projects,
    skills,
  }) {
    try {
   
      await db.execute(
        'UPDATE portfolio SET name=?, profession=?, about=?, education=?, Gpa=?, address=?, number=?, skills=? WHERE email=?',
        [name, profession, about, education, Gpa, address, number, skills, email]
      );

      const [portfolio] = await db.execute('SELECT * FROM portfolio WHERE email = ?', [email]);
      const portfolioId = portfolio[0].id;

    
      await db.execute('DELETE FROM experience WHERE portfolio_id = ?', [portfolioId]);
      await db.execute('DELETE FROM project WHERE portfolio_id = ?', [portfolioId]);
     
      await Promise.all(experiences.map(async (exp) => {
        await db.execute(
          'INSERT INTO experience (portfolio_id, companyName, designation, startDate, endDate, experienceDescription) VALUES (?, ?, ?, ?, ?, ?)',  
          [portfolioId, exp.companyName, exp.designation, exp.startDate, exp.isPresent ? null : exp.endDate, exp.experienceDescription]
        );
      }));

    
      await Promise.all(projects.map(async (project) => {
        await db.execute(
          'INSERT INTO project (portfolio_id, projectName, description) VALUES (?, ?, ?)',  
          [portfolioId, project.projectName, project.description]
        );
      }));


      return true;
    } catch (error) {
      console.error('Error updating portfolio by email:', error);
      throw error;
    }
  }
}

module.exports = {
  userPortfolioModel: new UserPortfolioModel(),
};
