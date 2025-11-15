const candidates = [
    {
        id: 1,
        name: "Mochammad Aldhira Aryawan",
        class: "XI PPLG 2",
        image: "img/calon1.jpg",
        vision: "Membentuk OSIS yang berintegritas, kreatif, dan dekat dengan siswa serta mewujudkan lingkungan sekolah yang nyaman dan inovatif."
    },
    {
        id: 2,
        name: "Raditya Bambang Satriya",
        class: "XI PPLG 1",
        image: "img/calon2.jpg",
        vision: "Menjadikan OSIS sebagai organisasi yang modern, terbuka, dan mampu menjadi contoh positif bagi seluruh siswa."
    },
    {
        id: 3,
        name: "Yoga Rizki Pratama",
        class: "XI PPLG 2",
        image: "img/calon3.png",
        vision: "Mewujudkan OSIS yang solid, kreatif, dan berperan aktif dalam membangun suasana sekolah yang lebih maju dan menyenangkan."
    },
    {
        id: 4,
        name: "Muhammad Farhan Aqila Ramadhan",
        class: "XI PPLG 1",
        image: "img/calon4.png",
        vision: "Membangun OSIS yang inovatif, responsif, dan mampu menjadi jembatan komunikasi yang efektif antara siswa, guru, dan pihak sekolah."
    }
];

let selectedCandidate = null;
let votingData = {
    votes: { 1: 0, 2: 0, 3: 0, 4: 0 },
    totalVotes: 0,
    votingClosed: false,
    finalResults: null
};

document.addEventListener('DOMContentLoaded', function() {
    loadVotingData();
    renderCandidates();
    updateVotingStatus();
    updateResults();
    updateVoteCounters();
    setupMobileMenu();
});

function loadVotingData() {
    const savedData = localStorage.getItem('osisVotingData');
    if (savedData) {
        votingData = JSON.parse(savedData);
    }
}

function saveVotingData() {
    localStorage.setItem('osisVotingData', JSON.stringify(votingData));
}

function renderCandidates() {
    const grid = document.getElementById('candidatesGrid');
    grid.innerHTML = '';

    candidates.forEach(candidate => {
        const candidateHTML = `
            <div class="candidate-card" id="candidate-${candidate.id}">
                <div class="candidate-number">${candidate.id}</div>
                <img src="${candidate.image}" alt="${candidate.name}" class="candidate-image">
                <div class="candidate-info">
                    <h3>${candidate.name}</h3>
                    <p class="class">${candidate.class}</p>
                    <p class="vision">${candidate.vision}</p>
                    <div class="vote-counter" id="counter-${candidate.id}">
                        <span class="count">${votingData.votes[candidate.id]}</span>
                        <span>suara</span>
                    </div>
                    <button class="vote-button" onclick="selectCandidate(${candidate.id})">
                        Pilih Kandidat Ini
                    </button>
                </div>
            </div>
        `;
        grid.innerHTML += candidateHTML;
    });
}

function selectCandidate(candidateId) {
    if (votingData.votingClosed) {
        alert('Voting sudah ditutup! Lihat hasil final di bawah.');
        return;
    }

    const candidate = candidates.find(c => c.id === candidateId);
    
    const confirmMessage = `Apakah Anda yakin memilih "${candidate.name}" dari ${candidate.class}?`;
    
    if (confirm(confirmMessage)) {
        votingData.votes[candidateId]++;
        votingData.totalVotes++;

        saveVotingData();

        renderCandidates();
        updateVotingStatus();
        updateResults();
        updateVoteCounters();

        alert(`Vote berhasil untuk "${candidate.name}"!`);
    }
}

function confirmVote() {
    if (!selectedCandidate) {
        alert('Silakan pilih kandidat terlebih dahulu!');
        return;
    }

    if (votingData.votingClosed) {
        alert('Voting sudah ditutup!');
        return;
    }

    const candidate = candidates.find(c => c.id === selectedCandidate);
    const confirmMessage = `Apakah Anda yakin memilih "${candidate.name}"?`;
    
    if (confirm(confirmMessage)) {
        votingData.votes[selectedCandidate]++;
        votingData.totalVotes++;

        saveVotingData();

        selectedCandidate = null;
        document.querySelectorAll('.candidate-card').forEach(card => {
            card.classList.remove('selected');
        });

        renderCandidates();
        updateVotingStatus();
        updateResults();
        updateVoteCounters();

        document.getElementById('confirmVoteBtn').disabled = true;

        alert(`Vote berhasil untuk "${candidate.name}"!`);
    }
}

