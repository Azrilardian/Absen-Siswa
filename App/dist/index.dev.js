"use strict";

require("jquery");

require("popper.js");

require("../Dist/css/bootstrap.min.css");

require("../Dist/css/style.css");

var _main = _interopRequireDefault(require("../Dist/js/main"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

global.jQuery = require("jquery");

require("bootstrap");

document.addEventListener("DOMContentLoaded", _main["default"]);