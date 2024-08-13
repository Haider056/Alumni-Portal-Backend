const { userPortfolioModel } = require('../Models/UserPortfolioModel');

class UserPortfolioController {
  async getPortfolioByEmail(req, res) {
    try {
      const { email } = req.params;

      const portfolioInfo = await userPortfolioModel.getUserPortfolioByEmail(email);

      if (!portfolioInfo) {
        return res.status(404).json({ message: 'Portfolio not found' });
      }

      res.status(200).json({ portfolio: portfolioInfo });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async createOrUpdatePortfolio(req, res) {
    try {
      const {
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
      } = req.body;

      const existingPortfolio = await userPortfolioModel.getUserPortfolioByEmail(email);

      if (existingPortfolio) {
        await userPortfolioModel.updateUserPortfolioByEmail({
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
        });

        res.status(200).json({ message: 'Portfolio updated successfully' });
        console.log("Portfolio Updated Successfully");
      } else {
        await userPortfolioModel.createUser({
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
        });

        res.status(201).json({ message: 'Portfolio created successfully' });
        console.log("Portfolio Created Successfully");
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new UserPortfolioController();
