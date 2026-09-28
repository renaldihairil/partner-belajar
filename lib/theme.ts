export const THEME_STORAGE_KEY = "pb-theme";

/**
 * Dijalankan di <head> sebelum halaman tampil agar tidak ada kedipan tema.
 * Default: terang (identitas brand); pilihan pengunjung disimpan di localStorage.
 */
export const themeInitScript = `(function(){try{var t=localStorage.getItem('${THEME_STORAGE_KEY}');document.documentElement.dataset.theme=t==='dark'?'dark':'light';}catch(e){document.documentElement.dataset.theme='light';}})();`;
