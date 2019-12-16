import { expect } from 'chai';
import { SyncEncryption } from './gcloud-kms/kms';
// import { auth } from 'google-auth-library';

if (process.env.travis_build) {

    // NOTE: to rotate travis secrets see .travis-secrets.sh

    // if travis build, then get the encrypted travis env var stored as base64
    // const cred = '';

    // convert base64 to json
    

    // write to file in ./credentials/dev

}

// Test Example
describe('run all test', () => {

    // it('must expect result to be true', () => {
    //     let val = false;
    //     val = true;
    //     // with mocha
    //     expect(val).to.equal(true);
    // });

    describe('env var and secret management', () => {

        // init google kms
        const kms = new SyncEncryption(
            process.env.gcloud_kms_key_ring_name,
            process.env.gcloud_kms_key_name
        );

        const secretText = 'super duper secret message!';
        const fileName = 'test-secrets.txt';
        const bucketName = process.env.gcloud_bucket_name_secrets;

        describe('\'admin\' from .functions/env', () => {

            // it('must have gcloud service account credential', () => {

            //     // check if env var is set for gcloud service account credential 
            //     // (Development ONLY environment)
            //     expect(process.env.GOOGLE_APPLICATION_CREDENTIALS).not.to.be.empty

            // });

            it('must must get specified keyring', async () => {
                const ring = await kms.getKeyRing();
                expect(ring.name).to.be.a('string');
            });

            it('must get specified key on keyring', async () => {
                const key = await kms.getKey();
                expect(key.name).to.be.a('string');
            });

            it('must synchronously encrypt and decrypt from storage bucket file', async () => {

                await kms.encryptToBucket(
                    bucketName,
                    fileName,
                    secretText
                );

                const decryptedText = await kms.decryptFromBucket(
                    bucketName,
                    fileName
                );

                expect(decryptedText).to.equal(secretText);

            });

            it('must synchronously encrypt and decrypt text', async () => {

                // convert plain text to base 64 cipher
                const r = await kms.encryptText(secretText);

                // decrypt cipher back to plain text 
                const decryptedText = await kms.decryptText(r.cipherText);

                expect(decryptedText.plainText).to.be.equal(secretText);

            });

            // note that admin credential need not be tested because
            // the admin credential is only ever to be used locally

        });

    });

});
