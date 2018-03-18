var service = require('./testing-service');
module.exports = (app) => {
  
    
    app.get('/user/get', service.get);
};