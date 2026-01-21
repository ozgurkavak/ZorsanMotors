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
  transmission: "Automatic" | "Manual";
  image: string;
  condition: "Used" | "Certified Pre-Owned";
  exteriorColor: string;
  interiorColor: string;
  features?: string[];
  carfaxUrl?: string;
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
