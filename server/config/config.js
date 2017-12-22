module.exports = {
    type: 'development',
    appPort: 3000,
    redis: {
      port: 6379,
      host: null,
      pass: null
    },
    // db: {
    //   admin: 'seanchen',
    //   password: 'SeanChen525',
    //   protocol: 'http',
    //   host: '127.0.0.1',
    //   port: '27017',
    //   name: 'MusicApp'
    // },
    tokbox: {
      secret: 'register the API KEY at',
      apiKey: 'https://tokbox.com/'
    },
    aws: {
      s3Bucket: 'BUCKETNAME',
      accessKey: 'AWESACCESSKEY',
      secret: 'AWSSECRET'
    },
    salt: 'PWMYSALT',
    sessionSecret: 'our session secret'
  };