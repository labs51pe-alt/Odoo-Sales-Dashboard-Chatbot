import type { Company } from './types';

// =================================================================================
// ACTION: I have updated this URL to point to your Supabase project.
// You now need to create a Supabase Edge Function named 'get-odoo-sales'.
// The function will be called like: .../get-odoo-sales/empresa-a
// =================================================================================
export const SUPABASE_FUNCTION_BASE_URL = "https://ixhbgkimmzgfwehbbloa.supabase.co/functions/v1/get-odoo-sales/";

// Set this to `false` to use live data from your Supabase function.
// I have set this to `false` for you to activate the live connection.
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