function updateVotingStatus() {
    const statusText = document.getElementById('statusText');
    const totalVotes = document.getElementById('totalVotes');

    if (votingData.votingClosed) {
        statusText.textContent = 'Voting telah ditutup - Lihat hasil final di bawah';
        statusText.style.color = '#dc3545';
        statusText.style.fontWeight = 'bold';
    } else {
        statusText.textContent = 'Klik "Pilih Kandidat Ini" untuk langsung vote';
        statusText.style.color = '#28a745';
        statusText.style.fontWeight = 'normal';
    }

    totalVotes.textContent = votingData.totalVotes;
}

function updateVoteCounters() {
    candidates.forEach(candidate => {
        const counter = document.getElementById(`counter-${candidate.id}`);
        if (counter) {
            const countSpan = counter.querySelector('.count');
            countSpan.textContent = votingData.votes[candidate.id];
        }
    });
}

function updateResults() {
    const voteStats = document.getElementById('voteStats');
    const winnerAnnouncement = document.getElementById('winnerAnnouncement');
    
    voteStats.innerHTML = '';
    
    const sortedCandidates = candidates.map(candidate => ({
        ...candidate,
        votes: votingData.votes[candidate.id],
        percentage: votingData.totalVotes > 0 ? (votingData.votes[candidate.id] / votingData.totalVotes * 100) : 0
    })).sort((a, b) => b.votes - a.votes);

    sortedCandidates.forEach(candidate => {
        const statHTML = `
            <div class="stat-card">
                <div class="stat-number">${candidate.votes}</div>
                <div class="stat-label">${candidate.name}</div>
                <div class="progress-bar">
                    <div class="progress-fill" style="width: ${candidate.percentage}%">
                        <div class="progress-text">${candidate.percentage.toFixed(1)}%</div>
                    </div>
                </div>
            </div>
        `;
        voteStats.innerHTML += statHTML;
    });

    if (votingData.votingClosed && votingData.finalResults) {
        displayFinalResults();
    } else if (votingData.totalVotes > 0) {
        const winner = sortedCandidates[0];
        winnerAnnouncement.innerHTML = `
            <div class="winner-announcement">
                <h3>PEMENANG SEMENTARA</h3>
                <p><strong>${winner.name}</strong></p>
                <p>${winner.class}</p>
                <p>${winner.votes} suara (${winner.percentage.toFixed(1)}%)</p>
            </div>
        `;
    } else {
        winnerAnnouncement.innerHTML = '';
    }
}

function closeVoting() {
    const password = prompt('Masukkan password untuk menutup voting:');
    
    if (password === 'kuyhaa') {
        if (votingData.totalVotes === 0) {
            alert('Tidak ada suara yang masuk! Minimal harus ada 1 suara untuk menutup voting.');
            return;
        }

        const confirmMessage = `Total suara: ${votingData.totalVotes}\n\nApakah Anda yakin ingin menutup voting dan menentukan posisi OSIS final?\n\nSetelah ditutup, tidak ada yang bisa vote lagi!`;
        
        if (confirm(confirmMessage)) {
            const sortedCandidates = candidates.map(candidate => ({
                ...candidate,
                votes: votingData.votes[candidate.id]
            })).sort((a, b) => b.votes - a.votes);

            const positions = ['Ketua OSIS', 'Wakil Ketua OSIS', 'Sekretaris OSIS', 'Bendahara OSIS'];
            
            votingData.finalResults = sortedCandidates.map((candidate, index) => ({
                ...candidate,
                position: positions[index] || `Anggota OSIS ${index + 1}`,
                rank: index + 1
            }));

            votingData.votingClosed = true;
            saveVotingData();

            renderCandidates();
            updateVotingStatus();
            updateResults();

            document.querySelectorAll('.vote-button').forEach(btn => {
                btn.disabled = true;
                btn.textContent = 'Voting Ditutup';
            });

            alert('Voting telah ditutup! Lihat hasil final di bawah.');
        }
    } else if (password !== null) {
        alert('Password salah!');
    }
}

