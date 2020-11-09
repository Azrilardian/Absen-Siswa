const darkMode = () => {
	const switchToDark = document.querySelector("ul li.darkmode");
	let isDark = "false";
	isDark = localStorage.getItem("isDark");

	switchToDark.addEventListener("click", function () {
		document.body.classList.toggle("onDarkMode");
		if (isDark == "true") {
			switchToDark.textContent = "Switch To Lightmode";
			localStorage.removeItem("mode");
			isDark = "false";
		} else {
			switchToDark.textContent = "Switch To Darkmode";
			localStorage.setItem("mode", "darkmode");
			isDark = "true";
		}
		localStorage.setItem("isDark", isDark);
	});

	if (localStorage.getItem("mode") == "darkmode") {
		document.body.classList.add("onDarkMode");
		switchToDark.textContent = "Switch To Lightmode";
	} else if (localStorage.getItem("mode") != "darkmode") {
		switchToDark.textContent = "Switch To Darkmode";
	}
};
export default darkMode;
