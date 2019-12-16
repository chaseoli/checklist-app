// PURPOSE:
// The purpose of encrypt.ts is to store secrets in an
// encrypted format a storage bucket and a kms key from a separate project. 
// See README.md regarding the need for Separations of Duties for separate project for kms key.

// PREREQUISITES: 
// Before you run this code you must first have the following setup in gcloud 
// 1. setup two projects in gcloud, 
//    Project A. to manage keys
//    Project B. to store secrets and host infrastructure, and 
// see https://cloud.google.com/kms/docs/secret-management#secret_management_using_the_google_cloud_platform 
// 2. setup "key ring" in Project A
// 3. setup "key" on key ring in Project A
// 4. setup "storage bucket" in Project B  
// 5. from Project A create "service account" for admin api and give permissions to Project B to 
//      a) encrypt secrets and 
//      b) upload to storage bucket 
// 6. from Project A create "service account" for client api and give permissions to Project B to 
//      a) download from storage bucket and 
//      b) decrypt secrets

// DOCS
// https://cloud.google.com/kms/docs/reference/libraries#client-libraries-install-nodejs
// https://codelabs.developers.google.com/codelabs/cloud-encrypt-with-kms/#0
// https://cloud.google.com/kms/docs/secret-management
// https://github.com/googleapis/nodejs-kms#samples

import * as fs from 'fs';
import { promisify } from 'util';
import * as kms from '@google-cloud/kms';
import { Storage } from '@google-cloud/storage';
import { IKeyRing, ICryptoKeys } from './kms.models';

export class SyncEncryption {

  private projectId: string;
  private keyRingId: string;
  private cryptoKeyId: string;
  private locationId: string;
  private tempPath: string;

  /**
   * Creates an instance of SyncEncryption.
   * @param {string} keyRingId
   * @param {string} cryptoKeyId 
   * @param {string} [bucketName] gcloud storage bucket name (only required for file encryption, not text)
   * @param {string} [fileName] name of file to be stored in gcloud storage bucket (only required for file encryption, not text)
   * @memberof SyncEncryption
   */
  constructor(keyRingId: string, cryptoKeyId: string) {

    // Name of the crypto key's key ring
    this.keyRingId = keyRingId;
    // Name of the crypto key; e.g. "my-key"
    this.cryptoKeyId = cryptoKeyId;

    // Your GCP this.projectId
    this.projectId = process.env.gcloud_project_id;

    // The location of the crypto key's key ring, e.g. "global"
    this.locationId = process.env.gcloud_kms_location;

    // location where temporary files are downloaded to and uploaded from
    this.tempPath = '.encryption/';

    // check if directory exists otherwise create it
    if (!fs.existsSync(this.tempPath)) {
      fs.mkdirSync(this.tempPath);
    }

  }

  // /**
  //  * create a file locally even if path does not exist
  //  *
  //  * @private
  //  * @memberof SyncEncryption
  //  */
  // private async createFile(path: string, fileName: string, plainText: string): Promise<void> {

  //   const writeFile = promisify(fs.writeFile);
  //   await writeFile(path + fileName, plainText);
  //   return;

  // }

  /**
   * encrypts a file and uploads it to a gcloud storage bucket
   * so that the encrypted text can be later downloaded and
   * decrypted in the client application, see https://cloud.google.com/kms/docs/store-secrets
   *
   * @param {string} bucketName the name of the bucket in gcloud (NOTE: bucket must be previously created https://cloud.google.com/storage/docs/creating-buckets)
   * @param {string} fileName the name of the file to upload to the bucket
   * @param {string} plainText the secret text to include in the file to be uploaded
   * @returns {Promise<void>}
   * @memberof SyncEncryption
   */
  async encryptToBucket(bucketName: string, fileName: string, plaintext: string): Promise<{success: boolean, error: any}> {

    try {

      // create the path for the cipher file
      const cipherFileName: string = fileName + '.encrypted';
      const cipherFilePath: string = this.tempPath + cipherFileName;

      // create the file
      const encryptedText = await this.encryptText(plaintext)
      const writeFile = promisify(fs.writeFile);
      await writeFile(cipherFilePath, encryptedText.cipherText);

      // upload encrypted file to storage bucket
      await this.upload(bucketName, cipherFileName);

      // delete cipher file from disk after upload (clean up after upload)
      const removeFile = promisify(fs.unlink);
      await removeFile(cipherFilePath);

      return {success: true, error: null};

    } catch (error) {

      return {success: false, error: error};
    }

  }

