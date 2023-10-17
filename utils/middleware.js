const requestLogger = (request, response, next) => {
    // Log request information here
    next();
  };
  
  const unknownEndpoint = (request, response) => {
    response.status(404).send({ error: 'Unknown endpoint' });
  };
  
  const errorHandler = (error, request, response, next) => {
    console.error(error.message);
  
    if (error.name === 'CastError') {
      return response.status(400).send({ error: 'Malformatted ID' });
    } else if (error.name === 'ValidationError') {
      return response.status(400).json({ error: error.message });
    }
  
    next(error);
  };

  const tokenExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');
      request.token = token;
    } else {
      request.token = null;
    }
    next();
  };

  const userExtractor = (request, response, next) => {
    const authorization = request.get('authorization');
    if (authorization && authorization.startsWith('Bearer ')) {
      const token = authorization.replace('Bearer ', '');
      try {
        const decodedToken = jwt.verify(token, process.env.SECRET);
        request.user = decodedToken; // Lisää käyttäjätieto request-olioon
      } catch (error) {
        request.user = null;
      }
    } else {
      request.user = null;
    }
    next();
  };
  
  module.exports = {
    requestLogger,
    unknownEndpoint,
    errorHandler,
    tokenExtractor,
    userExtractor
  };