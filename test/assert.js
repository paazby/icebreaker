exports.assert = function(condition, message) {
  if (!condition) {
    throw message || "Assertion failed";
  }
};
