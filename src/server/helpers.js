const isInteger = n => Number.isInteger(n);

const isNaturalNumber = n => isInteger(n) && n > 0

const isPageNumber = n => isNaturalNumber(n) && n <= 1000;

const send = (res, statusCode, data) => {
  res.setHeader('Content-Type', 'application/json');
  res.status(statusCode).send(JSON.stringify({data}))
}

const sendErr = (res, next, statusCode=500) => {
  const message = "server error";
  send(res, statusCode, message);
  next && next(new Error(message))
}

const makeRoute = name => `/api/${name}`

module.exports = { isPageNumber, isNaturalNumber, isInteger, send, sendErr, makeRoute };
