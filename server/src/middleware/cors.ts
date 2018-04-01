export const cors = (req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.header(
    'Access-Control-Allow-Headers',
    'X-Requested-With, X-Auth, X-HTTP-Method-Override, Content-Type, Accept',
  );
  res.header('Access-Control-Expose-Headers', 'Content-Type, X-Auth');

  if (req.method === 'OPTIONS') {
    res.sendStatus(200);
  } else {
    next();
  }
};
