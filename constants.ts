// constants.ts
import type { Company } from './types';

// =================================================================================
// ACTION: These URLs point to your Supabase project functions.
// 'get-odoo-sales' fetches data, and 'check-secrets' is a new diagnostic tool.
// =================================================================================
export const SUPABASE_FUNCTION_BASE_URL = "https://ixhbgkimmzgfwehbbloa.supabase.co/functions/v1/";
export const ODOO_SALES_FUNCTION_NAME = 'get-odoo-sales';
export const CHECK_SECRETS_FUNCTION_NAME = 'check-secrets';
export const ASK_GEMINI_FUNCTION_NAME = 'ask-gemini';


// Set this to `false` to use live data from your Supabase function.
export const USE_MOCK_DATA = false;


// ACTION: Updated company names to match the user's complete provided list from Odoo.
export const COMPANIES: Company[] = [
  { id: 'botica-angie', name: 'Botica Angie' },
  { id: 'servilab-urubamba', name: 'SERVILAB URUBAMBA E.I.R.L.' },
  { id: 'baca-juarez', name: 'BACA JUAREZ YESIKA' },
  { id: 'botica-j-m', name: 'BOTICA J & M FARMA S.A.C.' },
  { id: 'bioplus-farma', name: 'BIOPLUS FARMA E.I.R.L.' },
  { id: 'feet-care', name: 'FEET CARE de DRIGUEZ MATEO YOHANNA MIRELLA' },
  { id: 'boticas-multifarma', name: 'Boticas MultiFarma' },
  { id: 'maripeya', name: 'MARIPEYA E.I.R.L.' },
  { id: 'ferreteria-sac', name: 'Ferreteria S.A.C.' },
];

// ACTION: User data has been consolidated. This user can now access all listed companies.
export const USERS = [
  { 
    id: 'u1', 
    username: 'soporte@facturaclic.pe', 
    allowedCompanyIds: [
        'botica-angie', 'servilab-urubamba', 'baca-juarez', 'botica-j-m', 
        'bioplus-farma', 'feet-care', 'boticas-multifarma', 'maripeya', 'ferreteria-sac'
    ] 
  },
];


// ACTION: Set a simple password for the user to facilitate testing.
export const USER_PASSWORDS: Record<string, string> = {
  'soporte@facturaclic.pe': 'facturaclic123',
};

// This is fallback data and is not used when USE_MOCK_DATA is false.
export const MOCK_SALES_DATA: Record<string, any> = {};
