import "jquery";
global.jQuery = require("jquery");
require("bootstrap");
import "popper.js";
import "../Dist/css/bootstrap.min.css";
import "../Dist/css/style.css";
import main from "../Dist/js/main";
document.addEventListener("DOMContentLoaded", main);
