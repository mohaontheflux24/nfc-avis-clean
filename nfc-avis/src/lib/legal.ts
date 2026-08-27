export const legalInfo = {
  serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME || "NFC Avis",
  operatorName: process.env.NEXT_PUBLIC_LEGAL_NAME || "À compléter avant commercialisation",
  legalForm: process.env.NEXT_PUBLIC_LEGAL_FORM || "À compléter",
  companyNumber: process.env.NEXT_PUBLIC_COMPANY_NUMBER || "À compléter",
  vatNumber: process.env.NEXT_PUBLIC_VAT_NUMBER || "À compléter",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "À compléter",
  email: process.env.NEXT_PUBLIC_PRIVACY_EMAIL || process.env.NEXT_PUBLIC_CONTACT_EMAIL || "À compléter",
  host: "Vercel",
};
