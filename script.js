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

    // --- SIMULASI DATABASE ---
    // Di aplikasi nyata, data ini akan datang dari server/database
    const studentsDB = {
        "3322110016": { 
            password: "040703", 
            name: "Muhammad Taufiqul Aziz", 
            courses: [
                { 
                    code: "TIF201", name: "Media Pembelajaran", time: "07.55 - 09:40", lecturer: "R. Irlanto Sudomo, M.pd",
                    materials: [
                        { title: "Pertemuan 1: Konsep Dasar Media Pembelajaran", url: "https://ejurnal.stie-trianandra.ac.id/index.php/jsr/article/view/993" },
                        { title: "Pertemuan 2: Jenis-jenis Media Pembelajaran", url: "https://fkip.umsu.ac.id/media-pembelajaran-dan-jenis-jenisnya/" }
                    ]
                },
                { 
                    code: "TIF203", name: "E-Commerce & Fintech", time: "09.45 - 11:30", lecturer: "Didin H., S.Kom., M.Kom",
                    materials: [
                        { title: "Pertemuan 1: Pengertian, Jenis dan manfaat E-Commerce", url: "https://developers.bri.co.id/id/news/ketahui-perkembangan-e-commerce-di-indonesia-pengertian-jenis-dan-manfaatnya" },
                        { title: "Pertemuan 2: Keamanan Data Dalam E-Commerce", url: "https://csirt.teknokrat.ac.id/keamanan-dalam-e-commerce-melindungi-data-pelanggan-anda/" }
                    ]
                },
                { 
                    code: "MKU101", name: "Manajemen Inovasi & Teknologi", time: "12.30 - 14.30", lecturer: "Dr. Sena Mahendra, S.T., M.T.",
                    materials: [
                        { title: "Pertemuan 1: Strategi Inovasi Untuk Mencapai Keunggulan Bersaing", url: "https://www.neliti.com/id/publications/255709/strategi-inovasi-produk-dalam-mencapai-keunggulan-kompetitif" },
                        
                    ] // Contoh mata kuliah tanpa materi
                }
            ] 
        },
        "3322110013": { 
            password: "311004", 
            name: "Alfonsius Joifan Sar",
            courses: [
                { 
                    code: "PBI102", name: "Jaringan Komputer", time: "08:00 - 09:40", lecturer: "Lingga Kurnia Dhani, M.Kom",
                    materials: [
                        { title: "Chapter 1: Introduction to Networking", url: "#download-link-4" },
                        { title: "Chapter 2: Network Protocols", url: "#download-link-5" }
                    ]
                },
                { 
                    code: "PBI105", name: "Pemrograman Dasar", time: "10:00 - 11:40", lecturer: "Dr. Maria, S.S., M.Pd",
                    materials: [
                        { title: "Introduction to Basic Programming", url: "#download-link-6" }
                    ]
                }
            ]
        }
    };

    // --- EVENT LISTENER UNTUK LOGIN ---
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

    // --- FUNGSI UNTUK MENAMPILKAN PANEL ABSENSI (DIPERBARUI) ---
    function showAbsensiPanel(user, nim) {
        loginSection.classList.add('hidden');
        absensiSection.classList.remove('hidden');
        studentNameEl.textContent = user.name;
        studentNimEl.textContent = nim;
        courseListEl.innerHTML = '';

        user.courses.forEach(course => {
            const courseItem = document.createElement('div');
            courseItem.className = 'course-item';
            
            // Membuat HTML untuk detail mata kuliah dan aksi absensi
            let courseHTML = `
                <div class="course-main">
                    <div class="course-details">
                        <h5>${course.name} (${course.code})</h5>
                        <p>Pukul: ${course.time} | Dosen: ${course.lecturer}</p>
                    </div>
                    <div class="course-action">
                        <p class="status">Belum Absen</p>
                        <button class="absen-btn" data-code="${course.code}">Hadir</button>
                    </div>
                </div>
            `;
            
            // === PENAMBAHAN BAGIAN MATERI ===
            if (course.materials && course.materials.length > 0) {
                let materialsHTML = '<ul class="material-list">';
                course.materials.forEach(material => {
                    materialsHTML += `
                        <li class="material-item">
                            <a href="${material.url}" target="_blank">${material.title}</a>
                            <i class="fas fa-download download-icon"></i>
                        </li>
                    `;
                });
                materialsHTML += '</ul>';

                courseHTML += `
                    <div class="material-section">
                        <h6>Materi Perkuliahan:</h6>
                        ${materialsHTML}
                    </div>
                `;
            }
            // === AKHIR PENAMBAHAN ===

            courseItem.innerHTML = courseHTML;
            courseListEl.appendChild(courseItem);
        });
    }

    // --- EVENT LISTENER UNTUK TOMBOL HADIR (delegasi event) ---
    courseListEl.addEventListener('click', function(event) {
        if (event.target.classList.contains('absen-btn')) {
            const button = event.target;
            const courseMain = button.closest('.course-main');
            const statusEl = courseMain.querySelector('.status');
            
            button.textContent = 'Sudah Absen';
            button.disabled = true;
            statusEl.textContent = `Hadir tercatat pada ${new Date().toLocaleTimeString('id-ID')}`;
            statusEl.style.color = 'var(--success-color)';
            statusEl.style.fontWeight = 'bold';
        }
    });

    // --- EVENT LISTENER UNTUK LOGOUT ---
    logoutBtn.addEventListener('click', function() {
        loginSection.classList.remove('hidden');
        absensiSection.classList.add('hidden');
        loginForm.reset();
        loginError.textContent = '';
    });
});
