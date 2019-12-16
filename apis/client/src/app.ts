import { RegisterRoutes } from './routes';
import { Config } from './config';

import './controller/test.controller';
import './controller/helper.controller';

class Main {

    public config: Config;

    constructor() {

        this.config = new Config();
        RegisterRoutes(this.config.app as any);

    }

}

new Main().config.start();
