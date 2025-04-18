// app.js
import { countryData } from './countries.js'; // Assumes countryData is exported

// Wait for DOM and scripts to load
document.addEventListener('DOMContentLoaded', () => {
  // Check if Html5QrcodeScanner is available
  if (typeof Html5QrcodeScanner === 'undefined') {
    document.getElementById('scanner-error').textContent = 'Error: Barcode scanner library failed to load. Please try refreshing the page.';
    return;
  }

  // Barcode scanner setup
  const scanner = new Html5QrcodeScanner(
    'reader',
    { fps: 10, qrbox: { width: 250, height: 250 } },
    false
  );

  // Initialize map once
  let map = null;

  // Success callback for scanner
  function onScanSuccess(decodedText, decodedResult) {
    const prefix = decodedText.slice(0, 3); // Extract EAN-13 prefix
    const country = getCountryFromEANPrefix(prefix);
    
    document.getElementById('country-name').textContent = `${country.flag} ${country.name}`;
    document.getElementById('scanner-error').textContent = '';
    showMapLocation(country.name);
    
    // Stop scanner after successful scan
    scanner.clear();
  }

  // Failure callback for scanner
  function onScanFailure(error) {
    document.getElementById('scanner-error').textContent = `Scan failed: ${error}`;
    console.warn(`QR Code scan failed: ${error}`);
  }

  // Render scanner
  try {
    scanner.render(onScanSuccess, onScanFailure);
  } catch (error) {
    document.getElementById('scanner-error').textContent = `Failed to start scanner: ${error.message}`;
  }

  // Show map location based on country
  function showMapLocation(country) {
    if (!map) {
      map = L.map('map').setView([0, 0], 2);
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      }).addTo(map);
    }

    // Clear existing markers
    map.eachLayer(layer => {
      if (layer instanceof L.Marker) {
        map.removeLayer(layer);
      }
    });

    // Add marker for country
    const countryCoords = getCountryCoordinates(country);
    if (countryCoords) {
      L.marker(countryCoords).addTo(map).bindPopup(`${country}`).openPopup();
      map.setView(countryCoords, 5);
    } else {
      map.setView([0, 0], 2); // Reset to global view
    }
  }

  // Get country coordinates
  function getCountryCoordinates(country) {
    const coordinates = {
      'India': [20.5937, 78.9629],
      'China': [35.8617, 104.1954],
      'South Korea': [36.5, 127.8],
      'United Kingdom': [51.5074, -0.1278],
      'USA/Canada': [37.0902, -95.7129],
      'Germany': [51.1657, 10.4515],
      'Saudi Arabia': [23.8859, 45.0792],
      'Vietnam': [14.0583, 108.2772]
    };
    return coordinates[country] || null;
  }

  // Manual input handling
  function checkBarcodeManually() {
    const barcode = document.getElementById('manual-input').value.trim();
    if (!barcode) {
      document.getElementById('manual-input-error').textContent = 'Please enter a barcode.';
      return;
    }
    if (barcode.length < 3) {
      document.getElementById('manual-input-error').textContent = 'Barcode must be at least 3 digits.';
      return;
    }
    const prefix = barcode.slice(0, 3);
    const country = getCountryFromEANPrefix(prefix);
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

  // Get country from prefix
  function getCountryFromEANPrefix(prefix) {
    return countryData[prefix] || { name: 'Unknown', flag: '🏳️' };
  }

  // Report suspicious product
  function reportSuspiciousProduct() {
    const barcode = document.getElementById('manual-input').value || 'Unknown';
    alert(`Thank you for reporting! Barcode: ${barcode} will be investigated.`);
    // Optionally send to a server
  }

  // Event listeners
  document.getElementById('dark-mode-toggle').addEventListener('click', toggleDarkMode);
  document.getElementById('check-manual').addEventListener('click', checkBarcodeManually);
  document.getElementById('report-suspicious').addEventListener('click', reportSuspiciousProduct);

  // Cleanup on page unload
  window.addEventListener('beforeunload', () => {
    scanner.clear();
  });
});
