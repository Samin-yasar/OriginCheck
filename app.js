// app.js
import { getCountryByEANPrefix } from './countries.js';

document.addEventListener('DOMContentLoaded', () => {
  // Check if Html5QrcodeScanner is available
  if (typeof Html5QrcodeScanner === 'undefined') {
    document.getElementById('scanner-error').textContent = 'Error: Barcode scanner library failed to load. Please try refreshing the page.';
    return;
  }

  // Initialize map and scanner
  let map = null;
  let scanner = null;

  // Select camera and initialize scanner
  Html5Qrcode.getCameras().then(devices => {
    if (!devices || !devices.length) {
      document.getElementById('scanner-error').textContent = 'No cameras found. Please connect a camera.';
      return;
    }

    // Prefer back camera
    const backCamera = devices.find(device => device.label.toLowerCase().includes('back')) || devices[0];

    scanner = new Html5QrcodeScanner(
      'reader',
      {
        fps: 20,
        qrbox: { width: 300, height: 300 },
        disableFlip: true,
        formatsToSupport: [
          Html5QrcodeSupportedFormats.EAN_13,
          Html5QrcodeSupportedFormats.UPC_A,
          Html5QrcodeSupportedFormats.CODE_128,
          Html5QrcodeSupportedFormats.QR_CODE
        ],
        videoConstraints: { deviceId: backCamera.id }
      },
      false
    );

    // Success callback
    function onScanSuccess(decodedText, decodedResult) {
      console.log(`Scanned: ${decodedText}`, decodedResult); // Debug
      const prefix = decodedText.slice(0, 3);
      const country = getCountryByEANPrefix(prefix);
      
      document.getElementById('country-name').textContent = `${country.flag} ${country.name}`;
      document.getElementById('scanner-error').textContent = '';
      document.getElementById('retry-scan').style.display = 'none';
      showMapLocation(country.name);
      
      scanner.clear();
    }

    // Failure callback
    function onScanFailure(error) {
      document.getElementById('scanner-error').textContent = `Scan failed: ${error}. Try adjusting lighting or barcode position.`;
      document.getElementById('retry-scan').style.display = 'block';
      console.warn(`Barcode scan failed: ${error}`, { error });
    }

    // Render scanner
    try {
      scanner.render(onScanSuccess, onScanFailure);
    } catch (error) {
      document.getElementById('scanner-error').textContent = `Failed to start scanner: ${error.message}`;
      document.getElementById('retry-scan').style.display = 'block';
    }

    // Retry scan
    document.getElementById('retry-scan').addEventListener('click', () => {
      document.getElementById('scanner-error').textContent = '';
      document.getElementById('retry-scan').style.display = 'none';
      scanner.clear();
      scanner.render(onScanSuccess, onScanFailure);
    });
  }).catch(err => {
    document.getElementById('scanner-error').textContent = `Camera access failed: ${err}`;
  });

  // Show map location with Nominatim
  async function showMapLocation(country) {
    if (!map) {
      map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }

    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    const countryCoords = await getCountryCoordinates(country);
    if (countryCoords) {
      L.marker(countryCoords).addTo(map).bindPopup(`${country}`).openPopup();
      map.setView(countryCoords, 5);
    } else {
      map.setView([0, 0], 2);
    }
  }

  // Get coordinates using Nominatim
  async function getCountryCoordinates(country) {
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(country)}&format=json&limit=1`, {
        headers: { 'User-Agent': 'BarcodeCountryChecker/1.0' }
      });
      const data = await response.json();
      if (data[0]) {
        return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
      }
    } catch (error) {
      console.warn(`Failed to fetch coordinates for ${country}: ${error}`);
    }
    return null;
  }

  // Manual input handling
  function checkBarcodeManually() {
    const barcode = document.getElementById('manual-input').value.trim();
    if (!barcode) {
      document.getElementById('manual-input-error').textContent = 'Please enter a barcode.';
      return;
    }
    if (!/^\d{8,13}$/.test(barcode)) {
      document.getElementById('manual-input-error').textContent = 'Enter a valid 8-13 digit barcode.';
      return;
    }
    const prefix = barcode.slice(0, 3);
    const country = getCountryByEANPrefix(prefix);
    document.getElementById('country-name').textContent = `${country.flag} ${country.name}`;
    document.getElementById('manual-input-error').textContent = '';
    showMapLocation(country.name);
  }

  // Toggle dark mode
  function toggleDarkMode() {
    document.body.classList.toggle('dark-mode');
    localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
  }

  // Initialize dark mode
  if (localStorage.getItem('darkMode') === 'true') {
    toggleDarkMode();
  }

  // Report suspicious product
  function reportSuspiciousProduct() {
    const barcode = document.getElementById('manual-input').value || 'Unknown';
    alert(`Thank you for reporting! Barcode: ${barcode} will be investigated.`);
  }

  // Event listeners
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('check-manual').addEventListener('click', checkBarcodeManually);
  document.getElementById('report-suspicious').addEventListener('click', reportSuspiciousProduct);

  // Cleanup
  window.addEventListener('beforeunload', () => {
    if (scanner) {
      scanner.clear();
    }
  });
});