function displayFinalResults() {
    const winnerAnnouncement = document.getElementById('winnerAnnouncement');
    
    let finalHTML = `
        <div class="final-results">
            <h2 style="color: #0C2B4E; margin-bottom: 30px; text-align: center;">
                HASIL FINAL PEMILIHAN OSIS 2025-2026
            </h2>
            <div class="positions-grid">
    `;

    votingData.finalResults.forEach((candidate, index) => {
        const medalEmoji = index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : '🏅';
        const positionColor = index === 0 ? '#FFD700' : index === 1 ? '#C0C0C0' : index === 2 ? '#CD7F32' : '#0C2B4E';
        
        finalHTML += `
            <div class="position-card" style="border-left: 5px solid ${positionColor};">
                <div class="position-header">
                    <span class="medal">${medalEmoji}</span>
                    <h3 style="color: ${positionColor};">${candidate.position}</h3>
                </div>
                <div class="candidate-final-info">
                    <h4>${candidate.name}</h4>
                    <p class="candidate-class">${candidate.class}</p>
                    <p class="vote-count">${candidate.votes} suara (${((candidate.votes / votingData.totalVotes) * 100).toFixed(1)}%)</p>
                </div>
            </div>
        `;
    });

    finalHTML += `
            </div>
            <div class="congratulations" style="margin-top: 30px; text-align: center; padding: 20px; background-color: #f8f9fa; border-radius: 10px; border-left: 5px solid #28a745;">
                <p style="margin: 0; color: #0C2B4E; font-weight: bold;">
                    Selamat kepada pengurus OSIS terpilih!<br>
                    Semoga dapat menjalankan amanah dengan baik.
                </p>
            </div>
        </div>
    `;

    winnerAnnouncement.innerHTML = finalHTML;
}

function resetVoting() {
    const password = prompt('Masukkan password untuk reset voting:');
    
    if (password === 'kuyhaa') {
        if (confirm('Apakah Anda yakin ingin mereset semua data voting?\n\nIni akan menghapus semua suara yang telah masuk!')) {
            localStorage.removeItem('osisVotingData');
            votingData = {
                votes: { 1: 0, 2: 0, 3: 0, 4: 0 },
                totalVotes: 0,
                votingClosed: false,
                finalResults: null
            };
            selectedCandidate = null;
            
            renderCandidates();
            updateVotingStatus();
            updateResults();
            updateVoteCounters();
            
            document.getElementById('confirmVoteBtn').disabled = true;
            
            alert('Data voting telah direset!');
        }
    } else if (password !== null) {
        alert('Password salah!');
    }
}

function setupMobileMenu() {
    const toggleBtn = document.getElementById('menu-toggle');
    const mobileMenu = document.getElementById('mobile-menu');

    function closeMobileMenu() {
        mobileMenu.classList.add('closing');
        setTimeout(() => {
            mobileMenu.classList.remove('show', 'closing');
            toggleBtn.classList.remove('active');
            toggleBtn.innerHTML = '&#9776;';
        }, 300);
    }

    function openMobileMenu() {
        mobileMenu.classList.add('show');
        toggleBtn.classList.add('active');
        toggleBtn.innerHTML = '×';
    }

    toggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        
        if (mobileMenu.classList.contains('show')) {
            closeMobileMenu();
        } else {
            openMobileMenu();
        }
    });

    document.addEventListener('click', (e) => {
        if (!toggleBtn.contains(e.target) && !mobileMenu.contains(e.target) && mobileMenu.classList.contains('show')) {
            closeMobileMenu();
        }
    });

    const mobileNavLinks = document.querySelectorAll('.mobile-menu a');
    mobileNavLinks.forEach(link => {
        link.addEventListener('click', () => {
            closeMobileMenu();
        });
    });
}
