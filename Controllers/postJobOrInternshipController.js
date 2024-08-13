const { postJoborInternshipModel } = require('../Models/postJobOrInternshipModel');
const pool = require('../Src/Config/db');
class PostJoborInternshipController {
  async createPostJobOrInternship(req, res) {
    try {
        const {
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
        } = req.body;
   
        await postJoborInternshipModel.createPostJobOrInternship({
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
        });

        res.status(201).json({ message: 'Job or Internship posted successfully' });
        console.log("Job or Internship Posted Successfully");
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal Server Error' });
    }
}

async getAllPostJobOrInternships(req, res) {
  try {
  
    const allPostJobsOrInternships = await postJoborInternshipModel.getAllPostJobOrInternships();

    if (!allPostJobsOrInternships || allPostJobsOrInternships.length === 0) {
      return res.status(404).json({ message: 'No jobs or internships found in the database' });
    }

    res.status(200).json({ allPostJobsOrInternships });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}

async getPostJobOrInternshipById(req, res) {
  try {
    const { jobId } = req.params;

    const postJobOrInternship = await postJoborInternshipModel.getPostJobOrInternshipById(jobId);

    if (!postJobOrInternship) {
      return res.status(404).json({ message: 'Job or internship not found' });
    }

    res.status(200).json({ postJobOrInternship });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal Server Error' });
  }
}



async getPostJobOrInternshipByEmail(req, res) {
    try {
      const { email } = req.params;

     
      const postJobsOrInternships = await postJoborInternshipModel.getPostJobOrInternshipByEmail(email);

      if (!postJobsOrInternships) {
        return res.status(404).json({ message: 'Post jobs or internships not found' });
      }

      
      res.status(200).json({ postJobsOrInternships });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createApplication({ jobId, applicantEmail }) {
    try {
     

            if (!jobId || !applicantEmail) {
            throw new Error('jobId or applicantEmail is undefined');
        }

      
        const [portfolioResult] = await pool.execute(
            'SELECT id FROM portfolio WHERE email = ?',
            [applicantEmail]
        );

        if (portfolioResult.length === 0) {
            throw new Error('Portfolio not found for the applicant');
        }

        const portfolioId = portfolioResult[0].id;

      
        const [result] = await pool.execute(
            'INSERT INTO applications (job_id, applicant_email, portfolio_id) VALUES (?, ?, ?)',
            [jobId, applicantEmail, portfolioId]
        );

        return result.insertId;
    } catch (error) {
        console.error('Error creating application:', error);
        throw error;
    }
}





  async getApplicationsByJobId(req, res) {
    try {
      const { jobId } = req.params;

      const applications = await postJoborInternshipModel.getApplicationsByJobId(jobId);

      if (!applications || applications.length === 0) {
        return res.status(404).json({ message: 'No applications found for this job' });
      }

      res.status(200).json({ applications });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async DeleteJob(jobid,res){
    try{

      await postJoborInternshipModel.DeleteJob({
        id:jobid
      });
      res.status(201).json({ message: 'Job Deleted successfully' });
      console.log('Job Deleted Successfully');
    }
    catch(error){
      console.error(error);
      res.status(500).json({message :'Internal server error'})
    }
  }

}

module.exports = new PostJoborInternshipController();
