import { Badge } from '@/components/ui/badge';

export type StatusType = 
  | 'new' | 'triaged' | 'dispatched' | 'on-site' | 'resolved' | 'closed'
  | 'draft' | 'ready' | 'sent' | 'acknowledged'
  | 'active' | 'overdue' | 'resolved' | 'canceled'
  | 'pending' | 'approved' | 'rejected'
  | 'low' | 'medium' | 'high' | 'urgent';

interface StatusPillProps {
  status: StatusType;
  label?: string;
}

const statusConfig: Record<StatusType, { color: string; bgColor: string; label: string }> = {
  // Dispatch statuses
  new: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Nouveau' },
  triaged: { color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Trié' },
  dispatched: { color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'Dispatché' },
  'on-site': { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Sur place' },
  resolved: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Résolu' },
  closed: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Fermé' },
  
  // Document statuses
  draft: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Brouillon' },
  ready: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Prêt' },
  sent: { color: 'text-purple-700', bgColor: 'bg-purple-100', label: 'Envoyé' },
  acknowledged: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Accusé réception' },
  
  // General statuses
  active: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Actif' },
  overdue: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'En retard' },
  canceled: { color: 'text-gray-700', bgColor: 'bg-gray-100', label: 'Annulé' },
  
  // Approval statuses
  pending: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'En attente' },
  approved: { color: 'text-green-700', bgColor: 'bg-green-100', label: 'Approuvé' },
  rejected: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Rejeté' },
  
  // Priority levels
  low: { color: 'text-blue-700', bgColor: 'bg-blue-100', label: 'Faible' },
  medium: { color: 'text-yellow-700', bgColor: 'bg-yellow-100', label: 'Moyen' },
  high: { color: 'text-orange-700', bgColor: 'bg-orange-100', label: 'Élevé' },
  urgent: { color: 'text-red-700', bgColor: 'bg-red-100', label: 'Urgent' },
};

export function StatusPill({ status, label }: StatusPillProps) {
  const config = statusConfig[status];
  
  return (
    <Badge className={`${config.bgColor} ${config.color} border-0`}>
      {label || config.label}
    </Badge>
  );
}
