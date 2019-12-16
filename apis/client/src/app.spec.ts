import { expect } from 'chai';
import { SyncEncryption } from '../../admin/src/gcloud-kms/kms';
// import { auth } from 'google-auth-library';

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

        describe('\'client\' from .functions/src', async () => {

            // // TODO: change gcloud service account credentials to client credentials
            // // https://github.com/googleapis/google-auth-library-nodejs

            // // const keysEnvVar = process.env['CREDS'];
            // // if (!keysEnvVar) {
            // //     throw new Error('The $CREDS environment variable was not found!');
            // // }
            // // const keys = JSON.parse(keysEnvVar);
            // const keys = {
            //     type: "service_account",
            //     project_id: "kms-only",
            //     private_key_id: "5e0e3d10e265665a74a60a1be111c05f069ddaeb",
            //     private_key: "-----BEGIN PRIVATE KEY-----\nMIIEvAIBADANBgkqhkiG9w0BAQEFAASCBKYwggSiAgEAAoIBAQCf4PIVt3kXlFWG\n9X4pHIWPDzvXf6zLR9g/VZ2RmaIlbWGKHX7ayBMi6pWXjcN0L/AHvqPKStDU8Ld6\nx2UvKJSKl62eNCVLQN+lalWfEE4a42WRhVLBAx7jf+k/4F+v55lBJrsUT8GpFx0D\nZBcYeGV9Hl/YRn/LqOyY9tRpWvlkP2fFerCaMKny0Qlipb7Q3BeTSHfCWvTgIy4q\n5AouTRSFeZHiq2el6Eoski/zgl9tfgVST2y8dWUvAmTUZruiPIFzfCpRE3pDjQ20\n0EsGV8+FnInrT3kM4SG+BgpgitZYcBuRbBYfbiKqPGaEGnTa7oer/hjjInz9oTyV\noLtEZXTFAgMBAAECggEABiBRPm5JnFLxhQqeozYl0wHHLf6FMUPnQCQIdeYQbcU3\nddqj+/+rJg0dntFOkkLs/Gr8bTm5L1OrADAoSyqPqJDf1P5UCIJrn3PH5KC0EXkx\nsOYOMfmr4xVJa4puODgUagfxJrnYpqFNWg4piWVBpE3357pp1rS6HjFlGcVj5Yit\n5RBjgjazLo1gR261Z6aKaGHhoUiattznXHtstC7jJKb3f5D7BNwTFTVYalZokry3\nr9F5AQ7fe5NddVjDmIhTgHOKLJC39OGcvknKLNvUGcKpqH3dR0Z76bAxgIsGTycN\nZfWp6qnIMYVcD59WDCNu/JwxmaVysLQlM+vlP/pNwQKBgQDaiybLEookGS7ZxpT9\no1TeO1YKuCVqrDmG6WaWQbNsj2HcvN217f0MQRIYXJ0zCaTGdoYnMd80Ow0EJIpr\nt+aFUS/vuHReaneHCg4E9MBkJDHg68x31QjP6BNvzc6Dg6L/8/0GfMrIDE07z/Lc\nW4HK33l9fMgJEG5o58L9J0MwwQKBgQC7R85YnHNibOG88fpLCtKhDRe1roO6oNMt\njLGNJMk6uipY9sJ/Waoogkdf7HEfU6LEBALi9gUS3Cu1ewHBhi/A4LhGGtZBvAYY\nP9GyMBJQVOBil4eDfB5votA0Z2hqXJNaW82Fs3ArKGqB5A1UGQbVnf0oGFZ+aToT\nANyhGVTBBQKBgF2SDr4L5hGmpqSfndMrR38PMLvONFcD/m2BKWdUIhptGZ2FT/hB\nOYMxqSm9HaFok6BVxwKpG8QlNGF9s7aDOrQCGuAsvcZfF2Y+K9p7YJR/2stOqnD0\nSZ2a5BeOqsksZ3HnaYKJk9krSzY8xuMKWvwdysqrzony+xL3iEkTsnUBAoGAV8Zj\n0+wfuDXH50KSSLGd3pXAUwqj+sh9sY+Ld9eR6NBwIJomtoFT2wCUa0TqEACm/K/U\nmoMsBZbjdX9dZ1J49zFbrJ/PY6e4Q41FvvoA212sfQkAHoQBz9jDNIxyx8bz2RnF\nzbA4FkIvCQnVpWDFb0FI8Y3WnBC9g0KYJXk12/ECgYBGCdskUHKmll71+sTSsS3n\njrq7svg6bFbkCoBRJbyV3vxeedKQhZ2IU8x61cwmolFLEzq/lENCog1fSCoW52/x\nEBVUr88atn6AeGv069G4Ku0DaIGhX0JLkkiylruOIP9oQ38c71rOrYQGwGzdjm0E\n2WPWm70B+onxDnb12XJ+tg==\n-----END PRIVATE KEY-----\n",
            //     client_email: "dev-kms-decrypt@kms-only.iam.gserviceaccount.com",
            //     client_id: "103565374283570669373",
            //     auth_uri: "https://accounts.google.com/o/oauth2/auth",
            //     token_uri: "https://oauth2.googleapis.com/token",
            //     auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
            //     client_x509_cert_url: "https://www.googleapis.com/robot/v1/metadata/x509/dev-kms-decrypt%40kms-only.iam.gserviceaccount.com"
            // };

            // // load the JWT or UserRefreshClient from the keys
            // const client = auth.fromJSON(keys) as any;
            // client.scopes = ['https://www.googleapis.com/auth/cloud-platform'];
            // // const url = `https://www.googleapis.com/dns/v1/projects/${keys.project_id}`;
            // // const res = await client.request({ url });
            // // console.log(res.data);

            it('client credential must not be able to encrypt text', async () => {
                const res = await kms.encryptText(secretText);
                expect(res.error.code).to.equal(7);
            });

            it('client credential must not be able to upload to storage bucket file', async () => {
                const res = await kms.encryptToBucket(
                    bucketName,
                    fileName,
                    secretText
                );
                expect(res.error.code).to.equal(403);
            });

            it('client credential must be able to decrypt from storage bucket file', async () => {
                const decryptedText = await kms.decryptFromBucket(
                    bucketName,
                    fileName
                );
                expect(decryptedText).to.equal(secretText);
            });

        });

    });

});
