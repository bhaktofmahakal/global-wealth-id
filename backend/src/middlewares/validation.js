function validateConvertRequest(req, res, next) {
  const { score, fromCountry, toCountry } = req.body;
  if (typeof score !== 'number' || score < 0) {
    return res.status(400).json({ error: 'Invalid score: must be a non-negative number' });
  }
  if (!fromCountry || typeof fromCountry !== 'string') {
    return res.status(400).json({ error: 'Invalid fromCountry: must be a string' });
  }
  if (!toCountry || typeof toCountry !== 'string') {
    return res.status(400).json({ error: 'Invalid toCountry: must be a string' });
  }
  next();
}

module.exports = { validateConvertRequest };