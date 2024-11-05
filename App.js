import { Actor, HttpAgent } from '@dfinity/agent';
import { idlFactory as cloudStorageIdl } from './cloud_storage_idl.js';

// Definisikan Canister ID untuk cloud_storage
const agent = new HttpAgent({ host: 'https://ic0.app' });
const cloudStorageActor = Actor.createActor(cloudStorageIdl, {
  agent,
  canisterId: 'your_canister_id_here', // Ganti dengan canister ID yang benar
});

// Fungsi upload file
async function uploadFile() {
  const fileInput = document.getElementById('fileInput');
  const file = fileInput.files[0];

  if (!file) {
    alert("No file selected!");
    return;
  }

  const name = file.name;
  const size = file.size;
  const date_uploaded = new Date().toISOString();

  // Upload file ke canister
  await cloudStorageActor.upload_file(name, size, date_uploaded);

  alert(`File ${name} uploaded successfully!`);
}

// Fungsi untuk mendapatkan metadata file
async function getFileMetadata() {
  const fileName = document.getElementById('fileName').value;

  const metadata = await cloudStorageActor.get_file_metadata(fileName);
  
  if (metadata) {
    document.getElementById('fileMetadata').textContent = JSON.stringify(metadata, null, 2);
  } else {
    document.getElementById('fileMetadata').textContent = 'File not found!';
  }
}
async function loadWasm() {
  const wasm = await WebAssembly.instantiateStreaming(fetch('cloud_storage.wasm'));
  const { upload_file } = wasm.instance.exports;

  // Menggunakan fungsi WASM untuk meng-upload file
  upload_file('example.txt', 1024, '2024-11-05');
}
loadWasm();
