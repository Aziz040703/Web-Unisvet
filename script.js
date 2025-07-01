document.addEventListener('DOMContentLoaded', function() {

    // --- ELEMEN DOM ---
    const loginSection = document.getElementById('login-section');
    const absensiSection = document.getElementById('absensi-section');
    const loginForm = document.getElementById('login-form');
    const loginError = document.getElementById('login-error');
    const logoutBtn = document.getElementById('logout-btn');
    const studentNameEl = document.getElementById('student-name');
    const studentNimEl = document.getElementById('student-nim');
    const courseListEl = document.getElementById('course-list');
    const materiGridEl = document.getElementById('materi-grid');
    const personalMateriListEl = document.getElementById('personal-materi-list');

    // --- DATABASE MAHASISWA ---
    const studentsDB = {
        "3322110016": {
            password: "040703",
            name: "Muhammad Taufiqul Aziz",
            courses: [{
                code: "TIF201",
                name: "Dasar Pemrograman",
                time: "08:00 - 09:40",
                lecturer: "Handini Arga Damar Rani, M.Kom",
                materials: [{
                    title: "Slide 01 - Pengenalan Algoritma",
                    url: "https://www.gramedia.com/literasi/pengertian-algoritma/"
                }, {
                    title: "Modul Praktikum - Variabel & Tipe Data",
                    url: "https://id.scribd.com/document/453300667/MODUL-1-variabel-dan-tipe-data-pdf"
                }, {
                    title: "Contoh Kode Program Pertemuan 1",
                    url: "https://www.google.com/search?q=Contoh+Kode+Program+Pertemuan+1&ie=UTF-8"
                }]
            }, {
                code: "MKU101",
                name: "Media Pembelajaran",
                time: "13:00 - 14:40",
                lecturer: "R.Irlanto Sudomo, M.Pd",
                materials: [{
                    title: "Slide 01 - Macam-Macam Media Pembelajaran dan jenis jenis nya ",
                    url: "https://fkip.umsu.ac.id/media-pembelajaran-dan-jenis-jenisnya/"
                }, {
                     title: "cara mengembangkan dan memanfaatkan media dalam pembelajaran",
                    url: "https://lmsspada.kemdiktisaintek.go.id/mod/book/tool/print/index.php?id=113974"
            }]
        },
        "3322110015": {
            password: "161002",
            name: "Heri Mulyono",
            courses: [{
                code: "PBI112",
                name: "Pengolahan Data Terdistribusi",
                time: "08:00 - 09:40",
                lecturer: "Afis Pratama,S.T.,M.pd",
                materials: [{
                    title: "Chapter 1:  jenis-jenis sistem terdistribusi",
                    url: "https://www.atlassian.com/microservices/microservices-architecture/distributed-architecture"
                }, {
                    title: "Pengenalan Sistem Terdistribusi",
                    url: "https://www.atlassian.com/microservices/microservices-architecture/distributed-architecture"
                }]
            }, {
                code: "PBI105",
                name: "E-commerce dan fintech",
                time: "10:00 - 11:40",
                lecturer: "Didin H.,S.Kom.,M.Kom",
                materials: [{
                    title: "Pengertian, Jenis dan Manfaat E-commerce"
                    url: "https://developers.bri.co.id/id/news/ketahui-perkembangan-e-commerce-di-indonesia-pengertian-jenis-dan-manfaatnya"
            }]
        }
    };

    // --- DATABASE MATERI PUBLIK ---
    const publicMaterialsDB = [{
        code: "UMUM01",
        name: "Panduan Akademik Mahasiswa Baru",
        materials: [{
            title: "Statuta dan Peraturan Akademik 2025",
            url: "https://www.google.com/search?q=Statuta+dan+Peraturan+Akademik+2025&ie=UTF-8"
        }, {
            title: "Panduan Penggunaan Sistem Informasi Akademik",
            url: "https://akademik.stikma.ac.id/wp-content/uploads/2021/02/Panduan-SIAKAD-STIKMA.pdf"
        }]
    }, {
        code: "TIF201",
        name: "Dasar Pemrograman (Materi Terbuka)",
        materials: [{
            title: "Slide 01 - Pengenalan Algoritma",
            url: "https://www.gramedia.com/literasi/pengertian-algoritma/"
        }, {
            title: "Video - Instalasi Tools Pemrograman",
            url: "https://youtu.be/ajmQOogvw0Y?si=V4iODsgJt3UB_GUH"
        }]
    }, {
        code: "PBI102",
        name: "Structure II (Materi Terbuka)",
        materials: [{
            title: "Chapter 1: Tenses Review",
            url: "https://id.scribd.com/document/616914576/Review-on-Tenses"
        }]
    }];

    // --- FUNGSI TAMPILKAN MATERI PUBLIK ---
    function displayPublicMaterials() {
        let content = '';
        publicMaterialsDB.forEach(course => {
            let materialLinks = '';
            course.materials.forEach(material => {
                materialLinks += `<li><a href="${material.url}" target="_blank">${material.title}</a></li>`;
            });
            content += `
                <div class="materi-card">
                    <div class="materi-card-header">
                        <h3>${course.name}<span class="course-code-tag">${course.code}</span></h3>
                    </div>
                    <div class="materi-card-body">
                        <ul class="materi-list">
                            ${materialLinks}
                        </ul>
                    </div>
                </div>
            `;
        });
        materiGridEl.innerHTML = content;
    }

    // --- FUNGSI TAMPILKAN PANEL ABSENSI ---
    function showAbsensiPanel(user, nim) {
        loginSection.classList.add('hidden');
        absensiSection.classList.remove('hidden');
        studentNameEl.textContent = user.name;
        studentNimEl.textContent = nim;

        courseListEl.innerHTML = '';
        user.courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';
            courseItem.innerHTML = `
                <div class="course-details">
                    <h5>${course.name} (${course.code})</h5>
                    <p>Pukul: ${course.time} | Dosen: ${course.lecturer}</p>
                </div>
                <div class="course-action">
                    <p class="status">Belum Absen</p>
                    <button class="absen-btn" data-code="${course.code}">Hadir</button>
                </div>
            `;
            courseListEl.appendChild(courseItem);
        });

        let personalContent = '';
        user.courses.forEach(course => {
            if (course.materials && course.materials.length > 0) {
                let materialLinks = '';
                course.materials.forEach(material => {
                    materialLinks += `<li><a href="${material.url}" target="_blank">${material.title}</a></li>`;
                });
                personalContent += `
                    <div class="materi-card">
                        <div class="materi-card-header">
                            <h3>${course.name}<span class="course-code-tag">${course.code}</span></h3>
                        </div>
                        <div class="materi-card-body">
                            <ul class="materi-list">
                                ${materialLinks}
                            </ul>
                        </div>
                    </div>
                `;
            }
        });
        if (personalContent === '') {
            personalContent = '<p>Belum ada materi yang tersedia untuk mata kuliah Anda saat ini.</p>';
        }
        personalMateriListEl.innerHTML = personalContent;
    }

    // --- EVENT LISTENERS ---
    loginForm.addEventListener('submit', function(event) {
        event.preventDefault();
        const nim = document.getElementById('nim').value;
        const password = document.getElementById('password').value;
        loginError.textContent = '';
        const user = studentsDB[nim];
        if (user && user.password === password) {
            showAbsensiPanel(user, nim);
        } else {
            loginError.textContent = 'NIM atau Password salah. Silakan coba lagi.';
        }
    });

    courseListEl.addEventListener('click', function(event) {
        if (event.target.classList.contains('absen-btn')) {
            const button = event.target;
            const courseItem = button.closest('.course-item');
            const statusEl = courseItem.querySelector('.status');
            button.textContent = 'Sudah Absen';
            button.disabled = true;
            statusEl.textContent = `Hadir tercatat pada ${new Date().toLocaleTimeString('id-ID')}`;
            statusEl.style.color = 'var(--success-color)';
            statusEl.style.fontWeight = 'bold';
        }
    });

    logoutBtn.addEventListener('click', function() {
        loginSection.classList.remove('hidden');
        absensiSection.classList.add('hidden');
        loginForm.reset();
        loginError.textContent = '';
        studentNameEl.textContent = '';
        studentNimEl.textContent = '';
        courseListEl.innerHTML = '';
        personalMateriListEl.innerHTML = '';
    });

    // PANGGIL FUNGSI SAAT HALAMAN DIBUKA
    displayPublicMaterials();
});
