import config from 'config/mod.ts';
import { FileRepoClient } from 'common/mod.ts';

const fileRepoClient = new FileRepoClient(config.database.file);

export default fileRepoClient;
