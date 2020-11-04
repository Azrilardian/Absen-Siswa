const STORAGE_KELAS = "STORAGE KELAS";
const STORAGE_SISWA = "STORAGE SISWA";
let semuaKelas = {};
let semuaSiswa = {};

const syncWithLocalStorageKelas = (status, kelas) => {
	switch (status) {
		case "ADD":
			semuaKelas[kelas] = [status, kelas];
			break;
		default:
			break;
	}
	localStorage.setItem(STORAGE_KELAS, JSON.stringify(semuaKelas));
	return;
};

const syncWithLocalStorageSiswa = (status, nama, kelas, jurusan) => {
	switch (status) {
		case "ADD":
			semuaSiswa[nama] = [status, nama, kelas, jurusan];
			break;
		default:
			break;
	}
	localStorage.setItem(STORAGE_SISWA, JSON.stringify(semuaSiswa));
	return;
};

export { STORAGE_KELAS, STORAGE_SISWA, syncWithLocalStorageKelas, syncWithLocalStorageSiswa };
