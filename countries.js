const barcodeCountries = [
  { range: [0, 19], country: "USA/Canada", code: "US", flag: "🇺🇸" },
  { range: [30, 39], country: "USA", code: "US", flag: "🇺🇸" },
  { range: [40, 44], country: "Germany", code: "DE", flag: "🇩🇪" },
  { range: [45, 49], country: "Japan", code: "JP", flag: "🇯🇵" },
  { range: [50, 59], country: "UK", code: "GB", flag: "🇬🇧" },
  { range: [690, 699], country: "China", code: "CN", flag: "🇨🇳" },
  { range: [890, 899], country: "India", code: "IN", flag: "🇮🇳" },
  { range: [400, 440], country: "Germany", code: "DE", flag: "🇩🇪" },
  { range: [500, 509], country: "UK", code: "GB", flag: "🇬🇧" },
  { range: [690, 695], country: "China", code: "CN", flag: "🇨🇳" },
  { range: [700, 709], country: "Norway", code: "NO", flag: "🇳🇴" },
  { range: [730, 739], country: "Sweden", code: "SE", flag: "🇸🇪" },
  { range: [760, 769], country: "Switzerland", code: "CH", flag: "🇨🇭" },
  { range: [800, 839], country: "Italy", code: "IT", flag: "🇮🇹" },
  { range: [840, 849], country: "Spain", code: "ES", flag: "🇪🇸" },
  { range: [850, 859], country: "Cuba", code: "CU", flag: "🇨🇺" },
  { range: [870, 879], country: "Netherlands", code: "NL", flag: "🇳🇱" },
  { range: [900, 919], country: "Austria", code: "AT", flag: "🇦🇹" },
  { range: [930, 939], country: "Australia", code: "AU", flag: "🇦🇺" },
  { range: [940, 949], country: "New Zealand", code: "NZ", flag: "🇿🇲" }
];

function getCountryFromEANPrefix(prefix) {
  const num = parseInt(prefix, 10);
  return barcodeCountries.find(entry => num >= entry.range[0] && num <= entry.range[1]);
}
