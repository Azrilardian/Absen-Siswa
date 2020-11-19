import darkMode from "./darkmode";
import swalSett from "./sweetAlertConfiguration";
import { STORAGE_KELAS, STORAGE_SISWA, syncWithLocalStorageKelas, syncWithLocalStorageSiswa } from "./saveDataSiswa";

const main = () => {
	// Inisialisasi Variabel
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

	/*
	======================================================================================================
	=============  STATEMENT - STATEMENT YANG BERHUBUNGAN KETIKA NAMA KELAS DI KLIK  ===================== 
	======================================================================================================
	*/

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
		// Ambil nama kelas siswa
		let namaKelas;
		spanNamaKelas.textContent.length > 1 ? (namaKelas = spanNamaKelas.textContent) : (namaKelas = kelas.value);

		// Filter siswa pada kelas apa yang akan ditampilkan
		const isiSiswa = siswaPadaKelas(namaKelas);

		// Urutkan object siswa
		const urutkanSiswaBerdasarkanAbsen = isiSiswa.sort((a, b) => {
			const x = a.nama;
			const y = b.nama;
			return x < y ? -1 : x > y ? 1 : 0;
		});

		// Parsing object siswa sekaligus buat buttonnya
		siswaContainer.innerHTML = ""; // Hapus semua data sebelum data ditambah
		buatButtonSemuaSiswa(urutkanSiswaBerdasarkanAbsen);
	};

	const kelasSiswaAktif = (target) => {
		const kelasSiswa = document.querySelectorAll(".kelas-siswa");
		kelasSiswa.forEach((e) => e.classList.remove("active"));
		target.classList.add("active");
	};

	// Event pada saat tiap - tiap kelas di klik
	const namaKelasClick = () => {
		kelasContainer.addEventListener("click", (e) => {
			const target = e.target;
			if (target.classList.contains("kelas-siswa")) {
				kelasSiswaAktif(target); // Style ketika kelas di click
				spanNamaKelas.textContent = target.textContent; // Nama kelas siswa
				tampilkanSiswaPadaKelas(); // tampilkan siswa
			}
		});
	};
	namaKelasClick();

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	=============    STATEMENT - STATEMENT YANG BERHUBUNGAN KETIKA SISWA DITAMBAH    ===================== 
	======================================================================================================
	*/

	// Ambil Data Siswa
	function Siswa(nama, kelas, jurusan, kehadiran = "hadir") {
		this.nama = nama;
		this.kelas = kelas;
		this.jurusan = jurusan;
		this.kehadiran = kehadiran;
	}

	// Ambil Data Kelas
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
		// Hapus semua kelas
		const kelasSiswa = document.querySelectorAll(".kelas-siswa");
		kelasSiswa.forEach((e) => e.remove());

		// Urutkan object semua kelas
		const urutkanKelasBerdasarkanNama = semuaKelas.map((e) => e.kelas).sort();

		// Parsing kelas sekaligus buat buttonya
		buatButtonSemuaKelas(urutkanKelasBerdasarkanNama);
	};

	const tambahDataSiswa = (nama, kelas, jurusan, kehadiran) => {
		// Cek apakah kelas sudah terdaftar atau tidak
		const cekDuplikasiNamaKelas = semuaKelas.find((e) => e.kelas == kelas);

		// Ketika ada, jangan buat button kelas lagi
		if (cekDuplikasiNamaKelas) {
			semuaSiswa.push(new Siswa(nama, kelas, jurusan));
			syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan, kehadiran);
			closeBootstrapModal();
			showAlert(".alert-success", nama, kelas);
			return;
		}

		// Ketika belum ada, buat button kelas
		semuaSiswa.push(new Siswa(nama, kelas, jurusan));
		semuaKelas.push(new Kelas(kelas));
		tambahKelas();
		syncWithLocalStorageSiswa("ADD", nama, kelas, jurusan);
		syncWithLocalStorageKelas("ADD", kelas);
		closeBootstrapModal();
	};

	const cekNamaSiswa = (tambahData) => {
		// Cek apakah siswa sudah terdaftar atau tidak
		const cekDuplikasiNamaSiswa = semuaSiswa.find((e) => e.nama == nama.value.toUpperCase());

		// Cek apakah semua data diisi atau tidak
		if (nama.value == "" || kelas.value == "" || jurusan.value == "") {
			closeBootstrapModal();
			showAlert(".alert-warning");
			// Ketika siswa sudah terdaftar
		} else if (cekDuplikasiNamaSiswa) {
			closeBootstrapModal();
			showAlert(".alert-warning", nama.value);
			// Ketika siswa belum terdaftar
		} else {
			tambahData(nama.value.toUpperCase(), kelas.value, jurusan.value); // Callback
		}
	};

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	=============   STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN METODE PADA SISWA  ===================== 
	======================================================================================================
	*/

	const metodePadaSiswa = () => {
		const nonActiveSiswaMethodDanFitur = () => {
			const allSpanMethod = document.querySelectorAll("span.method");
			const allSpanFitur = document.querySelectorAll("span.fitur");
			const allSiswa = document.querySelectorAll("button.siswa");
			const fiturAndMethod = [allSpanMethod, allSpanFitur, allSiswa];
			fiturAndMethod.map((object) => object.forEach((e) => e.classList.remove("active")));
		};

		const statusSiswa = (target, statusSiswa) => {
			const siswa = target.parentElement;
			const status = siswa.classList.toggle(statusSiswa);
			const kehadiran = status ? statusSiswa : "hadir";
			kehadiranSiswa(target, kehadiran);
			nonActiveSiswaMethodDanFitur();
		};

		const kehadiranSiswa = (target, kehadiranSiswa) => {
			const namaSiswa = target.parentElement.lastChild.textContent.trim();
			const ketSiswaDipilih = semuaSiswa.find((siswa) => siswa.nama == namaSiswa);
			const { nama, kelas, jurusan } = ketSiswaDipilih; // Destructuring siswa apa yang di pilih

			// Cari siswa dalam object semuaSiswa lalu ubah kehadirannya
			semuaSiswa.find((siswa) => {
				if (siswa.nama == namaSiswa) siswa.kehadiran = kehadiranSiswa;
			});

			// Update Kehadiran siswa pada local storage
			syncWithLocalStorageSiswa("UPDATE", nama, kelas, jurusan, kehadiranSiswa);
		};

		container.addEventListener("click", (e) => {
			let btnSiswa;
			if (e.target.classList.contains("siswa")) {
				const siswa = e.target;
				// munculkan semua metode pada siswa
				const spanMethod = [siswa.children[1], siswa.children[2], siswa.children[3]];
				const fiturSiswa = [siswa.children[4], siswa.children[5]];

				// Hapus fitur siswa ketika metode pada siswa aktif
				fiturSiswa.map((e) => e.classList.remove("active"));
				spanMethod.map((e) => e.classList.toggle("active"));

				// Tetap tambah class active pada siswa ketika metode pada siswa aktif
				spanMethod[0].classList.contains("active") ? siswa.classList.add("active") : siswa.classList.remove("active");
			} else if (e.target.classList.contains("izin")) {
				btnSiswa = e.target.parentElement;
				btnSiswa.classList.remove("siswa-sakit", "siswa-bolos", "hadir"); // agar siswa tidak mempunyai status ganda
				statusSiswa(e.target, "siswa-izin");
			} else if (e.target.classList.contains("sakit")) {
				btnSiswa = e.target.parentElement;
				btnSiswa.classList.remove("siswa-izin", "siswa-bolos", "hadir");
				statusSiswa(e.target, "siswa-sakit");
			} else if (e.target.classList.contains("bolos")) {
				btnSiswa = e.target.parentElement;
				btnSiswa.classList.remove("siswa-izin", "siswa-sakit", "hadir");
				statusSiswa(e.target, "siswa-bolos");
			} else {
				nonActiveSiswaMethodDanFitur();
			}
		});
	};
	metodePadaSiswa();

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	/*
	======================================================================================================
	=============   STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN FITUR PADA SISWA   =====================
	======================================================================================================
	*/

	const fiturPadaSiswa = () => {
		const hapusSiswa = (namaSiswa) => {
			let siswaUpdate = [];
			// Buang siswa yang dihapus pada object semuaSiswa
			semuaSiswa.filter((siswa) => (siswa.nama != namaSiswa ? siswaUpdate.push(siswa) : (siswaUpdate = siswaUpdate)));
			semuaSiswa = siswaUpdate; // Reassgin ulang semuaSiswa
			syncWithLocalStorageSiswa("DELETE", namaSiswa);
		};

		const hapusKelasSiswa = (namaKelas) => {
			const cekKelas = semuaSiswa.filter((siswa) => siswa.kelas == namaKelas);
			let kelasUpdate = [];
			if (cekKelas.length == 0) {
				// Buang kelas yang dihapus pada object semuaKelas
				semuaKelas.filter((kelasSiswa) => (kelasSiswa.kelas != namaKelas ? kelasUpdate.push(kelasSiswa) : (kelasUpdate = kelasUpdate)));
				semuaKelas = kelasUpdate; // Reassing ulang semuaKelas
				syncWithLocalStorageKelas("DELETE", namaKelas);
			}
			if (semuaKelas.length == 0) spanNamaKelas.textContent = "";
		};

		const renameSiswa = (namaSiswaSebelum, namaSiswaSesudah, target) => {
			semuaSiswa.find((siswa) => {
				// Cari siswa yang ingin diubah namanya
				if (siswa.nama == namaSiswaSebelum) {
					// Lalu ubah nama siswa
					siswa.nama = namaSiswaSesudah;
					target.parentElement.lastChild.textContent = namaSiswaSesudah;
					const { kelas, jurusan, kehadiran } = siswa;

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

				// Tetap tambah class active pada siswa ketika fitur pada siswa aktif
				fiturSiswa[0].classList.contains("active") ? siswa.classList.add("active") : siswa.classList.remove("active");
			}
		});

		container.addEventListener("click", (e) => {
			if (e.target.classList.contains("siswa-hapus")) {
				const kelasSiswa = document.getElementById("nama-kelas-siswa").textContent.trim();
				const namaSiswa = e.target.parentElement.lastChild.textContent.trim();
				hapusSiswa(namaSiswa);
				hapusKelasSiswa(kelasSiswa);
				tambahKelas(); // Update daftar kelas
				tampilkanSiswaPadaKelas(); // Update daftar siswa
			} else if (e.target.classList.contains("siswa-rename")) {
				const target = e.target;
				let namaSiswa = target.parentElement.lastChild.textContent.trim();
				const inputNamaSiswa = target.nextElementSibling; // element input
				inputNamaSiswa.classList.add("active");
				inputNamaSiswa.focus();
				inputNamaSiswa.value = namaSiswa;
				target.parentElement.lastChild.textContent = ""; // Hapus nama siswa pada btnSiswa

				inputNamaSiswa.addEventListener("keyup", (e) => {
					if (e.keyCode === 13) {
						renameSiswa(namaSiswa, inputNamaSiswa.value, target);
						inputNamaSiswa.classList.remove("active");
					}
				});
			}
		});
	};

	fiturPadaSiswa();

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/

	// Otomatis memperbesar huruf pada semua inputan
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

	const showAlert = (selector, namaSiswa, namaKelas) => {
		if (selector === ".alert-warning") {
			// Cek apakah parameter namaSiswa diisi
			if (namaSiswa != undefined) {
				swalSett("INFO", `${namaSiswa.toUpperCase()} Sudah Terdaftar`, "info", "OK");
			} else {
				swalSett("WARNING", "Semua Data Harus Diisi", "warning", "OK");
			}
		} else if (selector === ".alert-success") {
			// Cek apakah parameter namaSiswa dan namaKelas diisi
			if (namaSiswa != undefined && namaKelas != undefined) {
				swalSett("SUCCES", `${namaSiswa.toUpperCase()} Berhasil Ditambah Pada Kelas ${namaKelas}`, "success", "OK");
			}
		}
	};

	const tanggal = () => {
		const p = document.querySelector("p.date");
		const date = new Date();
		p.textContent = date.toDateString();
	};
	tanggal();

	/*
	======================================================================================================
	=============    STATEMENT - STATEMENT YANG BERHUBUNGAN DENGAN LOCAL STORAGAE    =====================
	======================================================================================================
	*/

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
		if (jam == 24) semuaSiswa.map((siswa) => (siswa.kehadiran = "hadir"));
	}

	/*
	======================================================================================================
	=============                                  AKHIR                             ===================== 
	======================================================================================================
	*/
};

export default main;
