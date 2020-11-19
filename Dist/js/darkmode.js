const darkMode = () => {
	const switchToDark = document.querySelector("ul li.darkmode");
	let isDark = localStorage.getItem("isDark") ? localStorage.getItem("isDark") : "false";

	switchToDark.addEventListener("click", function () {
		if (isDark == "true") {
			switchToDark.classList.remove("active");
			localStorage.removeItem("mode");
			document.body.classList.remove("onDarkMode");
			isDark = "false";
		} else {
			switchToDark.classList.add("active");
			localStorage.setItem("mode", "darkmode");
			document.body.classList.add("onDarkMode");
			isDark = "true";
		}
		localStorage.setItem("isDark", isDark);
	});

	if (localStorage.getItem("mode") == "darkmode") {
		document.body.classList.add("onDarkMode");
		switchToDark.classList.add("active");
	} else {
		switchToDark.classList.remove("active");
	}
};

export default darkMode;
