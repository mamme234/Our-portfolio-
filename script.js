// ============================================================
// DOM REFS
// ============================================================
const studentGrid = document.getElementById('studentGrid');
const searchInput = document.getElementById('studentSearch');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('profileModal');
const closeModal = document.getElementById('closeModal');
const profileContent = document.getElementById('profileContent');
const themeToggle = document.getElementById('themeToggle');

// ============================================================
// STATE
// ============================================================
let currentFilter = 'all';
let currentSearch = '';

// ============================================================
// RENDER STUDENTS
// ============================================================
function renderStudents() {
    let filtered = students.filter(s => {
        const matchName = s.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (s.nickname && s.nickname.toLowerCase().includes(currentSearch.toLowerCase()));
        if (currentFilter === 'all') return matchName;
        if (currentFilter === 'Men') return s.gender === 'Men' && matchName;
        return matchName;
    });

    studentGrid.innerHTML = filtered.map(s => `
            <div class="student-card glass" data-id="${s.id}">
                <div class="student-avatar">${s.name.split(' ').map(w => w[0]).join('')}</div>
                <div class="student-name">${s.name}</div>
                <div class="student-nickname">${s.nickname}</div>
                <div class="student-badge">${s.gender}</div>
            </div>
        `).join('');

    document.querySelectorAll('.student-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const student = students.find(s => s.id === id);
            if (student) openProfile(student);
        });
    });
}

// ============================================================
// OPEN PROFILE (profile/ routing style)
// ============================================================
function openProfile(s) {
    const initials = s.name.split(' ').map(w => w[0]).join('');
    const profileURL = `${window.location.origin}${window.location.pathname}profile/${s.id}`;

    profileContent.innerHTML = `
            <div class="profile-header">
                <div class="profile-avatar-lg">${initials}</div>
                <div class="profile-detail">
                    <h2>${s.name} <span class="nick">“${s.nickname}”</span></h2>
                    <div><i class="fas fa-mars"></i> ${s.gender}</div>
                    <div class="profile-tags">
                        <span class="tag"><i class="fas fa-heart"></i> ${s.favSubject}</span>
                        <span class="tag"><i class="fas fa-briefcase"></i> ${s.dreamCareer}</span>
                    </div>
                </div>
            </div>
            <p><strong>Bio:</strong> ${s.bio}</p>
            <div style="display:flex; flex-wrap:wrap; gap:1rem; margin:0.6rem 0;">
                <div><strong>Skills:</strong> ${s.skills.join(', ')}</div>
                <div><strong>Hobbies:</strong> ${s.hobbies.join(', ')}</div>
            </div>
            <div><strong>Certificates:</strong> ${s.certificates.join(', ')}</div>
            <div><strong>Projects:</strong> ${s.projects.join(', ')}</div>
            <div style="margin:0.6rem 0;"><i class="fas fa-share-alt"></i> ${s.social || 'N/A'}</div>
            <div class="qr-code"><i class="fas fa-qrcode"></i> QR: ${s.id} · ${s.name}</div>
            <div class="profile-url"><i class="fas fa-link"></i> ${profileURL}</div>
        `;
    modal.classList.add('open');

    // Update URL hash for profile routing
    window.location.hash = `profile/${s.id}`;
}

// ============================================================
// FILTER EVENTS
// ============================================================
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderStudents();
    });
});

// ============================================================
// SEARCH EVENT
// ============================================================
searchInput.addEventListener('input', function() {
    currentSearch = this.value;
    renderStudents();
});

// ============================================================
// MODAL CLOSE
// ============================================================
closeModal.addEventListener('click', () => {
    modal.classList.remove('open');
    window.location.hash = '';
});
modal.addEventListener('click', function(e) {
    if (e.target === this) {
        modal.classList.remove('open');
        window.location.hash = '';
    }
});

// ============================================================
// THEME TOGGLE
// ============================================================
themeToggle.addEventListener('click', function() {
    document.body.classList.toggle('light');
    this.innerHTML = document.body.classList.contains('light') ?
        '<i class="fas fa-sun"></i>' :
        '<i class="fas fa-moon"></i>';
});

// ============================================================
// ANIMATED COUNTERS
// ============================================================
function animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = Math.max(1, Math.floor(target / 60));
    const interval = duration / 60;
    const timer = setInterval(() => {
        start += step;
        if (start >= target) {
            start = target;
            clearInterval(timer);
        }
        el.textContent = start;
    }, interval);
}

// ============================================================
// HASH ROUTING — PROFILE/
// ============================================================
function handleHashRoute() {
    const hash = window.location.hash;
    if (hash.startsWith('#profile/')) {
        const id = parseInt(hash.split('/')[1]);
        if (!isNaN(id)) {
            const student = students.find(s => s.id === id);
            if (student) openProfile(student);
        }
    }
}

window.addEventListener('hashchange', handleHashRoute);

// ============================================================
// INIT
// ============================================================
renderStudents();

// Set stats
const total = students.length;
const men = students.filter(s => s.gender === 'Men').length;
const awards = 12;
const projects = 8;

animateCounter(document.getElementById('totalStudents'), total);
animateCounter(document.getElementById('totalMen'), men);
animateCounter(document.getElementById('awardsCount'), awards);
animateCounter(document.getElementById('projectsCount'), projects);

// Check hash on load
handleHashRoute();
