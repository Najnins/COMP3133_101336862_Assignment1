function ok(message, data = null) {
  return { success: true, message, data };
}

function fail(message, errors = []) {
  return { success: false, message, errors, data: null };
}

module.exports = { ok, fail };