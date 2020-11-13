import sideBarActivation from "./sidebar";
import darkMode from "./darkmode";
import { STORAGE_KELAS, STORAGE_SISWA, syncWithLocalStorageKelas, syncWithLocalStorageSiswa } from "./saveDataSiswa";

const main = () => {
	//? Inisialisasi Variabel
	const container = document.querySelector(".container-fluid");
	const kelasContainer = document.querySelector(".nama-kelas");
	const siswaContainer = document.querySelector(".right .isi-siswa");
	const spanNamaKelas = document.getElementById("nama-kelas-siswa");
	const nama = document.getElementById("nama");
	const kelas = document.getElementById("kelas");
	const jurusan = document.getElementById("jurusan");
	const btnTambah = document.querySelector("#btn-tambah");
	let semuaSiswa = [];
	let semuaKelas = [];

	// SideBar
	sideBarActivation();

	// Darkmode
	darkMode();

	// Event pada saat tombol tambah di klik
	btnTambah.addEventListener("click", () => {
		cekNamaSiswa(tambahDataSiswa);
		spanNamaKelas.textContent = kelas.value;
		tampilkanSiswaPadaKelas();
		darkMode();

		nama.value = "";
		kelas.value = "";
		jurusan.value = "";
	});

	const siswaPadaKelas = (namaKelas) => semuaSiswa.filter((e) => e.kelas == namaKelas);

	const buatButtonSemuaSiswa = (semuaSiswa) => {
		// Render Html Siswa
		const btnSiswa = (e, i) => {
			return `<button class="siswa ${e.kehadiran}">
						<span class="absen">${++i}</span>
						<span class="sakit method">S</span>
						<span class="izin method">I</span>
						<span class="bolos method">B</span>
						<span class="siswa-hapus fitur">D</span>
						<span class="siswa-rename fitur">R</span>
						<input type="text">${e.nama}
					</button>`;
		};

		semuaSiswa.map((e, i) => {
			const button = btnSiswa(e, i);
			siswaContainer.insertAdjacentHTML("beforeend", button);
		});
	};

	const tampilkanSiswaPadaKelas = () => {
		// Ketika ada, ambil text contentnya
		let namaKelas;
		if (spanNamaKelas.textContent.length > 1) namaKelas = spanNamaKelas.textContent;
		// Jika tidak, ambil hasil input kelas siswa
		else {
			namaKelas = kelas.value;
		}
		const isiSiswa = siswaPadaKelas(namaKelas);
		// Urutkan siswa pada kelas
		const urutkanSiswaBerdasarkanAbsen = isiSiswa.sort((a, b) => {
			const x = a.nama;
			const y = b.nama;
			return x < y ? -1 : x > y ? 1 : 0;
		});

		siswaContainer.innerHTML = ""; // Hapus semua data sebelum data ditambah
		buatButtonSemuaSiswa(urutkanSiswaBerdasarkanAbsen);
	};

	// Event pada saat tiap - tiap kelas di klik
	const namaKelasClick = () => {
		kelasContainer.addEventListener("click", (e) => {
			const target = e.target;
			if (target.classList.contains("kelas-siswa")) {
				// Style ketika kelas di click
				const kelasSiswa = document.querySelectorAll(".kelas-siswa");
				kelasSiswa.forEach((e) => e.classList.remove("active"));
				target.classList.add("active");

				spanNamaKelas.textContent = target.textContent;
				tampilkanSiswaPadaKelas();
			}
		});
	};
	namaKelasClick();

	//? Ambil Data Siswa
	function Siswa(nama, kelas, jurusan, kehadiran = "hadir") {
		this.nama = nama;
		this.kelas = kelas;
		this.jurusan = jurusan;
		this.kehadiran = kehadiran;
	}

	//? Ambil Data Kelas
	function Kelas(kelas) {
		this.kelas = kelas;
	}

	const buatButtonSemuaKelas = (semuaKelas) => {
		semuaKelas.map((e) => {
			const BuatBtnKelas = `<button class="kelas blue-btn kelas-siswa ${e}">${e}</button>`;
			kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
		});
	};

	const tambahKelas = () => {
		// Hapus semua kelas sebelum ditambah
		const kelasSiswa = document.querySelectorAll(".kelas-siswa");
		kelasSiswa.forEach((e) => e.remove());

		const urutkanKelasBerdasarkanNama = semuaKelas.map((e) => e.kelas).sort();
		buatButtonSemuaKelas(urutkanKelasBerdasarkanNama);
	};

	const tambahDataSiswa = (nama, kelas, jurusan, kehadiran) => {
		const cekDuplikasiNamaKelas = semuaKelas.find((e) => e.kelas == kelas);
		if (cekDuplikasiNamaKelas) {
			// Jangan buat kelas ketika kelas sudah ada
			semuaSiswa.push(new Siswa(nama, kelas, jurusan));
			syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan, kehadiran);
			closeBootstrapModal();
			showBootstrapAlert(".alert-success", nama, kelas);
			return;
		} else {
			// Buat kelas ketika kelas belum ada
			semuaKelas.push(new Kelas(kelas));
			syncWithLocalStorageKelas("ADD", kelas);
			closeBootstrapModal();
			tambahKelas();
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
			tambahData(nama.value.toUpperCase(), kelas.value, jurusan.value);
		}
	};

	const metodePadaSiswa = () => {
		const nonActiveSiswaMethodDanFitur = () => {
			const allSpanMethod = document.querySelectorAll("span.method");
			const allSpanFitur = document.querySelectorAll("span.fitur");
			const allSiswa = document.querySelectorAll("button.siswa");
			allSpanMethod.forEach((e) => e.classList.remove("active"));
			allSpanFitur.forEach((e) => e.classList.remove("active"));
			allSiswa.forEach((e) => e.classList.remove("active"));
		};

		const statusSiswa = (target, statusSiswa) => {
			const siswa = target.parentElement;
			const status = siswa.classList.toggle(statusSiswa);
			const kehadiran = status ? statusSiswa : "hadir";
			kehadiranSiswa(target, kehadiran);
			nonActiveSiswaMethodDanFitur();
		};

		const kehadiranSiswa = (target, kehadiranSiswa) => {
			const namaSiswa = target.parentElement.lastChild.textContent;
			const ketSiswaDipilih = semuaSiswa.find((siswa) => siswa.nama == namaSiswa.trim());
			// Destructuring siswa apa yang di pilih
			const { nama, kelas, jurusan } = ketSiswaDipilih;
			// Update Kehadiran Siswa ketika kehadiran siswa diubah
			semuaSiswa.find((siswa) => {
				if (siswa.nama == namaSiswa.trim()) siswa.kehadiran = kehadiranSiswa;
			});
			syncWithLocalStorageSiswa("UPDATE", nama, kelas, jurusan, kehadiranSiswa);
		};

		container.addEventListener("click", (e) => {
			if (e.target.classList.contains("siswa")) {
				const siswa = e.target;
				// munculkan semua metode pada siswa
				const spanMethod = [siswa.children[1], siswa.children[2], siswa.children[3]];
				const fiturSiswa = [siswa.children[4], siswa.children[5]];

				// Hapus fitur siswa ketika metode pada siswa aktif
				fiturSiswa.map((e) => e.classList.remove("active"));
				spanMethod.map((e) => e.classList.toggle("active"));
				if (spanMethod[0].classList.contains("active")) siswa.classList.add("active");
				else {
					siswa.classList.remove("active");
				}
			} else if (e.target.classList.contains("izin")) {
				e.target.parentElement.classList.remove("siswa-sakit", "siswa-bolos", "hadir"); // agar siswa tidak mempunyai status ganda
				statusSiswa(e.target, "siswa-izin");
			} else if (e.target.classList.contains("sakit")) {
				e.target.parentElement.classList.remove("siswa-izin", "siswa-bolos", "hadir");
				statusSiswa(e.target, "siswa-sakit");
			} else if (e.target.classList.contains("bolos")) {
				e.target.parentElement.classList.remove("siswa-izin", "siswa-sakit", "hadir");
				statusSiswa(e.target, "siswa-bolos");
			} else {
				nonActiveSiswaMethodDanFitur();
			}
		});
	};
	metodePadaSiswa();

	const fiturPadaSiswa = () => {
		const hapusSiswa = (target) => {
			const siswaUpdate = [];
			semuaSiswa.filter((siswa) => {
				if (siswa.nama != target) siswaUpdate.push(siswa);
			});
			semuaSiswa = siswaUpdate;
		};

		const hapusKelasSiswa = (namaKelas) => {
			const cekKelas = semuaSiswa.filter((siswa) => siswa.kelas == namaKelas);
			if (cekKelas.length == 0) {
				const kelasUpdate = [];
				semuaKelas.filter((kelasSiswa) => {
					if (kelasSiswa.kelas != namaKelas) kelasUpdate.push(kelasSiswa);
				});
				semuaKelas = kelasUpdate;
				syncWithLocalStorageKelas("DELETE", namaKelas);
			}
			if (semuaKelas.length == 0) {
				spanNamaKelas.textContent = "";
			}
		};

		const renameSiswa = (namaSiswaSebelum, namaSiswaSesudah, target) => {
			semuaSiswa.find((siswa) => {
				// Cari siswa yang ingin diubah namanya
				if (siswa.nama == namaSiswaSebelum) {
					// Lalu ubah nama siswa
					siswa.nama = namaSiswaSesudah;
					target.parentElement.lastChild.textContent = namaSiswaSesudah;
					// Destructuring siswa apa yang dipilih
					const { nama, kelas, jurusan, kehadiran } = siswa;

					// Hapus dulu data siswa yang lama pada local storage, setelah itu tambah siswa yang telah direname
					syncWithLocalStorageSiswa("DELETE", namaSiswaSebelum);
					syncWithLocalStorageSiswa("UPDATE", namaSiswaSesudah, kelas, jurusan, kehadiran);
				}
			});
		};

		container.addEventListener("dblclick", (e) => {
			if (e.target.classList.contains("siswa")) {
				const siswa = e.target;
				const spanMethod = [siswa.children[1], siswa.children[2], siswa.children[3]];
				const fiturSiswa = [siswa.children[4], siswa.children[5]];

				// Hapus metode siswa ketika fitur pada siswa aktif
				spanMethod.map((e) => e.classList.remove("active"));
				fiturSiswa.map((e) => e.classList.toggle("active"));
				if (fiturSiswa[0].classList.contains("active")) siswa.classList.add("active");
				else {
					siswa.classList.remove("active");
				}
			}
		});

		container.addEventListener("click", (e) => {
			if (e.target.classList.contains("siswa-hapus")) {
				const kelasSiswa = document.getElementById("nama-kelas-siswa").textContent.trim();
				const namaSiswa = e.target.parentElement.lastChild.textContent.trim();
				hapusSiswa(namaSiswa);
				hapusKelasSiswa(kelasSiswa);
				tambahKelas();
				syncWithLocalStorageSiswa("DELETE", namaSiswa);
				tampilkanSiswaPadaKelas();
			} else if (e.target.classList.contains("siswa-rename")) {
				const target = e.target;
				let namaSiswa = target.parentElement.lastChild.textContent;
				const inputNamaSiswa = target.nextElementSibling;
				inputNamaSiswa.classList.add("active");
				inputNamaSiswa.focus();
				inputNamaSiswa.value = namaSiswa.trim();
				target.parentElement.lastChild.textContent = "";

				inputNamaSiswa.addEventListener("keyup", (e) => {
					if (e.keyCode === 13) {
						renameSiswa(namaSiswa.trim(), inputNamaSiswa.value, target);
						inputNamaSiswa.classList.remove("active");
					}
				});
			}
		});
	};

	fiturPadaSiswa();

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
		const semuaKelasLocalArray = [];
		let sortKelas = [];
		for (let isiKelas in semuaKelasLocal) {
			semuaKelasLocalArray.push(isiKelas);
			sortKelas = semuaKelasLocalArray.sort();
		}
		sortKelas.map((kelas) => {
			const BuatBtnKelas = `<button class="kelas kelas-siswa blue-btn ${kelas}">${kelas}</button>`;
			kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
			semuaKelas.push(new Kelas(kelas));
			syncWithLocalStorageKelas("ADD", kelas);
		});
	}

	if (dataSiswaLocal) {
		const semuaSiswaLocal = JSON.parse(dataSiswaLocal);
		for (let isiSiswa in semuaSiswaLocal) {
			// Destructuring value
			const [nama, kelas, jurusan, kehadiran] = semuaSiswaLocal[isiSiswa];
			// Eksekusi fungsi tampikanSiswaPadaKelas();
			semuaSiswa.push(new Siswa(nama, kelas, jurusan, kehadiran));
			syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan, kehadiran);
		}
		// Auto hapus data kehadiran siswa setiap hari
		const jam = new Date().getHours();
		if (jam == 24) semuaSiswa.map((e) => (e.kehadiran = "hadir"));
	}
};

export default main;
