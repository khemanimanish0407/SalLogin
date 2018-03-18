var service = require('./user-service');
module.exports = (app) => {
    app.post('/user/create', service.create);
};