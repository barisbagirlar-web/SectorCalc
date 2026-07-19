// Preload stub: neutralize the `server-only` / `client-only` guard modules so
// server runtime modules can be imported inside standalone Node/tsx scripts.
const Module = require("module");
const _load = Module._load;
Module._load = function patchedLoad(request, ...rest) {
  if (request === "server-only" || request === "client-only") {
    return {};
  }
  return _load.call(this, request, ...rest);
};
