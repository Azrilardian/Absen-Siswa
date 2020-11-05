import { STORAGE_KELAS, STORAGE_SISWA, syncWithLocalStorageKelas, syncWithLocalStorageSiswa } from "./local-storage";

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
			if (e.target.classList.contains("kelas-siswa")) {
				// Style ketika kelas di click
				const kelasSiswa = document.querySelectorAll(".kelas-siswa");
				kelasSiswa.forEach((e) => e.classList.remove("active"));
				e.target.classList.add("active");

				// Siswa pada kelas apa
				const namaKelasContainer = document.querySelector(".siswa-pada-kelas");
				namaKelasContainer.textContent = `ABSEN KELAS ${e.target.textContent}`;

				// Tampilkan data siswa pada kelas
				const namaKelas = e.target.textContent;
				const namaSiswa = siswaPadaKelas(namaKelas);
				siswaContainer.innerHTML = ""; // Hapus semua data
				// Lalu tambahkan
				namaSiswa.forEach((e, i) => {
					const button = `<button class="siswa"><span class="absen">${++i}</span><span class="sakit method">S</span><span class="izin method">I</span><span class="bolos method">B</span>${e}</button>`;
					siswaContainer.insertAdjacentHTML("beforeend", button);
				});
			}
		});
	};
	tampilkanSiswaPadaKelas();

	const siswaPadaKelas = (namaKelas) => {
		const kelasSiswa = semuaSiswa
			.map((e) => {
				if (e.kelas == namaKelas) return e.nama;
			})
			.filter((e) => e != undefined)
			.sort();

		return kelasSiswa;
	};

	//? Get Data Siswa
	function Siswa(nama, kelas, jurusan) {
		this.nama = nama;
		this.kelas = kelas;
		this.jurusan = jurusan;
	}

	//? Get Data Kelas
	function Kelas(kelas) {
		this.kelas = kelas;
	}

	const tambahDataSiswa = (nama, kelas, jurusan) => {
		const cekDuplikasiNamaKelas = semuaKelas.map((e) => e.kelas).includes(kelas);
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
			const BuatBtnKelas = `<button class="kelas kelas-siswa ${kelas}">${kelas}</button>`;
			kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
		}

		//? Add Data
		semuaSiswa.push(new Siswa(nama, kelas, jurusan)); // -> Menambah Siswa untuk pertama kali
		syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan);
	};

	const cekNamaSiswa = (tambahData) => {
		const cekDuplikasiNamaSiswa = semuaSiswa.map((e) => e.nama).includes(nama.value);
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
			siswa.classList.toggle(statusSiswa);
			nonActiveSiswaMethod();
		};

		container.addEventListener("click", (e) => {
			if (e.target.classList.contains("siswa")) {
				const siswa = e.target;
				const spanMethod = [siswa.children[1], siswa.children[2], siswa.children[3]];
				spanMethod.forEach((e) => e.classList.toggle("active"));
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

	const clearStatusSiswaEsokHari = () => {
		const statusSiswa = document.querySelectorAll("button.siswa");
		const jam = new Date().getHours();
		if (jam == 24) statusSiswa.forEach((e) => e.classList.remove("siswa-sakit", "siswa-izin", "siswa-bolos"));
	};
	clearStatusSiswaEsokHari();

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
				alert.innerHTML = `<p><strong>${namaSiswa}</strong> Sudah Terdaftar</p>`;
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
	};

	const tanggal = () => {
		const p = document.querySelector(".date p");
		const date = new Date();
		p.textContent = date.toDateString();
	};
	tanggal();

	const dataSave = () => {
		const dataKelasLocal = localStorage.getItem(STORAGE_KELAS);
		const dataSiswaLocal = localStorage.getItem(STORAGE_SISWA);
		if (dataKelasLocal) {
			const semuaKelasLocal = JSON.parse(dataKelasLocal);
			for (let isiKelas in semuaKelasLocal) {
				const BuatBtnKelas = `<button class="kelas kelas-siswa ${isiKelas}">${isiKelas}</button>`;
				kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
				semuaKelas.push(new Kelas(isiKelas));
				syncWithLocalStorageKelas("ADD", isiKelas);
			}
		}
		if (dataSiswaLocal) {
			const semuaSiswaLocal = JSON.parse(dataSiswaLocal);
			for (let isiSiswa in semuaSiswaLocal) {
				const [, nama, kelas, jurusan] = semuaSiswaLocal[isiSiswa];
				semuaSiswa.push(new Siswa(nama, kelas, jurusan));
				syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan);
				tampilkanSiswaPadaKelas();
			}
		}
	};
	dataSave();
};

export default main;
