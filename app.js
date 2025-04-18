// Barcode scanner setup
let scanner = new Html5QrcodeScanner("reader", { fps: 10, qrbox: 250 });
scanner.render(onScanSuccess, onScanFailure);

function onScanSuccess(decodedText, decodedResult) {
  const prefix = decodedText.slice(0, 3); // Extract the first 3 digits (EAN-13 prefix)
  const country = getCountryFromEANPrefix(prefix);
  
  document.getElementById("country-name").textContent = `${country.flag} ${country.name}`;
  showMapLocation(country.name);
}

function onScanFailure(error) {
  console.warn(`QR Code scan failed: ${error}`);
}

// Show map location based on country
function showMapLocation(country) {
  const map = L.map("map").setView([0, 0], 2); // Default to global view
  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(map);

  // Add marker for country
  const countryCoords = getCountryCoordinates(country);
  if (countryCoords) {
    L.marker(countryCoords).addTo(map).bindPopup(`${country}`).openPopup();
    map.setView(countryCoords, 5); // Zoom into the country
  }
}

// Sample function to get country coordinates (use real geo-data or API for more accuracy)
function getCountryCoordinates(country) {
  const coordinates = {
    "India": [20.5937, 78.9629],
    "China": [35.8617, 104.1954],
    "South Korea": [36.5, 127.8],
    "United Kingdom": [51.5074, -0.1278],
    "USA/Canada": [37.0902, -95.7129],
    "Germany": [51.1657, 10.4515],
    "Saudi Arabia": [23.8859, 45.0792],
    "Vietnam": [14.0583, 108.2772],
  };
  return coordinates[country];
}

// Manual input handling for barcode
function checkBarcodeManually() {
  const barcode = document.getElementById("manual-input").value.trim();
  if (barcode.length >= 3) {
    const prefix = barcode.slice(0, 3);
    const country = getCountryFromEANPrefix(prefix);
    document.getElementById("country-name").textContent = `${country.flag} ${country.name}`;
    showMapLocation(country.name);
  }
}

// Toggle dark mode
function toggleDarkMode() {
  document.body.classList.toggle("dark-mode");
  localStorage.setItem("darkMode", document.body.classList.contains("dark-mode"));
}

// Initialize dark mode from saved preference
if (localStorage.getItem("darkMode") === "true") {
  toggleDarkMode();
}

// Add event listeners
document.getElementById("dark-mode-toggle").addEventListener("click", toggleDarkMode);
document.getElementById("check-manual").addEventListener("click", checkBarcodeManually);

// "Report Suspicious Product" functionality
function reportSuspiciousProduct() {
  alert("Thank you for reporting! We'll investigate the issue.");
}
