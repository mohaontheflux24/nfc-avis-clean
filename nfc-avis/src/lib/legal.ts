export const legalInfo = {
  serviceName: process.env.NEXT_PUBLIC_SERVICE_NAME || "NFC Avis",
  operatorName: process.env.NEXT_PUBLIC_LEGAL_NAME || "Mohamed Aoragh",
  address: process.env.NEXT_PUBLIC_LEGAL_ADDRESS || "",
  email:
    process.env.NEXT_PUBLIC_PRIVACY_EMAIL ||
    process.env.NEXT_PUBLIC_CONTACT_EMAIL ||
    "creemonsitewebn@gmail.com",
  companyNumber: process.env.NEXT_PUBLIC_COMPANY_NUMBER || "",
  vatNumber: process.env.NEXT_PUBLIC_VAT_NUMBER || "",
  legalForm: process.env.NEXT_PUBLIC_LEGAL_FORM || "",
  host: "Vercel",
  isFreeService: true,
};
