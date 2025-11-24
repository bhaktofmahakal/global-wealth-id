// Mock scoring ranges for countries (in hundreds for simplicity)
const scoringRanges = {
  'USA': { min: 300, max: 850 },
  'UK': { min: 0, max: 1000 },
  'Germany': { min: 0, max: 1000 },
  'Japan': { min: 100, max: 900 },
  'Australia': { min: 0, max: 1200 },
  // Default
  'default': { min: 0, max: 1000 }
};

function convertScore(inputScore, fromCountry, toCountry) {
  // Assume input score is in fromCountry's range
  const fromRange = scoringRanges[fromCountry] || scoringRanges.default;
  const toRange = scoringRanges[toCountry] || scoringRanges.default;

  // Normalize to 0-1
  const normalized = (inputScore - fromRange.min) / (fromRange.max - fromRange.min);

  // Map to target range
  const converted = normalized * (toRange.max - toRange.min) + toRange.min;

  return Math.round(converted);
}

module.exports = { convertScore };