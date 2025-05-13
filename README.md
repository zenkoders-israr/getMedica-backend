NEST Js CLI Commands :

-   nest g module moduleName
-   nest g controller controllerName 
-   nest g service serviceName
-   nest g class helpers/user-helper

To skip creating spec files add --no-spec with the above commands

Local Setup :

To start this project first setup the postgres database on your local machine.

Run Following commands to run the project :

-   yarn install
-   npm run start:dev

Migrations :

-   Create Migration : npx typeorm migration:create ./src/app/migrations/migrationName
-   Run Migration : npm run migration:run