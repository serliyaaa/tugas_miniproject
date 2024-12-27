document.addEventListener('DOMContentLoaded', () => {
  const tableBody = document.querySelector('#kapal-table tbody');
  const addForm = document.getElementById('add-kapal-form');
  const editForm = document.getElementById('edit-kapal-form');

  // Fetch and display kapal data
  function fetchKapal() {
    fetch('/kapal')
      .then((response) => response.json())
      .then((data) => {
        tableBody.innerHTML = '';
        data.forEach((kapal) => {
          const row = document.createElement('tr');
          row.innerHTML = `
            <td>${kapal.id_kapal}</td>
            <td>${kapal.nama_kapal}</td>
            <td>${kapal.jenis_kapal}</td>
            <td>${kapal.kapasitas_muatan}</td>
            <td>
              <button onclick="editKapal(${kapal.id_kapal}, '${kapal.nama_kapal}', '${kapal.jenis_kapal}', ${kapal.kapasitas_muatan})">Edit</button>
              <button onclick="deleteKapal(${kapal.id_kapal})">Hapus</button>
            </td>
          `;
          tableBody.appendChild(row);
        });
      });
  }

  // Add kapal
  addForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const nama_kapal = document.getElementById('nama_kapal').value;
    const jenis_kapal = document.getElementById('jenis_kapal').value;
    const kapasitas_muatan = document.getElementById('kapasitas_muatan').value;

    fetch('/kapal', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_kapal, jenis_kapal, kapasitas_muatan }),
    })
      .then(() => {
        fetchKapal();
        addForm.reset();
      })
      .catch((error) => console.error('Error:', error));
  });

  // Edit kapal
  window.editKapal = (id, nama, jenis, kapasitas) => {
    document.getElementById('edit_id_kapal').value = id;
    document.getElementById('edit_nama_kapal').value = nama;
    document.getElementById('edit_jenis_kapal').value = jenis;
    document.getElementById('edit_kapasitas_muatan').value = kapasitas;

    editForm.style.display = 'block';
    window.scrollTo(0, document.body.scrollHeight);
  };

  // Submit edit form
  editForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const id = document.getElementById('edit_id_kapal').value;
    const nama_kapal = document.getElementById('edit_nama_kapal').value;
    const jenis_kapal = document.getElementById('edit_jenis_kapal').value;
    const kapasitas_muatan = document.getElementById('edit_kapasitas_muatan').value;

    fetch(`/kapal/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ nama_kapal, jenis_kapal, kapasitas_muatan }),
    })
      .then(() => {
        fetchKapal();
        editForm.reset();
        editForm.style.display = 'none';
      })
      .catch((error) => console.error('Error:', error));
  });

  // Delete kapal
  window.deleteKapal = (id) => {
    fetch(`/kapal/${id}`, { method: 'DELETE' })
      .then(() => fetchKapal())
      .catch((error) => console.error('Error:', error));
  };

  fetchKapal();
});
