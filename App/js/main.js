const main = () => {
	//? Inisialisasi Variabel
	const kelasContainer = document.querySelector(".nama-kelas");
	const siswaContainer = document.querySelector(".right");
	const tambahSiswa = document.querySelector(".tambahSiswa");
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
	kelasContainer.addEventListener("click", (e) => {
		if (e.target.classList.contains("kelas-siswa")) {
			const namaKelas = e.target.textContent;
			const namaSiswa = siswaPadaKelas(namaKelas);
			siswaContainer.innerHTML = ""; // Hapus semua data
			// Lalu tambahkan
			namaSiswa.forEach((e, i) => {
				const button = `<button class="siswa"><span>${++i}</span>${e}</button>`;
				siswaContainer.insertAdjacentHTML("beforeend", button);
			});
		}
	});

	const siswaPadaKelas = (namaKelas) => {
		const kelasSiswa = semuaSiswa
			.map((e) => {
				if (e.kelas == namaKelas) return e.nama;
			})
			.filter((e) => e != undefined)
			.sort();

		return kelasSiswa;
	};

	const tambahDataSiswa = (nama, kelas, jurusan) => {
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

		const cekDuplikasiNamaKelas = semuaKelas.map((e) => e.kelas).includes(kelas);
		if (cekDuplikasiNamaKelas) {
			semuaSiswa.push(new Siswa(nama, kelas, jurusan));
			return alert(`Berhasil menambah ${nama} pada kelas ${kelas}`);
		} else {
			semuaKelas.push(new Kelas(kelas));
			const BuatBtnKelas = `<button class="kelas kelas-siswa ${kelas}">${kelas}</button>`;
			kelasContainer.insertAdjacentHTML("beforeend", BuatBtnKelas);
		}

		//? Add Data
		semuaSiswa.push(new Siswa(nama, kelas, jurusan)); // -> Menambah Siswa untuk pertama kali
	};

	const cekNamaSiswa = (tambahData) => {
		const cekDuplikasiNamaSiswa = semuaSiswa.map((e) => e.nama).includes(nama.value);
		if (nama.value == "" || kelas.value == "" || jurusan.value == "") return alert("Semua data harus diisi!");
		else if (cekDuplikasiNamaSiswa) return alert(`Siswa dengan nama ${nama.value} sudah terdaftar!`);
		else {
			tambahData(nama.value, kelas.value, jurusan.value);
		}
	};

	//! Otomatis memperbesar huruf pada semua inputan
	const input = document.querySelectorAll("input");
	input.forEach(function (e) {
		e.addEventListener("input", function () {
			e.style.textTransform = "uppercase";
		});
	});
};

export default main;
