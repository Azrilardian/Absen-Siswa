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

User.prototype.push = function () {
	return dataLogin.push(this);
};
let sandhikaGlih = new User("Sandhika Galih", "wpunpas2020").push();
let azrilArdian = new User("Azril ardian", "Luckyman05").push();

const cekUsername = (nama) => {
	const allUserName = dataLogin.find((e) => e.nama == nama);
	return allUserName;
};

const cekPassword = (password) => {
	const allPassword = dataLogin.find((e) => e.password == password);
	return allPassword;
};

let error = {
	uK: `<i class="fa fa-exclamation-circle"></i>Tidak dapat login. Username Kosong.`,
	pK: `<i class="fa fa-exclamation-circle"></i>Tidak dapat login. Password Kosong.`,
	upK: `<i class="fa fa-exclamation-circle"></i>Tidak dapat login. Username dan Password Kosong.`,
	utt: `<i class="fa fa-exclamation-circle"></i>Tidak dapat login. Anda bukan guru Sman 3 Mataram`,
	ptt: `<i class="fa fa-exclamation-circle"></i>Tidadk dapat login. Password tidak terdaftar`,
	uptt: `<i class="fa fa-exclamation-circle"></i>Tidak dapat login. Guru tidak terdaftar.`,
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
		if (cekUsername(username.value) == undefined && cekPassword(password.value) == undefined) {
			alert.innerHTML = error.uptt;
		} else if (cekUsername(username.value) == undefined) {
			alert.innerHTML = error.utt;
		} else if (cekPassword(password.value) == undefined) {
			alert.innerHTML = error.ptt;
		} else if (cekUsername(username.value) && cekPassword(password.value)) {
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
