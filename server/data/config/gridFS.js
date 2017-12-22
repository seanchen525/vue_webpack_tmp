(function(){

  module.exports = gridFS;

  gridFS['@singleton'] = false;
  gridFS['@require'] = ['q', 'mongodb', 'gridfs-stream', 'mongoose'];

  function gridFS(q, mongo, Grid, mongoose) {
  	//mongoose.connect('mongodb://localhost:27017/MusicApp');
  	//var mongoose = require('mongoose');

//mongoose.Promise = global.Promise;
//mongoose.connect('mongodb://localhost:27017/MusicApp');
    var defered = q.defer();
    Grid.mongo = mongoose.mongoose.mongo;
    // console.log('def');
    //console.log(mongoose.mongoose.connection.db);
    var conn = mongoose.mongoose.connection;
    conn.once('open',onDbopen);
    // console.log('In side gridFS function!!!!!');
    // console.log(defered.promise);
    return defered.promise;

    ////////////////

    function onDbopen(error) {
      if(error) {
      	// console.log(error);
        defered.reject(error);        
        return;
      }
      var grid = Grid(conn.db);
      //  console.log('grid:',grid);
      defered.resolve(grid);
    }
  }

})();