import sideBarActivation from "./sidebar";
import darkMode from "./darkmode";
import { STORAGE_KELAS, STORAGE_SISWA, syncWithLocalStorageKelas, syncWithLocalStorageSiswa } from "./saveDataSiswa";

const main = () => {
	//? Inisialisasi Variabel
	const kelasContainer = document.querySelector(".nama-kelas");
	const siswaContainer = document.querySelector(".right .isi-siswa");
	const nama = document.getElementById("nama");
	const kelas = document.getElementById("kelas");
	const jurusan = document.getElementById("jurusan");
	const btnTambah = document.querySelector("#btn-tambah");
	const semuaSiswa = [];
	const semuaKelas = [];

	// SideBar
	sideBarActivation();

	// Darkmode
	darkMode();

	// Event pada saat tombol tambah di klik
	btnTambah.addEventListener("click", () => {
		cekNamaSiswa(tambahDataSiswa);
		nama.value = "";
		kelas.value = "";
		jurusan.value = "";
	});

	// Event pada saat tiap - tiap kelas di klik
	const tampilkanSiswaPadaKelas = () => {
		kelasContainer.addEventListener("click", (e) => {
			const target = e.target;
			if (target.classList.contains("kelas-siswa")) {
				// Style ketika kelas di click
				const kelasSiswa = document.querySelectorAll(".kelas-siswa");
				kelasSiswa.forEach((e) => e.classList.remove("active"));
				target.classList.add("active");

				// Siswa pada kelas apa
				const namaKelasContainer = document.querySelector(".siswa-pada-kelas");
				namaKelasContainer.textContent = `ABSEN KELAS ${target.textContent}`;

				// Tampilkan data siswa pada kelas
				const namaKelas = target.textContent;
				const siswa = siswaPadaKelas(namaKelas);
				siswaContainer.innerHTML = ""; // Hapus semua data
				// Lalu tambahkan
				siswa.forEach((e, i) => {
					const button = `
					<button class="siswa ${e.kehadiran}"><span class="absen">${++i}</span><span class="sakit method">S</span><span class="izin method">I</span><span class="bolos method">B</span>${e.nama}</button>`;
					siswaContainer.insertAdjacentHTML("beforeend", button);
				});
			}
		});
	};
	tampilkanSiswaPadaKelas();

	const siswaPadaKelas = (namaKelas) => semuaSiswa.filter((e) => e.kelas == namaKelas);

	//? Ambil Data Siswa
	function Siswa(nama, kelas, jurusan, kehadiran) {
		this.nama = nama;
		this.kelas = kelas;
		this.jurusan = jurusan;
		this.kehadiran = kehadiran;
	}

	//? Ambil Data Kelas
	function Kelas(kelas) {
		this.kelas = kelas;
	}

	const tambahDataSiswa = (nama, kelas, jurusan) => {
		const cekDuplikasiNamaKelas = semuaKelas.find((e) => e.kelas == kelas);
		if (cekDuplikasiNamaKelas) {
			// Jangan buat kelas ketika kelas sudah ada
			semuaSiswa.push(new Siswa(nama, kelas, jurusan));
			syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan);
			closeBootstrapModal();
			showBootstrapAlert(".alert-success", nama, kelas);
			return;
		} else {
			// Buat kelas ketika kelas belum ada
			semuaKelas.push(new Kelas(kelas));
			syncWithLocalStorageKelas("ADD", kelas);
			closeBootstrapModal();

			// Hapus semua kelas sebelum ditambah
			const kelasSiswa = document.querySelectorAll(".kelas-siswa");
			kelasSiswa.forEach((e) => e.remove());

			// const urutKelas = semuaKelas.map((e) => e.kelas);
			semuaKelas.map((e) => {
				const BuatBtnKelas = `<button class="kelas blue-btn kelas-siswa ${e.kelas}">${e.kelas}</button>`;
				kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
			});
		}

		//? Add Data
		semuaSiswa.push(new Siswa(nama, kelas, jurusan)); // -> Menambah Siswa untuk pertama kali
		syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan);
	};

	const cekNamaSiswa = (tambahData) => {
		const cekDuplikasiNamaSiswa = semuaSiswa.find((e) => e.nama == nama.value);
		if (nama.value == "" || kelas.value == "" || jurusan.value == "") {
			closeBootstrapModal();
			showBootstrapAlert(".alert-warning");
		} else if (cekDuplikasiNamaSiswa) {
			closeBootstrapModal();
			showBootstrapAlert(".alert-warning", nama.value, kelas.value);
		} else {
			// Callback
			tambahData(nama.value, kelas.value, jurusan.value);
		}
	};

	const metodepadaSiswa = () => {
		const container = document.querySelector(".container-fluid");

		const nonActiveSiswaMethod = () => {
			const allSpanMethod = document.querySelectorAll("span.method");
			const allSiswa = document.querySelectorAll("button.siswa");
			allSpanMethod.forEach((e) => e.classList.remove("active"));
			allSiswa.forEach((e) => e.classList.remove("active"));
		};

		const statusSiswa = (target, statusSiswa) => {
			const siswa = target.parentElement;
			const status = siswa.classList.toggle(statusSiswa);
			const kehadiran = status ? statusSiswa : "hadir";
			kehadiranSiswa(target, kehadiran);
			nonActiveSiswaMethod();
		};

		const kehadiranSiswa = (target, kehadiran) => {
			const namaSiswa = target.parentElement.lastChild.textContent;
			const ketSiswaDipilih = semuaSiswa.find((siswa) => siswa.nama == namaSiswa);
			// Destructuring siswa apa yang di pilih
			const { nama, kelas, jurusan } = ketSiswaDipilih;
			syncWithLocalStorageSiswa("UPDATE", nama, kelas, jurusan, kehadiran);
		};

		container.addEventListener("click", (e) => {
			if (e.target.classList.contains("siswa")) {
				const siswa = e.target;
				// munculkan semua metode pada siswa
				const spanMethod = [siswa.children[1], siswa.children[2], siswa.children[3]];
				spanMethod.map((e) => e.classList.toggle("active"));
				siswa.classList.toggle("active");
			} else if (e.target.classList.contains("izin")) {
				e.target.parentElement.classList.remove("siswa-sakit", "siswa-bolos"); // agar siswa tidak mempunyai status ganda
				statusSiswa(e.target, "siswa-izin");
			} else if (e.target.classList.contains("sakit")) {
				e.target.parentElement.classList.remove("siswa-izin", "siswa-bolos");
				statusSiswa(e.target, "siswa-sakit");
			} else if (e.target.classList.contains("bolos")) {
				e.target.parentElement.classList.remove("siswa-izin", "siswa-sakit");
				statusSiswa(e.target, "siswa-bolos");
			} else {
				nonActiveSiswaMethod();
			}
		});
	};
	metodepadaSiswa();

	//! Otomatis memperbesar huruf pada semua inputan
	const input = document.querySelectorAll("input");
	input.forEach(function (e) {
		e.addEventListener("input", function () {
			e.style.textTransform = "uppercase";
		});
	});

	const closeBootstrapModal = () => {
		const modal = document.querySelector(".modal");
		const modalOverlay = document.querySelector(".modal-backdrop");
		document.body.removeAttribute("class");
		modal.classList.toggle("show");
		modal.style.display = "none";
		modal.setAttribute("aria-hidden", "true");
		modal.removeAttribute("aria-modal");
		modal.removeAttribute("role");
		modalOverlay.remove();
	};

	const showBootstrapAlert = (selector, namaSiswa, namaKelas) => {
		const alert = document.querySelector(selector);
		alert.classList.add("active");
		if (selector == ".alert-warning") {
			// Cek apakah parameter namaSiswa dan namaKelas diisi
			if (namaSiswa != undefined && namaKelas != undefined) {
				alert.style.width = "500px";
				alert.innerHTML = `<p><strong>${namaSiswa.toUpperCase()}</strong> Sudah Terdaftar</p>`;
			} else {
				alert.style.width = "350px";
				alert.innerHTML = `<p>Semua Data Harus Diisi !</p>`;
			}
		} else if (selector == ".alert-success") {
			// Cek apakah parameter namaSiswa dan namaKelas diisi
			if (namaSiswa != undefined && namaKelas != undefined) {
				alert.style.width = "550px";
				alert.innerHTML = `<p><strong>${namaSiswa.toUpperCase()}</strong> Berhasil Ditambah Pada Kelas ${namaKelas}</p>`;
			}
		}
		setTimeout(() => alert.classList.remove("active"), 2000);
		setTimeout(() => (alert.innerHTML = ""), 3500);
	};

	const tanggal = () => {
		const p = document.querySelector("p.date");
		const date = new Date();
		p.textContent = date.toDateString();
	};
	tanggal();

	const dataKelasLocal = localStorage.getItem(STORAGE_KELAS);
	const dataSiswaLocal = localStorage.getItem(STORAGE_SISWA);

	if (dataKelasLocal) {
		const semuaKelasLocal = JSON.parse(dataKelasLocal);
		for (let isiKelas in semuaKelasLocal) {
			const BuatBtnKelas = `<button class="kelas kelas-siswa blue-btn ${isiKelas}">${isiKelas}</button>`;
			kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
			semuaKelas.push(new Kelas(isiKelas));
			syncWithLocalStorageKelas("ADD", isiKelas);
		}
	}

	if (dataSiswaLocal) {
		const semuaSiswaLocal = JSON.parse(dataSiswaLocal);
		for (let isiSiswa in semuaSiswaLocal) {
			// Destructuring value
			const [nama, kelas, jurusan, kehadiran] = semuaSiswaLocal[isiSiswa];
			semuaSiswa.push(new Siswa(nama, kelas, jurusan, kehadiran));
			syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan, kehadiran);
		}

		// Auto hapus data kehadiran siswa setiap hari
		const jam = new Date().getHours();
		if (jam == 24) semuaSiswa.map((e) => (e.kehadiran = "hadir"));
	}
};

export default main;
