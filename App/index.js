import "jquery";
global.jQuery = require("jquery");
require("bootstrap");
import "popper.js";
import "./css/bootstrap.min.css";
import "./css/style.css";
import main from "./js/main";
document.addEventListener("DOMContentLoaded", main);
