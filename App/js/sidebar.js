const sideBarActivation = () => {
	const sideBar = document.querySelector(".side-bar");
	document.addEventListener("click", (e) => {
		if (e.target.classList.contains("burger-open")) sideBar.classList.add("active");
		else if (e.target.classList.contains("burger-close")) sideBar.classList.remove("active");
		else {
			sideBar.classList.remove("active");
		}
	});
};
export default sideBarActivation;
