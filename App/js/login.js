const swalSett = (title, text, icon, confirmButtonText) => {
	Swal.fire({
		title: title,
		text: text,
		icon: icon,
		confirmButtonText: confirmButtonText,
		position: "top",
	});
};

// import swalSett from "./sweetAlertConfiguration";

//? Allneed
let username = document.getElementById("username");
let password = document.getElementById("password");
let input = document.querySelectorAll("input");
// const alert = document.getElementById("alert");
const button = document.getElementById("submit");
const form = document.getElementById("login-form");
const dataLogin = [];

input.forEach((e) => {
	e.addEventListener("focusin", function () {
		e.parentElement.style.borderBottomColor = "#165794";
		e.previousElementSibling.classList.add("focus");
	});
	e.addEventListener("focusout", function () {
		if (e.value != "") return;
		e.previousElementSibling.classList.remove("focus");
		e.parentElement.style.borderBottomColor = "#b4b4b4b4";
	});
});

//? Data User
const User = function (nama, password) {
	this.nama = nama;
	this.password = password;
};

User.prototype.push = function () {
	return dataLogin.push(this);
};
let sandhikaGlih = new User("Sandhika Galih", "wpunpas2020").push();
let azrilArdian = new User("Azril ardian", "12345678").push();

const cekUsername = (nama) => {
	const allUserName = dataLogin.find((e) => e.nama == nama);
	return allUserName;
};

const cekPassword = (password) => {
	const allPassword = dataLogin.find((e) => e.password == password);
	return allPassword;
};

//? Form Validation
button.addEventListener("click", function () {
	if (username.value == "" || password.value == "") {
		if (username.value != "") {
			swalSett("ERROR", "Tidak dapat login. Password Kosong.", "error", "OK");
		} else if (password.value != "") {
			swalSett("ERROR", "Tidak dapat login. Username Kosong.", "error", "OK");
		} else {
			swalSett("ERROR", "Tidak dapat login. Username dan Password Kosong.", "error", "OK");
		}
	} else if (username.value != "" || password.value != "") {
		if (cekUsername(username.value) == undefined && cekPassword(password.value) == undefined) {
			swalSett("ERROR", "Tidak dapat login. Guru tidak terdaftar.", "error", "OK");
		} else if (cekUsername(username.value) == undefined) {
			swalSett("ERROR", "Tidak dapat login. Anda bukan guru Sman 3 Mataram.", "error", "OK");
		} else if (cekPassword(password.value) == undefined) {
			swalSett("ERROR", "Tidak dapat login. Password tidak terdaftar.", "error", "OK");
		} else {
			swalSett("SUCCESS", "Berhasil Login", "success", "OK");
			form.setAttribute("onsubmit", "return true");
		}
	}
});
