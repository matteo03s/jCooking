export interface AiBeverage {
  name: string;
  type: string;
  description: string;
  pairingReason: string;
  servingTemp: string;
}

export interface AiSommelierResponse {
  beverages: AiBeverage[];
}
