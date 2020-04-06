import AWS from "aws-sdk";
import {S3_BUCKET_NAME, S3_POOL_ID, S3_REGION} from "../config";

/**
 * Configure AWS SDK with S3 Bucket details and Pool ID
 */

AWS.config.update({
  region: S3_REGION,
  credentials: new AWS.CognitoIdentityCredentials({
    IdentityPoolId: S3_POOL_ID
  })
});

const s3 = new AWS.S3({
  apiVersion: "2006-03-01",
  params: { Bucket: S3_BUCKET_NAME }
});

/**
 * Function to return the YYYYMMDD string format for a date
 *
 * @param date
 * @returns {string}
 */

function yyyymmdd(date) {
  const mm = date.getMonth() + 1; // getMonth() is zero-based
  const dd = date.getDate();

  return [date.getFullYear(),
    (mm>9 ? '' : '0') + mm,
    (dd>9 ? '' : '0') + dd
  ].join('');
}

/**
 * Function that creates a random string of given length with Capital Letters
 * and numbers. Useful for making unique file names for photo uploads.
 *
 * @param length
 * @returns {string}
 */

function makeid(length) {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const charactersLength = characters.length;
  let result = '';
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

/**
 * Uploads the given file to the to the specified S3 album
 *
 * @param albumName
 * @param file
 * @param phoneNumber
 * @returns {Promise<ManagedUpload.SendData>}
 */

export function addPhoto(albumName, file, phoneNumber) {
  let extenstion = file.name.split('.');
  extenstion = extenstion[extenstion.length - 1];
  const albumPhotosKey = encodeURIComponent(albumName);
  const photoKey = `${albumPhotosKey}/${phoneNumber}_${makeid(6)}.${extenstion}`;

  // Use S3 ManagedUpload class as it supports multipart uploads
  const upload = new AWS.S3.ManagedUpload({
    params: {
      Bucket: S3_BUCKET_NAME,
      Key: photoKey,
      Body: file,
      ACL: "public-read"
    }
  });

  return upload.promise();
}

/**
 * Creates a new album with current date in YYYYMMDD format on the S3 bucket.
 * This also checks if it needs to be created, and only creates it when needed.
 *
 * @returns {Promise<string>} The name of the album
 */

export function createAlbum() {
  const albumName = yyyymmdd(new Date());
  const albumKey = encodeURIComponent(albumName) + "/";
  return new Promise((resolve, reject) => {
    s3.headObject({Key: albumKey}, function(err, data) {
      if (!err) {
        // Album already exists
        resolve(albumName);
      }
      if (err && err.code !== "NotFound") {
        reject("There was an error creating your album: " + err.message);
      }
      s3.putObject({Key: albumKey}, function(err, data) {
        if (err) {
          reject("There was an error creating your album: " + err.message);
        }
        resolve(albumName);
      });
    });
  });
}

