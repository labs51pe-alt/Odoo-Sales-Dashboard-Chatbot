// constants.ts
import type { Company } from './types';

// =================================================================================
// LIVE COMPANY & USER DATA
// This now reflects the real company structure provided by the user.
// =================================================================================
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

export const USERS = [
  { 
    id: 'user-1', 
    username: 'soporte@facturaclic.pe', 
    allowedCompanyIds: [
        'botica-angie', 'servilab-urubamba', 'baca-juarez', 'botica-j-m', 
        'bioplus-farma', 'feet-care', 'boticas-multifarma', 'maripeya', 'ferreteria-sac'
    ] 
  },
];

export const USER_PASSWORDS: Record<string, string> = {
  'soporte@facturaclic.pe': 'facturaclic123',
};


// =================================================================================
// LIVE SUPABASE CONFIGURATION
// This now points to your deployed Supabase project.
// =================================================================================
export const SUPABASE_PROJECT_ID = 'ixhbgkimmzgfwehbbloa';
export const SUPABASE_FUNCTION_BASE_URL = `https://${SUPABASE_PROJECT_ID}.supabase.co/functions/v1/`; 
export const ASK_GEMINI_FUNCTION_NAME = 'ask-gemini';
export const ODOO_SALES_FUNCTION_NAME = 'get-odoo-sales';


// =================================================================================
// MOCK DATA REMOVED
// The USE_MOCK_DATA flag and all mock data objects have been removed to ensure
// the application only operates in a live data mode.
// =================================================================================
