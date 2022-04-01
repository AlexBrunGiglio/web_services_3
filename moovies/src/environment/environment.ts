import * as EnvironmentJsonFile from './env.json';

export interface IEnvironment {
    db_host: string;
    db_port: number;
    db_user: string;
    db_password: string;
    db_name: string;
    db_log_enabled: boolean;
    ApiScheme: 'http' | 'https';
    EnvName: 'development' | 'val' | 'production';
}

const EnvironmentData: IEnvironment = {
    db_host: EnvironmentJsonFile.db_host,
    db_port: EnvironmentJsonFile.db_port,
    db_user: EnvironmentJsonFile.db_user,
    db_password: EnvironmentJsonFile.db_password,
    db_name: EnvironmentJsonFile.db_name,
    db_log_enabled: EnvironmentJsonFile.db_log_enabled,
    ApiScheme: EnvironmentJsonFile.ApiScheme as ('http' | 'https'),
    EnvName: EnvironmentJsonFile.EnvName as 'development' | 'val' | 'production',
}

export const Environment = EnvironmentData;
