var userRoutes = require('./user');
var audioRoutes = require('./audio');
var projectRoutes = require('./project');

module.exports = function(app, auth){
    app.use("/user", userRoutes);
    app.use("/project", projectRoutes);
    app.use("/audio", audioRoutes);
    // app.use('*', function(req, res){
    //     res.render('index');
    // });
};
