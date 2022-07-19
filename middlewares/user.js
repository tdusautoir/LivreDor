module.exports = function (request, response, next) {
  if (request.session.user) {
    response.locals.user = request.session.user;
  }
  request.user = function (username) {
    if (request.session.user === undefined) {
      request.session.user = {};
    }
    request.session.user = username;
  };
  next();
};
