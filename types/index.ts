export interface Vehicle {
  id: string;
  vin: string;
  make: string;
  model: string;
  year: number;
  price: number;
  mileage: number;
  bodyType: string;
  fuelType: "Gasoline" | "Hybrid" | "Electric" | "Diesel";
  transmission: "Automatic" | "Manual" | "CVT" | "DCT";
  image: string;
  condition: "Used" | "Certified Pre-Owned";
  exteriorColor: string;
  interiorColor: string;
  features?: string[];
  carfaxUrl?: string;
  status?: string; // Added to match DB
  images?: string[];
  stockNumber?: string;
  createdAt?: string;

  // DMS / Accounting Fields
  purchasePrice?: number;
  salePrice?: number;
  auctionName?: string;
  soldDate?: string;
  consignment?: boolean;
  expenses?: Expense[];
}

export interface Expense {
  id: string;
  vehicleId: string;
  expenseType: string;
  amount: number;
  description?: string;
  date: string;
}

export interface FinancingLead {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  vehicleId?: string;
  creditScore: CreditScoreRange;
  annualIncome: number;
  downPayment: number;
  employmentStatus: string;
}

export type CreditScoreRange = "Excellent (720+)" | "Good (690-719)" | "Fair (630-689)" | "Poor (<630)";

export interface FilterState {
  make: string;
  priceRange: [number, number];
  bodyType: string;
  mileageRange: [number, number];
}