  /**
   * downloads a encrypted file from gcloud bucket 
   * IMPORTANT: This endpoint is for testing locally,
   * but is intended to be copied over to an API to 
   * *retrieve* encrypted files
   *
   * @param {string} remoteFilename
   * @param {string} destFilename
   * @returns {Promise<string>}
   * @memberof SyncEncryption
   */
  async decryptFromBucket(bucketName: string, fileName: string): Promise<string> {

    // create the path for the cipher file
    const cipherFileName: string = fileName + '.encrypted';
    const ciphertextFilePath: string = this.tempPath + cipherFileName;

    // download file from 
    await this.download(bucketName, cipherFileName);

    // Reads the file to be encrypted
    const readFile = promisify(fs.readFile);
    const contentsBuffer = await readFile(ciphertextFilePath);
    const cipherText = contentsBuffer.toString();

    // decrypt text
    const decryptedText = await this.decryptText(cipherText);

    // delete downloaded cipher file from disk after upload
    const removeFile = promisify(fs.unlink);
    await removeFile(ciphertextFilePath);

    return decryptedText.plainText;

  }

  /**
   * encrypts plain text to base64 string
   *
   * @param {string} _plaintext
   * @returns {Promise<string>} cipher base64 string
   * @memberof SyncEncryption
   */
  async encryptText(_plaintext: string): Promise<{ cipherText: string, error: any }> {

    const client = new kms.KeyManagementServiceClient();

    try {

      // Reads the file to be encrypted
      let contentsBuffer = new Buffer(_plaintext);
      const plaintext = contentsBuffer.toString('base64');
      let name = client.cryptoKeyPath(
        this.projectId,
        this.locationId,
        this.keyRingId,
        this.cryptoKeyId
      );

      // Encrypts the file using the specified crypto key
      let [result] = await client.encrypt({ name, plaintext });

      const cipherText = Buffer.from(result.ciphertext, 'base64').toString('base64');

      // console.log(`Encrypted ${plaintext} using ${result.name} output cipher: ${cipherText}`);

      // cipher text in base64
      return { cipherText: cipherText, error: null };

    } catch (error) {

      // console.error('unable to encrypt text: ', error)

      return { cipherText: null, error: error };

    }

  }

  /**
   * decrypts cipher base64 text into plaintext
   *
   * @param {string} ciphertext text encrypted and converted into base64
   * @returns {Promise<string>} decrypted plaintext
   * @memberof SyncEncryption
   */
  async decryptText(ciphertext: string): Promise<{ plainText: string, error: any }> {

    const client = new kms.KeyManagementServiceClient();

    try {

      const name = client.cryptoKeyPath(
        this.projectId,
        this.locationId,
        this.keyRingId,
        this.cryptoKeyId
      );

      // Decrypts the file using the specified crypto key
      const [result] = await client.decrypt({ name, ciphertext });

      // Writes the decrypted file to disk 
      const secretText = Buffer.from(result.plaintext, 'base64').toString();

      // console.log(`Decrypted ${ciphertext} using ${result.name} output text: ${secretText}`);

      return { plainText: secretText, error: null };

    } catch (error) {

      // console.error('unable to decrypt text: ', error);

      return { plainText: null, error: error };

    }

  }

  /**
   * gets a gcloud kms keyring
   *
   * @returns {Promise<IKeyRing>}
   * @memberof SyncEncryption
   */
  async getKeyRing(): Promise<IKeyRing> {

    try {

      const client = new kms.KeyManagementServiceClient();

      // Get the keyring
      const name = client.keyRingPath(this.projectId, this.locationId, this.keyRingId);
      const [keyRing] = await client.getKeyRing({ name });
      // console.info(`Name: ${keyRing.name}`);
      // console.info(`Created: ${new Date(keyRing.createTime.seconds * 1000)}`);

      return keyRing;

    } catch (error) {

      // log error
      // console.error('unable to get key ring:', error);

      // console.info('trying to create key ring.')

      return await this.createKeyRing();

    }

  }

  /**
   * creates a gcloud kms keyring
   *
   * @private
   * @returns {Promise<IKeyRing>}
   * @memberof SyncEncryption
   */
  private async createKeyRing(): Promise<IKeyRing> {

    try {

      const client = new kms.KeyManagementServiceClient();

      // Creates a new key ring (because keyRingId doesn't exist)
      const parent = client.locationPath(this.projectId, this.locationId);
      const keyRingId = this.keyRingId;
      const [result] = await client.createKeyRing({ parent, keyRingId });

      // console.info(`New Key ring ${result.name} created.`);

      return result;

    } catch (error) {

      // console.error('unable to create key ring: ', error)
      return null;

    }

  }

