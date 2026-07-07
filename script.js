// ===== DOM REFS =====
const studentGrid = document.getElementById('studentGrid');
const searchInput = document.getElementById('studentSearch');
const filterBtns = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('profileModal');
const closeModal = document.getElementById('closeModal');
const profileContent = document.getElementById('profileContent');

// ===== STATE =====
let currentFilter = 'all';
let currentSearch = '';

// ===== RENDER STUDENTS =====
function renderStudents() {
    let filtered = students.filter(s => {
        const matchName = s.name.toLowerCase().includes(currentSearch.toLowerCase()) ||
            (s.nickname && s.nickname.toLowerCase().includes(currentSearch.toLowerCase()));
        if (currentFilter === 'all') return matchName;
        if (currentFilter === 'boy' || currentFilter === 'girl') return s.gender === currentFilter && matchName;
        if (currentFilter === 'sectionA') return s.section === 'A' && matchName;
        return matchName;
    });

    studentGrid.innerHTML = filtered.map(s => `
        <div class="student-card glass" data-id="${s.id}">
            <div class="student-avatar">${s.name.split(' ').map(w => w[0]).join('')}</div>
            <div class="student-name">${s.name}</div>
            <div class="student-badge">${s.gender} · ${s.section}</div>
        </div>
    `).join('');

    // Attach click listeners
    document.querySelectorAll('.student-card').forEach(card => {
        card.addEventListener('click', function() {
            const id = parseInt(this.dataset.id);
            const student = students.find(s => s.id === id);
            if (student) openProfile(student);
        });
    });
}

// ===== OPEN PROFILE =====
function openProfile(s) {
    const initials = s.name.split(' ').map(w => w[0]).join('');
    profileContent.innerHTML = `
        <div class="profile-header">
            <div class="profile-avatar-lg">${initials}</div>
            <div class="profile-detail">
                <h2>${s.name} <span style="font-weight:400;">${s.nickname ? '“'+s.nickname+'”' : ''}</span></h2>
                <div><i class="fas fa-venus-mars"></i> ${s.gender} · Section ${s.section}</div>
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
        <div><strong>Projects (case study):</strong> ${s.projects.join(', ')}</div>
        <div style="margin:0.6rem 0;"><i class="fas fa-share-alt"></i> ${s.social || 'N/A'}</div>
        <div class="qr-code"><i class="fas fa-qrcode"></i> QR: ${s.id} · ${s.name}</div>
        <div class="accessibility-note">
            <i class="fas fa-universal-access"></i> Accessibility: high contrast, keyboard navigable
        </div>
    `;
    modal.classList.add('open');
}

// ===== FILTER EVENTS =====
filterBtns.forEach(btn => {
    btn.addEventListener('click', function() {
        filterBtns.forEach(b => b.classList.remove('active'));
        this.classList.add('active');
        currentFilter = this.dataset.filter;
        renderStudents();
    });
});

// ===== SEARCH EVENT =====
searchInput.addEventListener('input', function() {
    currentSearch = this.value;
    renderStudents();
});

// ===== MODAL CLOSE =====
closeModal.addEventListener('click', () => modal.classList.remove('open'));
modal.addEventListener('click', function(e) {
    if (e.target === this) modal.classList.remove('open');
});

// ===== DARK/LIGHT TOGGLE =====
const adminBtn = document.getElementById('adminToggle');
adminBtn.addEventListener('click', function() {
    document.body.classList.toggle('light');
    this.innerHTML = document.body.classList.contains('light') ?
        '<i class="fas fa-moon"></i> Dark' :
        '<i class="fas fa-sun"></i> Light';
});

// ===== ANIMATED COUNTERS =====
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

// ===== INIT =====
renderStudents();

// Set stats and animate
const total = students.length;
const boys = students.filter(s => s.gender === 'boy').length;
const girls = students.filter(s => s.gender === 'girl').length;
const awards = 12;
const projects = 8;

animateCounter(document.getElementById('totalStudents'), total);
animateCounter(document.getElementById('boysCount'), boys);
animateCounter(document.getElementById('girlsCount'), girls);
animateCounter(document.getElementById('awardsCount'), awards);
animateCounter(document.getElementById('projectsCount'), projects);
