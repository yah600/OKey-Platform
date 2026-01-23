import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Bid {
  id: string;
  unitId: string;
  propertyId: string;
  userId: string;
  amount: number;
  moveInDate: string;
  leaseTerm: number; // months
  status: 'pending' | 'accepted' | 'rejected' | 'withdrawn';
  createdAt: string;
  updatedAt: string;
  message?: string;
  unitDetails: {
    number: string;
    propertyName: string;
    address: string;
    rent: number;
  };
}

interface BidsState {
  bids: Bid[];
  addBid: (bid: Omit<Bid, 'id' | 'createdAt' | 'updatedAt' | 'status'>) => void;
  updateBidStatus: (bidId: string, status: Bid['status']) => void;
  withdrawBid: (bidId: string) => void;
  getBidsByUser: (userId: string) => Bid[];
  getBidsByUnit: (unitId: string) => Bid[];
}

export const useBidsStore = create<BidsState>()(
  persist(
    (set, get) => ({
      bids: [],

      addBid: (bid) => {
        const newBid: Bid = {
          ...bid,
          id: `bid-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          status: 'pending',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };

        set((state) => ({
          bids: [newBid, ...state.bids],
        }));
      },

      updateBidStatus: (bidId, status) => {
        set((state) => ({
          bids: state.bids.map((bid) =>
            bid.id === bidId
              ? { ...bid, status, updatedAt: new Date().toISOString() }
              : bid
          ),
        }));
      },

      withdrawBid: (bidId) => {
        set((state) => ({
          bids: state.bids.map((bid) =>
            bid.id === bidId
              ? { ...bid, status: 'withdrawn' as const, updatedAt: new Date().toISOString() }
              : bid
          ),
        }));
      },

      getBidsByUser: (userId) => {
        return get().bids.filter((bid) => bid.userId === userId);
      },

      getBidsByUnit: (unitId) => {
        return get().bids.filter((bid) => bid.unitId === unitId);
      },
    }),
    {
      name: 'okey-bids-storage',
    }
  )
);
