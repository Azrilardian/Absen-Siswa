const darkMode = (isDark) => {
	const switchToDark = document.querySelector("ul li.darkmode");

	isDark = localStorage.getItem("isDark");
	switchToDark.addEventListener("click", function () {
		document.body.classList.toggle("onDarkMode");
		if (isDark == "true") {
			this.textContent = "Switch To Lightmode";
			localStorage.removeItem("mode");
			isDark = "false";
		} else {
			this.textContent = "Switch To Darkmode";
			localStorage.setItem("mode", "darkmode");
			isDark = "true";
		}
		localStorage.setItem("isDark", isDark);
	});

	if (localStorage.getItem("mode") == "darkmode") document.body.classList.add("onDarkMode");
};
export default darkMode;
