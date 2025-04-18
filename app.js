// app.js
import { getCountryByEANPrefix } from './countries.js';

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
    const country = getCountryByEANPrefix(prefix);
    
    document.getElementById('country-name').textContent = `${country.flag} ${country.name}`;
    document.getElementById('scanner-error').textContent = '';
    showMapLocation(country.name);
    
    // Stop scanner after successful scan
    scanner.clear();
  }

  // Failure callback for scanner
  function onScanFailure(error) {
    document.getElementById('scanner-error').textContent = `Scan failed: ${error}`;
    console.warn(`Barcode scan failed: ${error}`);
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
      'United States': [37.0902, -95.7129],
      'United States (UPC-A compatible)': [37.0902, -95.7129],
      'United States (restricted circulation numbers)': [37.0902, -95.7129],
      'United States (drugs, National Drug Code)': [37.0902, -95.7129],
      'United States (restricted circulation within a company)': [37.0902, -95.7129],
      'United States (reserved for future use)': [37.0902, -95.7129],
      'France and Monaco': [46.6031, 1.7191],
      'Bulgaria': [42.6977, 23.3219],
      'Slovenia': [46.0569, 14.5058],
      'Croatia': [45.8150, 15.9780],
      'Bosnia and Herzegovina': [43.8563, 18.4131],
      'Montenegro': [42.4304, 19.2594],
      'Kosovo': [42.6026, 20.9020],
      'Germany': [51.1657, 10.4515],
      'Japan': [36.2048, 138.2529],
      'Russia': [61.5240, 105.3188],
      'Kyrgyzstan': [41.2044, 74.7661],
      'Taiwan': [23.6978, 120.9605],
      'Estonia': [58.5953, 25.0136],
      'Latvia': [56.8796, 24.6032],
      'Azerbaijan': [40.1431, 47.5769],
      'Lithuania': [55.1694, 23.8813],
      'Sri Lanka': [7.8731, 80.7718],
      'Philippines': [12.8797, 121.7740],
      'Belarus': [53.7098, 27.9534],
      'Ukraine': [48.3794, 31.1656],
      'Turkmenistan': [38.9697, 59.5563],
      'Moldova': [47.4116, 28.3699],
      'Armenia': [40.0691, 45.0382],
      'Georgia': [42.3154, 43.3569],
      'Kazakhstan': [48.0196, 66.9237],
      'Tajikistan': [38.8610, 71.2761],
      'Hong Kong': [22.3193, 114.1694],
      'United Kingdom': [51.5074, -0.1278],
      'Greece': [39.0742, 21.8243],
      'Lebanon': [33.8547, 35.8623],
      'Cyprus': [35.1264, 33.4299],
      'Albania': [41.1533, 20.1683],
      'North Macedonia': [41.6086, 21.7453],
      'Malta': [35.9375, 14.3754],
      'Ireland': [53.4129, -8.2439],
      'Belgium and Luxembourg': [50.8503, 4.3517],
      'Portugal': [39.3999, -8.2245],
      'Iceland': [64.9631, -19.0208],
      'Denmark, Faroe Islands, and Greenland': [56.2639, 9.5018],
      'Poland': [51.9194, 19.1451],
      'Romania': [45.9432, 24.9668],
      'Hungary': [47.1625, 19.5033],
      'South Africa': [-30.5595, 22.9375],
      'Ghana': [7.9465, -1.0232],
      'Senegal': [14.4974, -14.4524],
      'Uganda': [1.3733, 32.2903],
      'Angola': [-11.2027, 17.8739],
      'Oman': [21.4735, 55.9754],
      'Bahrain': [26.0667, 50.5577],
      'Mauritius': [-20.3484, 57.5522],
      'Morocco': [31.7917, -7.0926],
      'Somalia': [5.1521, 46.1996],
      'Algeria': [28.0339, 1.6596],
      'Nigeria': [9.0820, 8.6753],
      'Kenya': [-1.2921, 36.8219],
      'Cameroon': [7.3697, 12.3547],
      'Ivory Coast': [7.5400, -5.5471],
      'Tunisia': [33.8869, 9.5375],
      'Tanzania': [-6.3690, 34.8888],
      'Syria': [34.8021, 38.9968],
      'Egypt': [26.8206, 30.8025],
      'Brunei': [4.5353, 114.7277],
      'Libya': [26.3351, 17.2283],
      'Jordan': [31.9566, 35.9457],
      'Iran': [32.4279, 53.6880],
      'Kuwait': [29.3117, 47.4818],
      'Saudi Arabia': [23.8859, 45.0792],
      'United Arab Emirates': [23.4241, 53.8478],
      'Qatar': [25.3548, 51.1839],
      'Namibia': [-22.9576, 18.4904],
      'Rwanda': [-1.9403, 29.8739],
      'Finland': [61.9241, 25.7482],
      'China': [35.8617, 104.1954],
      'Norway': [60.4720, 8.4689],
      'Israel': [31.0461, 34.8516],
      'Sweden': [60.1282, 18.6435],
      'Guatemala': [15.7835, -90.2308],
      'El Salvador': [13.7942, -88.8965],
      'Honduras': [15.2000, -86.2419],
      'Nicaragua': [12.8654, -85.2072],
      'Costa Rica': [9.7489, -83.7534],
      'Panama': [8.5379, -80.7821],
      'Dominican Republic': [18.7357, -70.1627],
      'Mexico': [23.6345, -102.5528],
      'Canada': [56.1304, -106.3468],
      'Venezuela': [6.4238, -66.5897],
      'Switzerland and Liechtenstein': [46.8182, 8.2275],
      'Colombia': [4.5709, -74.2973],
      'Uruguay': [-32.5228, -55.7658],
      'Peru': [-9.1900, -75.0152],
      'Paraguay': [-23.4425, -58.4438],
      'Chile': [-35.6751, -71.5430],
      'Argentina': [-38.4161, -63.6167]
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
