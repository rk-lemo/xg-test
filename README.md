To run the project you need to have installed the following dependencies:
- [Node.js](https://nodejs.org/en/)
- [TypeScript](https://www.typescriptlang.org/)


Don't forget to run npm install to install the project dependencies ``npm i``.
To run the application use the following command:
- ``npm run build`` : creates a build from the TypeScript files and places it inside the ``dist`` dir.
- ``npm run start`` : runs the application using the js build files.

The application will be available at http://localhost:3000 as default port.
There are 3 routes available:
- ``/:planet/average``: To display the average of the planet's using the local storage.
- ``/:planet/average-db``: To display the average of the planet's using the MongoDB.
- ``/data``: To display all available samples in the local storage.

