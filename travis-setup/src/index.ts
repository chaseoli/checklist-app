import { exec } from 'child_process';
import * as fs from 'fs';
import * as _ from 'lodash';
class main {

    // to be inserted into .travis.yml see .travis.yml 
    travisBeforeInstallScript: string;

    // array of secret file paths to include in the .tar 
    secretFilePathsArr = [
        '.credentials/dev/admin-service-account.json',
        '.credentials/dev/client-service-account.json'
    ];

    // encrypt env vars in travis 
    envArr: { name: string, val: string, valBase64: string }[] = [
        {
            name: 'some-name',
            val: '',
            valBase64: '' // to be dynamically set in base64
        }
    ];

    constructor() {
        this.travisBeforeInstallScript = '';
        this.start();
    }

    async start() {

        this.setTravisEncryptedFiles();
        // await this.setTravisEncryptedEnvVars();
        this.generateTestScripts();

        // console.log('travis setup has completed successfully! And is shutting down...');
        // process.exit();

    }

    setTravisEncryptedFiles() {

        // delete existing .enc file
        if (fs.existsSync('secrets.tar.enc')) {
            fs.unlinkSync('secrets.tar.enc');
        }

        // create the .tar file
        let tarCmd = 'tar cvf secrets.tar'
        for (let i = 0; i < this.secretFilePathsArr.length; i++) {
            // append the secret file paths to end of the cmd
            tarCmd = tarCmd + ' ' + this.secretFilePathsArr[i]
        }

        // create the secrets.tar file
        const zipScript = exec(tarCmd);

        zipScript.stdout.on('data', (data) => {
            console.log('zip output: ', data);
        });

        // log out error info
        zipScript.stderr.on('data', (data) => {
            console.error('zip error: ', { data: data });
        });

        // script competed
        zipScript.once('exit', (code: number, signal: string) => {
            console.log('zip exit ', { code: code, signal: signal });

            // create the secrets.tar file
            const encryptScript = exec('travis encrypt-file secrets.tar');

            encryptScript.stdout.on('data', (data: string) => {
                console.log('travis encrypt-file output: ', data);
                const start = 'openssl';
                const end = '-d';
                this.travisBeforeInstallScript = data.match(new RegExp(start + "(.*)" + end))[0];

                console.log('before install script: ', this.travisBeforeInstallScript);

            });

            // log out error info
            encryptScript.stderr.on('data', (data) => {
                console.error('travis encrypt-file error: ', { data: data });
            });

            // script competed
            encryptScript.once('exit', (code: number, signal: string) => {

                console.log('travis encrypt-file exit ', { code: code, signal: signal });

                this.updateTravisFile();

            });

        });

    }

    generateTestScripts() {

        const header = '# IMPORTANT: DO NOT EDIT - THIS FILE IS GENERATED from ./travis-setup \n\n# Do not include secrets (configuration env vars only) \n# Secrets should be encrypted using travis cli, \n# see https://docs.travis-ci.com/user/environment-variables/#defining-encrypted-variables-in-travisyml \n';

        // get env vars from launch.json
        let launchJsonTxt = fs.readFileSync('.vscode/launch.json', "utf8") as string;
        launchJsonTxt = launchJsonTxt.replace(/(\/\/ (.*)$)/gm, '');

        // Remove comments from launch.json to parse it
        // IMPORTANT: not that to parse the launch.json properly  
        //      1) all comments must be have a space after '//'
        //      2) redundant commas ',' after a line will fail to parse json properly 
        // NOTE: a quick way to check the JSON output for proper formatting is to copy the  
        // launchJsonObj output via the "Debug Console" and past it into a postman json body
        // and look for formatting errors 
        const launchJsonObj = JSON.parse(launchJsonTxt);

        // create test files
        _.forEach(launchJsonObj.configurations, (launchConfig) => {

            if (launchConfig.travis) {

                // create env vars
                let envVars = ''
                _.forEach(launchConfig.env, (val, key) => {
                    envVars = envVars + 'export ' + key + '=\"' + val + '\" \n'
                });

                // create mocha test
                const testCmd = 'node ' + launchConfig.travis.path + '/node_modules/mocha/bin/_mocha --require \\\n' +
                    'ts-node/register --timeout 999999 --colors ' + launchConfig.travis.path + '/src/**/*.spec.ts'

                // write new .travis.yml
                fs.writeFileSync(launchConfig.travis.path + '/test.sh', header + '\n' + envVars + testCmd);

            }

        });

    }

