const fs = require('fs-extra');
const spawn = require('child_process').spawn;

/*
* Camera module.
*/
class Camera {

  constructor() {
    this.imagesDir = './images';
    this.imagesLimit = 6;
    this.imageQuality = 5;
    this.cameraDelay = 1;
    this.imageCmd = 'raspistill -t ' + this.cameraDelay + ' -q ' + this.imageQuality + ' -o ';
    this.images = [];
    this.takingPicture = false;
  }

	/*
	* Get Camera module state. Images list, takingPicture status.
	*/
  get state() {
    return {
      images: this.images,
      takingPicture: this.takingPicture,
    };
  }

	/*
	* Read image files from their directory
	*/
  readImages() {
    return new Promise((res, rej) => fs.readdir(this.imagesDir, (err, fileNames) => {
      if (err) {
        console.log('Camera readImages error: ', err);
        return rej();
      }
      if (fileNames.length < 1) {
        return res(this.images);
      }

      fileNames = fileNames.reverse();
      if (fileNames.length > this.imagesLimit) fileNames.length = this.imagesLimit;

      fileNames.forEach(file => fs.readFile(this.imagesDir + '/' + file, (err, content) => {
        if (err) {
          console.log('Camera readImages readFile error: ' + file);
          return rej();
        }
        this.images.push(content.toString('base64'));
        if (this.images.length === fileNames.length) {
          res(this.images);
        }
      }));
    }));
  }

	/*
	* Take picture, save file and return its content
	*/
  takePicture() {
    return new Promise((res, rej) => {
      if (this.takingPicture) {
        return rej();
      }

      const exec = require('child_process').exec;
      const imagePath = this.imagesDir + '/' + Date.now() + '.jpeg';
      this.takingPicture = true;

      exec(this.imageCmd + imagePath, (err, stdOut, stdErr) => {
        if (err) {
          console.log('Camera takePicture error: ', err);
          this.takingPicture = false;
          return rej();
        }

        fs.readFile(imagePath, (err, content) => {
          if (err) {
            console.log('Camera takePicture readFile error: ', err);
            this.takingPicture = false;
            return rej();
          }

          this.images.unshift(content.toString('base64'));
          if (this.images.length > this.imagesLimit) {
            this.images.length = this.imagesLimit;
          }
          this.takingPicture = false;

          return res(this.images);
        });
      });
    });
  }

	/*
	* Delete picture
	*/
  deletePictures() {
    return new Promise((res, rej) => fs.emptyDir(this.imagesDir, err => {
      if (err) {
        console.log('Camera deletePictures error: ', err);
        this.takingPicture = false;
        return rej();
      }
      this.images = [];
      return res(this.images);
    }));
  }
}

module.exports = Camera;
