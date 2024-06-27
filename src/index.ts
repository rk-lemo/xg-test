import App from './app';

new App().initialize()
    .then(() => {
        console.info('App initialized');
    })
    .catch((err) => {
        console.error(err);
        process.exit(1);
    });
