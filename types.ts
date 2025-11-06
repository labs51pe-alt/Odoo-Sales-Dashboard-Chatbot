export interface Company {
  id: string;
  name: string;
}

export interface User {
  id: string;
  username: string;
  companyId: string;
}

export interface SalesBySede {
  sede: string;
  total_ventas: number;
  ganancia: number;
  num_ordenes: number;
}

export interface SalesData {
  totalSales: number;
  totalProfit: number;
  orderCount: number;
  salesByProduct: { name: string; sales: number; profit: number }[];
  monthlySales: { month: string; sales: number; profit: number }[];
  salesBySede: SalesBySede[];
}

export interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
}
