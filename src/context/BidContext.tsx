import { createContext, useContext, useState, ReactNode } from 'react';
import { mockBids, mockUnits } from '@/lib/data/mockData';
import type { Bid, Unit } from '@/types';

interface BidContextType {
  bids: Bid[];
  units: Unit[];
  placeBid: (unitId: string, amount: number, autoBid: boolean) => boolean;
  getUserBids: () => Bid[];
}

const BidContext = createContext<BidContextType | undefined>(undefined);

export function BidProvider({ children }: { children: ReactNode }) {
  const [bids, setBids] = useState<Bid[]>(mockBids);
  const [units, setUnits] = useState<Unit[]>(mockUnits);

  const placeBid = (unitId: string, amount: number, autoBid: boolean): boolean => {
    const unit = units.find(u => u.id === unitId);
    if (!unit) return false;

    // Check if bid is higher than current bid
    const currentHighBid = unit.currentBid || unit.askingPrice;
    if (amount <= currentHighBid) {
      return false;
    }

    // Create new bid
    const newBid: Bid = {
      id: `b${Date.now()}`,
      unitId,
      bidderId: 'current-user',
      bidderName: 'You',
      bidderScore: 720, // User's score
      amount,
      autoBid: false,
      status: 'active',
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    // Add bid to bids list
    setBids(prev => [newBid, ...prev]);

    // Update unit with new current bid
    setUnits(prev => prev.map(u => {
      if (u.id === unitId) {
        return {
          ...u,
          currentBid: amount,
          totalBids: u.totalBids + 1
        };
      }
      return u;
    }));

    return true;
  };

  const getUserBids = (): Bid[] => {
    return bids.filter(bid => bid.bidderId === 'current-user');
  };

  return (
    <BidContext.Provider value={{ bids, units, placeBid, getUserBids }}>
      {children}
    </BidContext.Provider>
  );
}

export function useBids() {
  const context = useContext(BidContext);
  if (context === undefined) {
    throw new Error('useBids must be used within a BidProvider');
  }
  return context;
}
