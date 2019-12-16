import { AppOptions, credential } from 'firebase-admin';

// adds typing to process.env.xxx, see usage in config.ts
export declare var process: {
   env: IEnvVars;
   exit();
}

// for env var types only
export interface IEnvVars {
   build: 'dev' | 'prod';
   portal_url: string;
   port?: string;

   // firebase database url from console
   firebase_database_url: string;

   // Prod/CD firebase cred = base 64 cred used for deployment to cloud
   // base64 representation of the firebase service account .json
   // This is base64 so that it is easy to decipher and so that 
   // the ui 
   // helper endpoint to encode fb cred to base 64
   // e.g.: see helper controller POST : {{root}}/util/base64/encode-fb-cred
   firebase_service_account_base64: string;


   // Dev firebase cred = used to develop locally
   // url to the firebase services account .json file 
   GOOGLE_APPLICATION_CREDENTIALS: string;

}

export interface ISecrets  {
   some_secret_to_use_gcloud_kms_for: string;
}