    updateTravisFile() {

        const header = '# IMPORTANT: DO NOT EDIT - THIS FILE IS GENERATED form ./travis-setup/travis-template.yml\n# Please update .travis.yml for global updates and ./travis-setup \n# for updates related to encrypting files';
        let travisText = fs.readFileSync('travis-setup/travis-template.yml', "utf8") as string;

        // update header for user viewing
        travisText = travisText.replace('{{{header}}}', header);

        // for first job: 
        travisText = travisText.replace('{{{decrypt-files}}}', this.travisBeforeInstallScript);

        // for second job
        travisText = travisText.replace('{{{decrypt-files}}}', this.travisBeforeInstallScript);

        // delete existing .travis.yml file
        if (fs.existsSync('.travis.yml')) {
            fs.unlinkSync('.travis.yml');
        }

        // write new .travis.yml
        fs.writeFileSync('.travis.yml', travisText);

    }

    /**
     * Loops env vars to encrypt for use in travis 
     *
     * @returns
     * @memberof main
     */
    async setTravisEncryptedEnvVars() {

        const promArr = [];

        // // create base64 vals from files
        // for (let i = 0; i < this.envArr.length; i++) {
        //     if (this.envArr[i].path) {
        //         this.envArr[i].val = this.JsonFileToBase64Text(this.envArr[i].path);
        //     }
        // }

        for (let i = 0; i < this.envArr.length; i++) {

            this.envArr[i].valBase64 = Buffer.from(this.envArr[i].val).toString('base64');

        }

        // create an array of promises for encrypting via travis
        for (let i = 0; i < this.envArr.length; i++) {
            promArr.push(this.encryptTravisEnvVars(this.envArr[i].name, this.envArr[i].val));
        }

        await Promise.all(promArr).then((data) => {
            console.log('promise success: ', data);
        }).catch((error) => {
            console.log('promise errors: ', error);
        });

        return;

    }

    /**
     * Converts contents of a json file to base64 text
     *
     * @param {string} path
     * @returns {string}
     * @memberof main
     */
    JsonFileToBase64Text(path: string): string {

        // encode base64
        const text = fs.readFileSync(path, "utf8") as string;
        const base64txt = Buffer.from(text).toString('base64');

        // // decode base64
        // const decodedStr = Buffer.from(base64txt, 'base64').toString('utf8');
        // const obj = JSON.parse(decodedStr);
        // console.log(obj);        

        return base64txt;
    }

    /**
     * Encrypts environment variables for use by travis. Travis-cli must be installed. 
     *
     * @param {string} secretEnvName
     * @param {string} secretEnvVal
     * @returns
     * @memberof main
     */
    encryptTravisEnvVars(secretEnvName: string, secretEnvVal: string) {

        return new Promise((resolve, reject) => {

            const script = exec(`travis encrypt --com ${secretEnvName}=${secretEnvVal}`);

            script.stdout.on('data', (data) => {
                console.log('travis encrypt output: ', data);
            });

            // log out error info
            script.stderr.on('data', (data) => {

                console.error('travis encrypt error: ', { data: data });

                reject();

            });

            // script competed
            script.once('exit', (code: number, signal: string) => {

                console.log('travis encrypt exit ', { code: code, signal: signal });

                resolve();

            });

        });

    }

}

new main();