import { SyncEncryption } from './gcloud-kms/kms';
// import { ISecrets } from './../../src/env.d';

class main {

    // secrets: ISecrets;

    constructor() {
        this.start();
    }

    async start() {

        if (process.env.build === 'prod') {
            // TODO...
        } else if (process.env.build === 'dev') {
            // TODO...
        } else {
            console.error('Please provide a env.build (\'prod | dev\') in the launch.json');
        }

        const kms = new SyncEncryption(
            process.env.gcloud_kms_key_ring_name,
            process.env.gcloud_kms_key_name
        );

        const fileName = 'dev-secrets.txt';

        await kms.encryptToBucket(
            process.env.gcloud_bucket_name_secrets,
            fileName,
            'super duper secret message!'
        );

        await kms.decryptFromBucket(
            process.env.gcloud_bucket_name_secrets,
            fileName
        );

        // const encryptedText = await kms.encryptText('hello chase, sup?');
        // const decryptedText = await kms.decryptText(encryptedText);
        // console.info('Your decrypted text: ', decryptedText);

        // terminate nodejs app
        console.log('admin app has completed successfully! And is shutting down...');
        process.exit();

    }

}

new main();