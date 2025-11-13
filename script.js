const dataCalon = [
    { nama: 'Hu Tao', nomor: 1 },
    { nama: 'Phoebe', nomor: 2 },
    { nama: 'Ryo Yamada', nomor: 3 }
];

let suaraCalon1 = 0;
let suaraCalon2 = 0;
let suaraCalon3 = 0;
let votingDitutup = false;

function vote(nomorCalon) {
    if (votingDitutup === true) {
        alert('Voting sudah ditutup, Lihat hasil pemenang di bawah.');
        return;
    }
    
    if (nomorCalon === 1) {
        suaraCalon1 += 1;
        document.getElementById('suara1').textContent = suaraCalon1;
    } else if (nomorCalon === 2) {
        suaraCalon2 += 1;
        document.getElementById('suara2').textContent = suaraCalon2;
    } else if (nomorCalon === 3) {
        suaraCalon3 += 1;
        document.getElementById('suara3').textContent = suaraCalon3;
    }
    
    let totalSuara = suaraCalon1 + suaraCalon2 + suaraCalon3;
    
    document.getElementById('totalVote').textContent = totalSuara;
    
    // alert(`Vote berhasil untuk ${dataCalon[nomorCalon - 1].nama}. Total suara sekarang: ${totalSuara}`);
}

function tutupVoting() {
    let totalSuara = suaraCalon1 + suaraCalon2 + suaraCalon3;
    
    if (totalSuara === 0) {
        alert('Belum ada suara yang masuk, Minimal harus ada 1 suara untuk menutup voting.');
        return;
    }
    
    let konfirmasi = confirm(`Total suara: ${totalSuara}. Yakin ingin menutup voting dan melihat pemenang?`);
    
    if (!konfirmasi) {
        return;
    }
    
    votingDitutup = true;
    
    let tombolVote = document.querySelectorAll('.btn-vote');
    for (let i = 0; i < tombolVote.length; i++) {
        tombolVote[i].disabled = true;
    }
    
    document.getElementById('btnTutup').disabled = true;
    
    let persenCalon1 = (suaraCalon1 / totalSuara) * 100;
    let persenCalon2 = (suaraCalon2 / totalSuara) * 100;
    let persenCalon3 = (suaraCalon3 / totalSuara) * 100;
    
    let pemenang = '';
    let suaraTerbanyak = 0;
    let nomorPemenang = 0;
    
    if (suaraCalon1 > suaraCalon2 && suaraCalon1 > suaraCalon3) {
        pemenang = dataCalon[0].nama;
        suaraTerbanyak = suaraCalon1;
        nomorPemenang = 1;
    } else if (suaraCalon2 > suaraCalon1 && suaraCalon2 > suaraCalon3) {
        pemenang = dataCalon[1].nama;
        suaraTerbanyak = suaraCalon2;
        nomorPemenang = 2;
    } else if (suaraCalon3 > suaraCalon1 && suaraCalon3 > suaraCalon2) {
        pemenang = dataCalon[2].nama;
        suaraTerbanyak = suaraCalon3;
        nomorPemenang = 3;
    } else {
        pemenang = 'SERI (Ada yang sama suaranya)';
        suaraTerbanyak = Math.max(suaraCalon1, suaraCalon2, suaraCalon3);
    }
    
    let selisihSuara = 0;
    if (nomorPemenang === 1) {
        selisihSuara = suaraCalon1 - Math.max(suaraCalon2, suaraCalon3);
    } else if (nomorPemenang === 2) {
        selisihSuara = suaraCalon2 - Math.max(suaraCalon1, suaraCalon3);
    } else if (nomorPemenang === 3) {
        selisihSuara = suaraCalon3 - Math.max(suaraCalon1, suaraCalon2);
    }
    
    let hasilDiv = document.getElementById('hasil');
    hasilDiv.style.display = 'block';
    
    hasilDiv.innerHTML = `
        <h2>HASIL AKHIR PEMILIHAN KETUA OSIS 2025</h2>
        <hr>
        <p><strong>Total Suara Masuk:</strong> ${totalSuara} suara</p>
        <hr>
        <h3>Perolehan Suara:</h3>
        <p><strong>Calon 1 - ${dataCalon[0].nama}:</strong> ${suaraCalon1} suara (${persenCalon1.toFixed(1)}%)</p>
        <p><strong>Calon 2 - ${dataCalon[1].nama}:</strong> ${suaraCalon2} suara (${persenCalon2.toFixed(1)}%)</p>
        <p><strong>Calon 3 - ${dataCalon[2].nama}:</strong> ${suaraCalon3} suara (${persenCalon3.toFixed(1)}%)</p>
        <hr>
        <h2>KETUA OSIS TERPILIH: ${pemenang}</h2>
        <p><strong>Suara Terbanyak:</strong> ${suaraTerbanyak} suara</p>
        ${selisihSuara > 0 ? `<p><strong>Selisih:</strong> ${selisihSuara} suara dari pesaing terdekat</p>` : ''}
        <hr>
        <p style="text-align: center; font-style: italic;">Selamat kepada Ketua OSIS terpilih!</p>
    `;
    
    hasilDiv.scrollIntoView({ behavior: 'smooth' });
}
