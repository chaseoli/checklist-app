# IMPORTANT: DO NOT EDIT - THIS FILE IS GENERATED from ./travis-setup 

# Do not include secrets (configuration env vars only) 
# Secrets should be encrypted using travis cli, 
# see https://docs.travis-ci.com/user/environment-variables/#defining-encrypted-variables-in-travisyml 

export TS_NODE_PROJECT="apis/client/tsconfig.client-api.dev-tests.json" 
export gcloud_project_id="kms-only" 
export gcloud_kms_key_ring_name="dev-anchor-secrets-ring" 
export gcloud_kms_key_name="anchor-app-secrets-encrypt-key" 
export gcloud_kms_location="global" 
export gcloud_kms_key_version="1" 
export gcloud_bucket_name_secrets="dev-anchor-bucket-1" 
export GOOGLE_APPLICATION_CREDENTIALS=".credentials/dev/client-service-account.json" 
node apis/client/node_modules/mocha/bin/_mocha --require \
ts-node/register --timeout 999999 --colors apis/client/src/**/*.spec.ts