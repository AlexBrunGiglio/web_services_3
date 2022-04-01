import * as path from 'path';
import * as fs from 'fs';
import * as child_process from 'child_process';

const apiSwaggerUrl = 'http://localhost:3080/api/docs/swagger.json';
const swaggerCodegenConfig = path.join(__dirname, 'swagger-codegen-config.json');
const swaggerFrontOutput = path.join(__dirname, '..', '..', 'front', 'src', 'providers', 'api-client.generated');

if (!fs.existsSync(swaggerCodegenConfig)) {
    console.error(`Impossible de générer le code client : le fichier de configuration ${swaggerCodegenConfig} n'existe pas !`);
    process.exit(1);
}

const exec = child_process.exec;
exec(`npx openapi-generator-cli generate -i "${apiSwaggerUrl}" -g typescript-angular -c "${swaggerCodegenConfig}" -o "${swaggerFrontOutput}" --type-mappings DateTime=Date`, function (err: any) {
    if (err) {
        console.log(err);
        return;
    }
    console.log('\x1b[34m', `Code client généré avec succès !`);
});