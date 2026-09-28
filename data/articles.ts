import type { Article } from "@/types";

/**
 * CONTOH artikel (frontend dulu, belum ada database/CMS).
 * Gambar sampul di /images/articles/cover-*.webp adalah ilustrasi sementara.
 */
const tim = { name: "Tim Partner Belajar", role: "Redaksi" };

export const articles: Article[] = [
  {
    id: "1",
    slug: "5-tips-membiasakan-anak-belajar-bahasa-inggris-di-rumah",
    title: "5 Tips Membiasakan Anak Belajar Bahasa Inggris di Rumah",
    date: "2026-09-24",
    image: "/images/articles/cover-bahasa-inggris.webp",
    imageAlt: "Ilustrasi anak belajar bahasa Inggris dengan buku",
    excerpt:
      "Bahasa Inggris tidak harus dipelajari lewat hafalan panjang. Lima kebiasaan kecil ini membuat anak terbiasa mendengar dan memakai bahasa Inggris setiap hari.",
    category: "Bahasa",
    tags: ["bahasa inggris", "kebiasaan", "belajar di rumah"],
    author: { name: "Kak Nadia Putri", role: "English Teacher" },
    featured: true,
    content: [
      {
        type: "p",
        text: "Anak belajar bahasa paling cepat ketika bahasa itu hadir dalam keseharian. Kabar baiknya, orang tua tidak perlu fasih untuk memulainya — yang dibutuhkan adalah kebiasaan kecil yang konsisten.",
      },
      { type: "h2", text: "1. Mulai dari kata-kata di sekitar rumah" },
      {
        type: "p",
        text: "Tempelkan label sederhana di benda-benda rumah: door, table, window. Sebut kata itu setiap kali memakainya. Dalam beberapa minggu, anak akan mengenal puluhan kosakata tanpa merasa sedang belajar.",
      },
      { type: "h2", text: "2. Jadikan lagu dan cerita sebagai teman" },
      {
        type: "p",
        text: "Pilih lagu anak berbahasa Inggris dengan lirik yang jelas, lalu nyanyikan bersama. Buku cerita bergambar juga membantu anak menghubungkan kata dengan makna.",
      },
      { type: "h2", text: "3. Tetapkan “English time” singkat" },
      {
        type: "p",
        text: "Cukup 10–15 menit sehari, misalnya saat sarapan. Gunakan kalimat pendek seperti “Can you pass the spoon?”. Rutinitas yang singkat lebih mudah dijaga daripada sesi panjang yang jarang.",
      },
      { type: "h2", text: "4. Rayakan usaha, bukan hanya jawaban benar" },
      {
        type: "p",
        text: "Saat anak mencoba berbicara, apresiasi keberaniannya terlebih dahulu. Koreksi bisa diberikan dengan mengulang kalimat yang benar secara santai, tanpa membuat anak malu.",
      },
      { type: "h2", text: "5. Belajar bersama pendamping" },
      {
        type: "p",
        text: "Pendamping yang sabar membantu anak berlatih percakapan secara terarah. Di kelas English Partner, anak belajar lewat permainan, percakapan, dan latihan yang disesuaikan dengan usianya.",
      },
      {
        type: "tip",
        text: "Konsistensi lebih penting daripada durasi. Lima belas menit setiap hari jauh lebih efektif daripada dua jam sekali seminggu.",
      },
    ],
  },
  {
    id: "2",
    slug: "pentingnya-kemandirian-anak-sejak-dini",
    title: "Pentingnya Kemandirian Anak Sejak Dini",
    date: "2026-09-18",
    image: "/images/articles/cover-kemandirian.webp",
    imageAlt: "Ilustrasi anak-anak Muslim bersiap belajar dengan tas sekolah",
    excerpt:
      "Anak yang mandiri lebih percaya diri menghadapi tantangan. Begini cara menumbuhkan kemandirian lewat tugas-tugas kecil di rumah.",
    category: "Parenting",
    tags: ["kemandirian", "karakter", "parenting"],
    author: tim,
    content: [
      {
        type: "p",
        text: "Kemandirian bukan berarti anak harus melakukan semuanya sendiri. Kemandirian adalah kemampuan anak untuk mencoba, mengambil keputusan kecil, dan bertanggung jawab atas pilihannya.",
      },
      { type: "h2", text: "Mengapa kemandirian penting?" },
      {
        type: "list",
        items: [
          "Anak lebih percaya diri karena merasa mampu.",
          "Anak belajar memecahkan masalah sederhana.",
          "Anak lebih siap beradaptasi di lingkungan baru seperti sekolah.",
        ],
      },
      { type: "h2", text: "Mulai dari tugas kecil" },
      {
        type: "p",
        text: "Berikan tugas yang sesuai usia: merapikan mainan, menyiapkan tas sekolah, atau menaruh piring setelah makan. Tunjukkan caranya, lakukan bersama, lalu biarkan anak mencoba sendiri.",
      },
      { type: "h2", text: "Beri ruang untuk salah" },
      {
        type: "p",
        text: "Hasilnya mungkin belum rapi, dan itu wajar. Hindari mengambil alih pekerjaan anak. Pujian atas usahanya akan membuat anak ingin mencoba lagi.",
      },
      {
        type: "tip",
        text: "Gunakan pilihan terbatas, misalnya “Mau pakai baju biru atau hijau?”. Anak merasa dilibatkan, sementara orang tua tetap mengarahkan.",
      },
    ],
  },
  {
    id: "3",
    slug: "cara-meningkatkan-motivasi-belajar-anak-dengan-cara-sederhana",
    title: "Cara Meningkatkan Motivasi Belajar Anak dengan Cara Sederhana",
    date: "2026-09-11",
    image: "/images/articles/cover-motivasi.webp",
    imageAlt: "Ilustrasi anak bersemangat membaca buku",
    excerpt:
      "Motivasi belajar tumbuh dari rasa ingin tahu dan rasa mampu. Coba langkah-langkah sederhana ini agar anak semangat belajar tanpa paksaan.",
    category: "Tips Belajar",
    tags: ["motivasi", "belajar", "tips"],
    author: tim,
    content: [
      {
        type: "p",
        text: "Setiap anak punya rasa ingin tahu. Tugas kita adalah menjaga rasa ingin tahu itu tetap menyala — bukan memadamkannya dengan tekanan.",
      },
      { type: "h2", text: "Hubungkan pelajaran dengan kehidupan" },
      {
        type: "p",
        text: "Berhitung bisa dimulai dari menghitung belanjaan, membaca dari papan nama toko. Anak lebih termotivasi saat melihat manfaat langsung dari yang dipelajarinya.",
      },
      { type: "h2", text: "Pecah target menjadi langkah kecil" },
      {
        type: "p",
        text: "Target besar terasa menakutkan. Bagi menjadi langkah kecil yang bisa dicentang. Setiap langkah yang selesai memberi rasa berhasil.",
      },
      { type: "h2", text: "Ciptakan suasana yang menyenangkan" },
      {
        type: "list",
        items: [
          "Sediakan sudut belajar yang rapi dan terang.",
          "Selingi dengan permainan edukatif.",
          "Beri jeda istirahat singkat setiap 20–30 menit.",
        ],
      },
      {
        type: "tip",
        text: "Ceritakan pengalaman belajar Anda sendiri, termasuk saat kesulitan. Anak belajar bahwa usaha dan kegagalan adalah bagian dari proses.",
      },
    ],
  },
  {
    id: "4",
    slug: "peran-orang-tua-dalam-mendukung-proses-belajar-anak",
    title: "Peran Orang Tua dalam Mendukung Proses Belajar Anak",
    date: "2026-09-04",
    image: "/images/articles/cover-peran-orang-tua.webp",
    imageAlt: "Ilustrasi pendamping belajar online dengan laptop",
    excerpt:
      "Orang tua adalah pendamping belajar pertama bagi anak. Kenali peran-peran sederhana yang berdampak besar pada perkembangan belajarnya.",
    category: "Parenting",
    tags: ["orang tua", "pendampingan", "belajar online"],
    author: tim,
    content: [
      {
        type: "p",
        text: "Guru dan kelas penting, tetapi sebagian besar waktu anak dihabiskan di rumah. Karena itu, dukungan orang tua sangat menentukan keberhasilan belajar anak.",
      },
      { type: "h2", text: "Menjadi teladan" },
      {
        type: "p",
        text: "Anak meniru apa yang dilihatnya. Orang tua yang senang membaca dan belajar hal baru akan menularkan kebiasaan itu kepada anak.",
      },
      { type: "h2", text: "Menjaga komunikasi dengan pengajar" },
      {
        type: "p",
        text: "Tanyakan perkembangan anak secara berkala. Di Partner Belajar, orang tua menerima laporan perkembangan agar bisa melanjutkan latihan di rumah.",
      },
      { type: "h2", text: "Mendampingi, bukan mengerjakan" },
      {
        type: "list",
        items: [
          "Temani anak saat belajar, tetapi biarkan ia berpikir sendiri.",
          "Ajukan pertanyaan pancingan, bukan langsung memberi jawaban.",
          "Apresiasi proses, bukan hanya nilai.",
        ],
      },
      {
        type: "tip",
        text: "Luangkan 5 menit sebelum tidur untuk bertanya “Hari ini belajar apa yang paling seru?”. Pertanyaan sederhana ini membangun kedekatan sekaligus kebiasaan refleksi.",
      },
    ],
  },
  {
    id: "5",
    slug: "menumbuhkan-cinta-al-quran-pada-anak-sejak-kecil",
    title: "Menumbuhkan Cinta Al-Qur'an pada Anak Sejak Kecil",
    date: "2026-08-27",
    image: "/images/articles/cover-cinta-quran.webp",
    imageAlt: "Ilustrasi anak Muslim memegang mushaf Al-Qur'an",
    excerpt:
      "Kecintaan pada Al-Qur'an tumbuh dari pengalaman yang hangat. Berikut cara mengenalkan Al-Qur'an kepada anak dengan penuh kasih sayang.",
    category: "Islami",
    tags: ["al-qur'an", "tahsin", "tahfizh"],
    author: { name: "Ustadzah Hana Salsabila", role: "Pengajar Tahsin & Tahfizh" },
    featured: true,
    content: [
      {
        type: "p",
        text: "Anak yang mengenal Al-Qur'an dalam suasana menyenangkan akan tumbuh dengan rasa rindu untuk membacanya. Mulailah dari hal kecil dan lakukan dengan konsisten.",
      },
      { type: "h2", text: "Perdengarkan bacaan Al-Qur'an" },
      {
        type: "p",
        text: "Putar murattal di rumah, terutama surat-surat pendek. Anak akan akrab dengan bunyi dan irama bacaan sebelum mulai belajar membaca.",
      },
      { type: "h2", text: "Belajar makhraj dengan sabar" },
      {
        type: "p",
        text: "Tahsin yang baik dimulai dari pengucapan huruf yang benar. Latihan singkat setiap hari dengan bimbingan pengajar membantu anak membaca dengan tartil.",
      },
      { type: "h2", text: "Hafalan bertahap" },
      {
        type: "list",
        ordered: true,
        items: [
          "Mulai dari surat pendek di Juz 30.",
          "Ulang hafalan lama sebelum menambah yang baru.",
          "Murajaah bersama keluarga, misalnya setelah shalat Maghrib.",
        ],
      },
      {
        type: "tip",
        text: "Jadikan waktu mengaji sebagai momen kebersamaan, bukan hukuman. Pelukan dan pujian setelah anak membaca akan membuatnya menantikan waktu itu.",
      },
    ],
  },
  {
    id: "6",
    slug: "mengenalkan-sirah-nabi-kepada-anak-dengan-cara-menyenangkan",
    title: "Mengenalkan Sirah Nabi kepada Anak dengan Cara Menyenangkan",
    date: "2026-08-19",
    image: "/images/articles/cover-sirah.webp",
    imageAlt: "Ilustrasi keluarga Muslim bersama anak-anak membawa mushaf",
    excerpt:
      "Kisah Nabi dan para sahabat adalah teladan terbaik bagi anak. Ceritakan dengan cara yang hidup agar nilainya melekat di hati.",
    category: "Islami",
    tags: ["sirah", "diniyyah", "akhlak"],
    author: { name: "Ustadzah Maryam Azzahra", role: "Pengajar Diniyyah & Sirah" },
    content: [
      {
        type: "p",
        text: "Anak menyukai cerita. Melalui kisah Nabi Muhammad ﷺ dan para sahabat, anak belajar tentang kejujuran, kasih sayang, keberanian, dan kesabaran dengan cara yang mudah dipahami.",
      },
      { type: "h2", text: "Pilih kisah sesuai usia" },
      {
        type: "p",
        text: "Untuk anak kecil, mulai dari kisah yang sederhana dan penuh teladan akhlak. Untuk anak yang lebih besar, ajak mereka memahami urutan peristiwa dan hikmahnya.",
      },
      { type: "h2", text: "Hidupkan ceritanya" },
      {
        type: "list",
        items: [
          "Gunakan peta sederhana untuk menunjukkan tempat peristiwa.",
          "Ajak anak menggambar adegan favoritnya.",
          "Ajukan pertanyaan: “Kalau kamu di sana, apa yang akan kamu lakukan?”",
        ],
      },
      { type: "h2", text: "Hubungkan dengan keseharian" },
      {
        type: "p",
        text: "Setelah bercerita, ajak anak mempraktikkan satu akhlak yang dipelajari, misalnya berkata jujur atau membantu teman. Di kelas Diniyyah Partner, setiap kisah diakhiri dengan aksi kecil yang bisa dilakukan anak.",
      },
      {
        type: "tip",
        text: "Pastikan kisah yang diceritakan bersumber dari rujukan yang terpercaya. Tanyakan kepada pengajar bila ragu.",
      },
    ],
  },
  {
    id: "7",
    slug: "belajar-bahasa-arab-dasar-mulai-dari-kosakata-sehari-hari",
    title: "Belajar Bahasa Arab Dasar: Mulai dari Kosakata Sehari-hari",
    date: "2026-08-12",
    image: "/images/articles/cover-bahasa-arab.webp",
    imageAlt: "Ilustrasi anak belajar bahasa Arab dengan buku",
    excerpt:
      "Bahasa Arab terasa lebih dekat saat dimulai dari kata-kata yang dipakai setiap hari. Ini cara praktis mengenalkannya di rumah.",
    category: "Bahasa",
    tags: ["bahasa arab", "kosakata", "belajar di rumah"],
    author: { name: "Ustadz Fikri Ramadhan", role: "Pengajar Bahasa Arab" },
    content: [
      {
        type: "p",
        text: "Banyak anak merasa bahasa Arab sulit karena langsung berhadapan dengan tata bahasa. Padahal, langkah pertama yang paling menyenangkan adalah mengenal kosakata sehari-hari.",
      },
      { type: "h2", text: "Kosakata di sekitar kita" },
      {
        type: "p",
        text: "Mulailah dari benda dan kegiatan yang dekat dengan anak: bayt (rumah), kitāb (buku), qalam (pena), mā' (air). Sebutkan kata-kata ini dalam percakapan ringan.",
      },
      { type: "h2", text: "Gunakan kartu bergambar" },
      {
        type: "p",
        text: "Kartu dengan gambar dan tulisan Arab membantu anak mengingat kata sekaligus mengenal huruf. Mainkan tebak-tebakan singkat agar suasana tetap seru.",
      },
      { type: "h2", text: "Ulangi dalam kalimat sederhana" },
      {
        type: "list",
        items: [
          "Satu kata baru setiap hari sudah cukup.",
          "Ulangi kata lama dalam kalimat pendek.",
          "Minta anak mengajarkan kata itu kepada anggota keluarga lain.",
        ],
      },
      {
        type: "tip",
        text: "Mengenal bahasa Arab juga membantu anak memahami makna bacaan shalat dan doa sehari-hari.",
      },
    ],
  },
  {
    id: "8",
    slug: "membangun-rutinitas-belajar-yang-konsisten",
    title: "Membangun Rutinitas Belajar yang Konsisten",
    date: "2026-08-05",
    image: "/images/articles/cover-rutinitas.webp",
    imageAlt: "Ilustrasi anak dengan buku dan jam sebagai simbol rutinitas",
    excerpt:
      "Rutinitas membuat belajar terasa ringan karena menjadi kebiasaan. Susun jadwal belajar yang realistis dan mudah dijalankan.",
    category: "Tips Belajar",
    tags: ["rutinitas", "jadwal", "kebiasaan"],
    author: tim,
    content: [
      {
        type: "p",
        text: "Anak yang punya rutinitas jelas tidak perlu “dipaksa” belajar setiap hari, karena belajar sudah menjadi bagian dari jadwalnya — sama seperti makan dan tidur.",
      },
      { type: "h2", text: "Tentukan waktu yang tetap" },
      {
        type: "p",
        text: "Pilih waktu saat anak segar, misalnya setelah istirahat siang atau setelah shalat Ashar. Waktu yang sama setiap hari membantu tubuh dan pikiran anak bersiap.",
      },
      { type: "h2", text: "Buat jadwal yang terlihat" },
      {
        type: "p",
        text: "Tempel jadwal mingguan bergambar di dinding. Biarkan anak memberi tanda setiap selesai belajar. Tanda-tanda kecil ini memberi rasa pencapaian.",
      },
      { type: "h2", text: "Realistis dan fleksibel" },
      {
        type: "list",
        items: [
          "Mulai dari durasi pendek, lalu tambah perlahan.",
          "Sisakan hari tanpa target untuk bermain bebas.",
          "Evaluasi jadwal bersama anak setiap akhir pekan.",
        ],
      },
      {
        type: "tip",
        text: "Jika satu hari terlewat, jangan menyerah. Kembali ke jadwal esok harinya — rutinitas dibangun dari kebiasaan kembali, bukan dari kesempurnaan.",
      },
    ],
  },
  {
    id: "9",
    slug: "mengatur-waktu-layar-anak-saat-belajar-online",
    title: "Mengatur Waktu Layar Anak Saat Belajar Online",
    date: "2026-07-29",
    image: "/images/articles/cover-waktu-layar.webp",
    imageAlt: "Ilustrasi anak-anak dengan simbol jam dan lampu ide",
    excerpt:
      "Belajar online bermanfaat, tetapi waktu layar perlu diatur. Terapkan batasan sehat agar anak tetap fokus dan matanya terjaga.",
    category: "Tips Belajar",
    tags: ["belajar online", "waktu layar", "kesehatan"],
    author: tim,
    content: [
      {
        type: "p",
        text: "Kelas online memudahkan anak belajar dari rumah. Agar tetap sehat dan fokus, orang tua perlu membantu mengatur kapan dan bagaimana layar digunakan.",
      },
      { type: "h2", text: "Pisahkan layar untuk belajar dan hiburan" },
      {
        type: "p",
        text: "Sepakati bersama anak kapan layar dipakai untuk belajar dan kapan untuk hiburan. Batasan yang jelas mengurangi tawar-menawar setiap hari.",
      },
      { type: "h2", text: "Jaga posisi dan jeda" },
      {
        type: "list",
        items: [
          "Letakkan layar sejajar mata dengan jarak yang cukup.",
          "Gunakan ruangan yang terang.",
          "Ajak anak melihat jauh sejenak setiap 20 menit.",
        ],
      },
      { type: "h2", text: "Imbangi dengan aktivitas fisik" },
      {
        type: "p",
        text: "Setelah kelas online, ajak anak bergerak: bermain di luar, membantu pekerjaan rumah, atau berolahraga ringan. Tubuh yang aktif membantu anak lebih fokus di sesi berikutnya.",
      },
      {
        type: "tip",
        text: "Kelas online Partner Belajar dirancang dengan durasi yang ramah anak dan diselingi aktivitas interaktif agar anak tidak hanya menatap layar.",
      },
    ],
  },
  {
    id: "10",
    slug: "mengajarkan-adab-menuntut-ilmu-kepada-anak",
    title: "Mengajarkan Adab Menuntut Ilmu kepada Anak",
    date: "2026-07-22",
    image: "/images/articles/cover-adab.webp",
    imageAlt: "Ilustrasi anak Muslim belajar dengan tenang",
    excerpt:
      "Adab adalah pintu pertama sebelum ilmu. Kenalkan adab belajar kepada anak lewat contoh sederhana di rumah dan di kelas.",
    category: "Islami",
    tags: ["adab", "akhlak", "menuntut ilmu"],
    author: { name: "Ustadz Hamzah Abdullah", role: "Pengajar Tahfizh" },
    content: [
      {
        type: "p",
        text: "Para ulama terdahulu mendahulukan belajar adab sebelum belajar ilmu. Anak yang beradab akan lebih mudah menerima pelajaran, menghormati guru, dan menghargai teman.",
      },
      { type: "h2", text: "Adab sebelum belajar" },
      {
        type: "list",
        items: [
          "Meluruskan niat: belajar untuk mencari ridha Allah dan bermanfaat bagi orang lain.",
          "Berdoa sebelum memulai pelajaran.",
          "Menyiapkan alat belajar dan berpakaian rapi, termasuk saat kelas online.",
        ],
      },
      { type: "h2", text: "Adab kepada guru" },
      {
        type: "p",
        text: "Ajarkan anak untuk mengucapkan salam, mendengarkan saat guru berbicara, dan bertanya dengan sopan. Orang tua juga memberi contoh dengan berbicara baik tentang guru di depan anak.",
      },
      { type: "h2", text: "Adab terhadap ilmu" },
      {
        type: "p",
        text: "Ilmu dijaga dengan diulang dan diamalkan. Biasakan anak mengulang pelajaran singkat setelah kelas dan mempraktikkan satu hal yang ia pelajari hari itu.",
      },
      {
        type: "tip",
        text: "Buat “kartu adab” bergambar di sudut belajar anak sebagai pengingat sebelum kelas dimulai.",
      },
    ],
  },
];
