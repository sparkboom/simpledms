import config from 'config/mod.ts';
import DDFileClient from './file/DDFileClient.ts';

// Types
type RepositoryName = 'uploads' | 'documents';

// Client
const fileClient = new DDFileClient<RepositoryName>(config.database.file);

export default fileClient;
