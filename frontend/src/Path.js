const app_name = '' // change to heroku

exports.buildPath = function buildPath(route) {
    // if we're on the host environment then api calls go there,
    // otherwise api calls are to the localhost
    if(process.env.NODE_ENV == 'production') return 'https://weatherproject01.herokuapp.com/' + route;
    else return 'http://localhost:5000' + route;
}