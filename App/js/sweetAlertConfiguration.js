const swalSett = (title, text, icon, confirmButtonText) => {
	Swal.fire({
		title: title,
		text: text,
		icon: icon,
		confirmButtonText: confirmButtonText,
		position: "top",
	});
};

export default swalSett;
