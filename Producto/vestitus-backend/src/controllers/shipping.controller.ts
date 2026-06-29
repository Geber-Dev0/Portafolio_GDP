import { Request, Response } from 'express';

interface QuoteRequest {
  origin?: string;
  destination?: string;
  weight?: number;
  declaredValue?: number;
}

const FALLBACK_RATES: Record<string, number> = {
  'Región Metropolitana de Santiago': 3000,
};

async function quoteMulticouriers(payload: QuoteRequest): Promise<{ courier: string; cost: number; currency: string } | null> {
  try {
    const res = await fetch('https://api.multicouriers.cl/api/starken/quote', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        origin: payload.origin || 'Santiago',
        destination: payload.destination || 'Santiago',
        weight: payload.weight || 1,
        declaredValue: payload.declaredValue || 50000,
      }),
    });
    if (!res.ok) return null;
    const data = await res.json();
    if (data?.total) {
      return { courier: 'Starken', cost: data.total, currency: 'CLP' };
    }
    return null;
  } catch {
    return null;
  }
}

function quoteFallback(destination?: string): number {
  if (destination && FALLBACK_RATES[destination]) return FALLBACK_RATES[destination];
  return 5000;
}

export const getShippingQuote = async (req: Request, res: Response) => {
  try {
    const { origin, destination, weight, declaredValue } = req.body as QuoteRequest;

    if (!destination) {
      res.status(400).json({ success: false, message: 'Destino requerido' });
      return;
    }

    const multicouriers = await quoteMulticouriers({ origin, destination, weight, declaredValue });
    if (multicouriers) {
      res.json({ success: true, data: multicouriers });
      return;
    }

    const fallbackCost = quoteFallback(destination);
    res.json({
      success: true,
      data: { courier: 'Starken (estimado)', cost: fallbackCost, currency: 'CLP', fallback: true },
    });
  } catch {
    res.status(500).json({ success: false, message: 'Error al cotizar envío' });
  }
};
