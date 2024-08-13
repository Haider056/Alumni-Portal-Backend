const { NewsModel } = require('../Models/AdminNewsModel');

const newsModel = new NewsModel(); 
const multer = require('multer');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
   
    cb(null, '../public/images');
  },
  filename: function (req, file, cb) {
    const originalname = file.originalname.replace(/[^a-zA-Z0-9.]/g, ''); 
    cb(null, Date.now() + '-' + originalname); 
  }
});

const fileFilter = function (req, file, cb) {
  if (file.mimetype.startsWith('image/')) {
    cb(null, true);
  } else {
    cb(new Error('Only image files are allowed'), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });


class NewsController {
  async createNews(req, res) {
    try {

      upload.single('newsImage')(req, res, async function(err) {
        if (err instanceof multer.MulterError) {
          return res.status(400).json({ message: 'Error uploading image', error: err.message });
        } else if (err) {
          return res.status(400).json({ message: 'Error uploading image', error: err.message });
        }

     
        const { newsTitle, newsDescription } = req.body;
        const newsImageURL = req.file ? '/images/' + req.file.filename : null;

       
        await newsModel.createNews({ newsTitle, newsDescription, newsImageURL });

        res.status(201).json({ message: 'News posted successfully', imageURL: newsImageURL });
      });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  async getAllNews(req, res) {
    try {
      const newsModel = new NewsModel();
      const news = await newsModel.getAllNews();

      if (!news || news.length === 0) {
        return res.status(404).json({ message: 'No news found' });
      }

      res.status(200).json({ news });
    } catch (error) {
      console.error('Error fetching all news:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
 
  async getNewsId(req, res) {
    try {
      const { newsId } = req.params;
  
      const newsID = await newsModel.getNewsId(newsId);
  
      if (!newsID) {
        return res.status(404).json({ message: 'News not found' });
      }
  
      res.status(200).json({ newsID });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
  async deleteNews(req, res) {
    try {
      const { newsId } = req.params;
      const result = await newsModel.deleteNews(newsId);
      if (result.affectedRows > 0) {
        res.status(200).json({ message: 'News deleted successfully' });
      } else {
        res.status(404).json({ message: 'News not found' });
      }
    } catch (error) {
      console.error('Error deleting news:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

module.exports = new NewsController();
