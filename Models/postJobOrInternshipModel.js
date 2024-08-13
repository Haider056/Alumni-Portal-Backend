const pool = require('../Src/Config/db');

class PostJoborInternshipModel {
  async createPostJobOrInternship({
    jobTitle,
    jobDescription,
    jobResponsibilities,
    jobRequirements,
    jobQualifications,
    jobType,
    jobLocations,
    jobSalary,
    postedBy,
    postedByEmail
  }) {
    const [result] = await pool.execute(
      'INSERT INTO postjoborinternship (jobTitle, jobDescription, jobResponsibilities, jobRequirements, jobQualifications, jobType, jobLocations, jobSalary, postedBy, postedByEmail) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [jobTitle, jobDescription, jobResponsibilities, jobRequirements, jobQualifications, jobType, jobLocations, jobSalary, postedBy, postedByEmail]
    );

    return result.insertId;
  }

  async getPostJobOrInternshipByEmail(email) {
    try {
      const [result] = await pool.execute(
        'SELECT * FROM postjoborinternship WHERE postedByEmail = ?',
        [email]
      );

      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error fetching post jobs or internships by email:', error);
      throw error;
    }
  }

  async getPostJobOrInternshipById(jobId) {
    try {
      const [result] = await pool.execute(
        'SELECT * FROM postjoborinternship WHERE id = ?',
        [jobId]
      );

      if (result.length === 0) {
        return null;
      }

      return result[0];
    } catch (error) {
      console.error('Error fetching post job or internship by ID:', error);
      throw error;
    }
  }



  async getAllPostJobOrInternships() {
    try {
      const [result] = await pool.execute('SELECT * FROM postjoborinternship');

      if (result.length === 0) {
        return null;
      }

      return result;
    } catch (error) {
      console.error('Error fetching all post jobs or internships:', error);
      throw error;
    }
  }
  async createApplication({ jobId, applicantEmail, portfolioId }) {
    const [result] = await pool.execute(
      'INSERT INTO applications (job_id, applicant_email, portfolio_id) VALUES (?, ?, ?)',
      [jobId, applicantEmail, portfolioId]
    );

    return result.insertId;
  }

  async getApplicationsByJobId(jobId) {
    try {
      const [result] = await pool.execute(
        'SELECT ' +
        '    a.id AS application_id, ' +
        '    a.applicant_email, ' +
        '    a.application_status, ' +
        '    a.applied_at, ' +
        '    p.id AS portfolio_id, ' +
        '    p.name, ' +
        '    p.email, ' +
        '    p.profession, ' +
        '    p.about, ' +
        '    p.education, ' +
        '    p.address, ' +
        '    p.number, ' +
        '    p.experience, ' +
        '    p.companyName, ' +
        '    p.designation, ' +
        '    p.startDate, ' +
        '    p.endDate, ' +
        '    p.experienceDescription, ' +
        '    p.skills ' +
        'FROM applications a ' +
        'LEFT JOIN portfolio p ON a.portfolio_id = p.id ' +
        'WHERE a.job_id = ?',
        [jobId]
    );
    

      return result;
    } catch (error) {
      console.error('Error fetching applications by job ID:', error);
      throw error;
    }
  }
  async DeleteJob({id}){
    const [result] = await pool.execute(`DELETE FROM postjoborinternship WHERE id = ?`, [id]);
    return result.affectedRows > 0;
  }
}




module.exports = {
  postJoborInternshipModel: new PostJoborInternshipModel(),
};
