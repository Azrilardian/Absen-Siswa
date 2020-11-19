const STORAGE_KELAS = "STORAGE KELAS";
const STORAGE_SISWA = "STORAGE SISWA";
let semuaKelas = {};
let semuaSiswa = {};

const syncWithLocalStorageKelas = (status, kelas) => {
	switch (status) {
		case "ADD":
			semuaKelas[kelas] = [kelas];
			break;
		case "DELETE":
			delete semuaKelas[kelas];
			break;
		default:
			break;
	}
	localStorage.setItem(STORAGE_KELAS, JSON.stringify(semuaKelas));
	return;
};

const syncWithLocalStorageSiswa = (status, nama, kelas, jurusan, kehadiran = "hadir") => {
	switch (status) {
		case "ADD":
		case "UPDATE":
			semuaSiswa[nama] = [nama, kelas, jurusan, kehadiran];
			break;
		case "DELETE":
			delete semuaSiswa[nama];
			break;
		default:
			break;
	}
	localStorage.setItem(STORAGE_SISWA, JSON.stringify(semuaSiswa));
	return;
};

export { STORAGE_KELAS, STORAGE_SISWA, syncWithLocalStorageKelas, syncWithLocalStorageSiswa };
