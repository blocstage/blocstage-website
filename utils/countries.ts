export interface Country {
  name: string;
  code: string; // ISO 2-letter code (e.g., NG, GH)
  dial_code: string; // Country calling code (e.g., +234)
}

export const countries: Country[] = [
  { name: "Nigeria", code: "NG", dial_code: "+234" },
  { name: "Ghana", code: "GH", dial_code: "+233" },
  { name: "Togo", code: "TG", dial_code: "+228" },
  { name: "Senegal", code: "SN", dial_code: "+221" },
  { name: "Mali", code: "ML", dial_code: "+223" },
  { name: "Guinea", code: "GN", dial_code: "+224" },
  { name: "Burkina Faso", code: "BF", dial_code: "+226" },
  { name: "Niger", code: "NE", dial_code: "+227" },
  { name: "Liberia", code: "LR", dial_code: "+231" },
  { name: "Cote d'Ivoire", code: "CI", dial_code: "+225" },
  { name: "Benin", code: "BJ", dial_code: "+229" },
  { name: "Tanzania", code: "TZ", dial_code: "+255" },
  { name: "Kenya", code: "KE", dial_code: "+254" },
  { name: "South Africa", code: "ZA", dial_code: "+27" },
  { name: "Uganda", code: "UG", dial_code: "+256" },
  { name: "Rwanda", code: "RW", dial_code: "+250" },
  { name: "Zambia", code: "ZM", dial_code: "+260" },
  { name: "Zimbabwe", code: "ZW", dial_code: "+263" },
  { name: "Cameroon", code: "CM", dial_code: "+237" },
  { name: "Congo", code: "CG", dial_code: "+242" },
  { name: "Gabon", code: "GA", dial_code: "+241" },
  { name: "Angola", code: "AO", dial_code: "+244" },
  { name: "Mozambique", code: "MZ", dial_code: "+258" },
  { name: "Namibia", code: "NA", dial_code: "+264" },
  { name: "Botswana", code: "BW", dial_code: "+267" },
  { name: "Malawi", code: "MW", dial_code: "+265" },
  { name: "Sierra Leone", code: "SL", dial_code: "+232" },
  { name: "Mauritius", code: "MU", dial_code: "+230" },
  { name: "Madagascar", code: "MG", dial_code: "+261" },
  { name: "United States", code: "US", dial_code: "+1" },
  { name: "Canada", code: "CA", dial_code: "+1" },
  { name: "United Kingdom", code: "GB", dial_code: "+44" },
];
