const Photo = require('../models/photo.model');
const Voter = require('../models/voter.model');
const sanitize = require('mongo-sanitize');
const requestIp = require('request-ip');

/****** SUBMIT PHOTO ********/

exports.add = async (req, res) => {

  try {
    const { title, author, email } = req.fields;
    const file = req.files.file;

    if(title && author && email && file) { // if fields are not empty...

      const fileName = file.path.split('/').slice(-1)[0]; // cut only filename from full path, e.g. C:/test/abc.jpg -> abc.jpg
      const fileExt = fileName.split('.').slice(-1)[0];

      if(fileExt === "jpg" || fileExt === "png" || fileExt === "gif"){

        const newPhoto = new Photo({ title: sanitize(title), author: sanitize(author), email: sanitize(email), src: fileName, votes: 0 });
        await newPhoto.save(); // ...save new photo in DB
        res.json(newPhoto);

      } else {
        throw new Error('Wrong file extend!');
      }
      
    } else {
      throw new Error('Wrong input!');
    }

  } catch(err) {
    res.status(500).json(err);
  }

};

/****** LOAD ALL PHOTOS ********/

exports.loadAll = async (req, res) => {

  try {
    res.json(await Photo.find());
  } catch(err) {
    res.status(500).json(err);
  }

};

/****** VOTE FOR PHOTO ********/

exports.vote = async (req, res) => {

  try {
    const clientIp = requestIp.getClientIp(req);
    const photoToUpdate = await Photo.findOne({ _id: req.params.id });
    const checkUser = await Voter.findOne({user: clientIp});
    
    if(!checkUser){
      const newVoter = new Voter({user: clientIp, votes: photoToUpdate._id});
      await newVoter.save();

      photoToUpdate.votes++;
      photoToUpdate.save();
      res.send({ message: 'OK' });

    } else {
        const checkPhotoId = checkUser.votes.includes(photoToUpdate._id);
      
        if(!checkPhotoId){
  
          photoToUpdate.votes++;
          photoToUpdate.save();
          checkUser.votes.push(photoToUpdate._id);
          await checkUser.save();
          res.send({ message: 'OK' });
          
        } else res.status(500).json(err);
      }
    
  } catch(err) {
    res.status(500).json(err);
  }

};
