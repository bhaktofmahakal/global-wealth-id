let recentChecks = [];

function addRecentCheck(check) {
  recentChecks.unshift(check);
  if (recentChecks.length > 10) {
    recentChecks = recentChecks.slice(0, 10);
  }
}

function getRecentChecks() {
  return recentChecks;
}

module.exports = { addRecentCheck, getRecentChecks };