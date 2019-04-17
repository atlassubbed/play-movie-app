const chainable = method => function(...args){
  return method(...args), this;
}

const makeMockRes = (res={headers: {}}) => {
  res.status = chainable(code => res.code = code);
  res.setHeader = chainable((key, val) => res.headers[key] = val);
  res.send = chainable(data => res.sent = data);
  return res;
}

module.exports = { makeMockRes };
