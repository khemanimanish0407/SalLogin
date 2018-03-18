module.exports = (app) => {
    require('../middlewares/index')(app);
    require('../authenticate/index')(app);    
    require('../manage/user/index')(app);
    require('../testing/index')(app);
};