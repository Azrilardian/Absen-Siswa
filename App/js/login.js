//? Allneed
let username = document.getElementById("username");
let password = document.getElementById("password");
let input = document.querySelectorAll("input");
const alert = document.getElementById("alert");
const button = document.getElementById("submit");
const form = document.getElementById("login-form");
const dataLogin = [];

input.forEach((e) => {
	e.addEventListener("focusin", function () {
		e.parentElement.style.borderBottomColor = "#165794";
		e.previousElementSibling.classList.add("focus");
	});
	e.addEventListener("focusout", function () {
		if (e.value != "") {
			return;
		} else {
			e.previousElementSibling.classList.remove("focus");
		}
		e.parentElement.style.borderBottomColor = "#b4b4b4b4";
	});
});

//? Data User
const User = function (nama, password) {
	this.nama = nama;
	this.password = password;
};
let sandhikaGlih = new User("Sandhika Galih", "wpunpas2020");

let error = {
	uK: `<i class="fas fa-exclamation-circle"></i>Tidak dapat login. Username Kosong.`,
	pK: `<i class="fas fa-exclamation-circle"></i>Tidak dapat login. Password Kosong.`,
	upK: `<i class="fas fa-exclamation-circle"></i>Tidak dapat login. Username dan Password Kosong.`,
	utt: `<i class="fas fa-exclamation-circle"></i>Tidak dapat login. Anda bukan guru Sman 3 Mataram`,
	ptt: `<i class="fas fa-exclamation-circle"></i>Tidadk dapat login. Password tidak terdaftar`,
	uptt: `<i class="fas fa-exclamation-circle"></i>Tidak dapat login. Guru tidak terdaftar.`,
};

//? Form Validation
button.addEventListener("click", function () {
	if (username.value == "" || password.value == "") {
		if (username.value != "") {
			alert.innerHTML = error.pK;
		} else if (password.value != "") {
			alert.innerHTML = error.uK;
		} else {
			alert.innerHTML = error.upK;
		}
	} else if (username.value != "" || password.value != "") {
		if (username.value != sandhikaGlih.nama && password.value != sandhikaGlih.password) {
			alert.innerHTML = error.uptt;
		} else if (username.value != sandhikaGlih.nama) {
			alert.innerHTML = error.utt;
		} else if (password.value != sandhikaGlih.password) {
			alert.innerHTML = error.ptt;
		} else if (username.value == sandhikaGlih.nama && password.value == sandhikaGlih.password) {
			form.setAttribute("onsubmit", "return true");
			return;
		}
	}
	alert.style.opacity = "1";
	alert.style.top = "2%";
	setTimeout(function () {
		alert.style.top = "-11%";
		alert.style.opacity = "0";
	}, 3000);
});