  /**
   * gets a gcloud kms key
   *
   * @returns {Promise<ICryptoKeys>}
   * @memberof SyncEncryption
   */
  async getKey(): Promise<ICryptoKeys> {

    const keyRingId = this.keyRingId;
    const cryptoKeyId = this.cryptoKeyId;

    try {

      const client = new kms.KeyManagementServiceClient();

      const name = client.cryptoKeyPath(
        this.projectId,
        this.locationId,
        keyRingId,
        cryptoKeyId
      );

      // Gets a crypto key
      const [cryptoKey] = await client.getCryptoKey({ name });
      // console.info(`Name: ${cryptoKey.name}:`);
      // console.info(`Created: ${new Date(cryptoKey.createTime)}`);
      // console.info(`Purpose: ${cryptoKey.purpose}`);
      // console.info(`Primary: ${cryptoKey.primary.name}`);
      // console.info(`  State: ${cryptoKey.primary.state}`);
      // console.info(`  Created: ${new Date(cryptoKey.primary.createTime)}`);

      return cryptoKey;

    } catch (error) {

      // log error
      // console.error('unable to get key:', error);

      // console.info('trying to create key.')

      return await this.createKey();

    }

  }

  /**
   * creates a gcloud kms key
   *
   * @private
   * @returns {Promise<ICryptoKeys>}
   * @memberof SyncEncryption
   */
  private async createKey(): Promise<ICryptoKeys> {

    try {

      const client = new kms.KeyManagementServiceClient();

      const cryptoKeyId = this.cryptoKeyId;

      const parent = client.keyRingPath(this.projectId, this.locationId, this.keyRingId);

      // Creates a new key ring
      const [cryptoKey] = await client.createCryptoKey({
        parent,
        cryptoKeyId,
        cryptoKey: {
          // This will allow the API access to the key for encryption and decryption
          purpose: 'ENCRYPT_DECRYPT'
        },
      });

      // console.info(`Key ${cryptoKey.name} created.`);

      // this.keyExists = true;

      return cryptoKey;

    } catch (error) {

      // console.error('unable to create key: ', error);

      return null;

    }

  }

  /**
   * upload to gcloud storage bucket
   *
   * @param {string} bucketName Name of a bucket, e.g. my-bucket
   * @param {string} fileName Local file to upload, e.g. ./local/path/to/file.txt
   * @memberof SyncEncryption
   */
  private async upload(
    bucketName: string,
    fileName: string
  ) {

    // Creates a client
    const storage = new Storage();

    // // Deletes the file from the bucket
    // await storage
    //   .bucket(bucketName)
    //   .file(this.tempPath + fileName)
    //   .delete();

    // Uploads a local file to the bucket
    await storage.bucket(bucketName).upload(this.tempPath + fileName, {
      // Support for HTTP requests made with `Accept-Encoding: gzip`
      gzip: false,
      // By setting the option `destination`, you can change the name of the
      // object you are uploading to a bucket.
      // metadata: {
      //   // Enable long-lived HTTP caching headers
      //   // Use only if the contents of the file will never change
      //   // (If the contents will change, use cacheControl: 'no-cache')
      //   cacheControl: 'public, max-age=31536000',
      // },
    });

    // console.info(`${fileName} uploaded to ${bucketName}.`);

    return;

  }

  /**
   * download from gcloud storage bucket
   *
   * @param {string} bucketName Name of a bucket, e.g. my-bucket
   * @param {string} remoteFilename Remote file to download, e.g. file.txt
   * @param {string} destFilename Local destination for file, e.g. ./local/path/to/file.txt
   * @memberof SyncEncryption
   */
  private async download(
    bucketName: string,
    remoteFilename: string
  ) {

    // Creates a client
    const storage = new Storage();

    const options = {
      // The path to which the file should be downloaded, e.g. "./file.txt"
      destination: this.tempPath + remoteFilename,
    };

    // Downloads the file
    await storage
      .bucket(bucketName)
      .file(remoteFilename)
      .download(options);

    // console.info(`gs://${bucketName}/${remoteFilename} downloaded to ${this.tempPath}.`);

    return;

  }

}