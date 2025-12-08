

export type ConsultationStatus = 'all' | 'pending' | 'processing' | 'completed' | 'cancelled';

export interface UserInfo {
  name: string;
  phone: string;
  avatar: string;
  location: string;
}

export interface ConsultationRequest {
  id: string;
  user: UserInfo;
  symptoms: string;
  submitTime: string;
  status: Exclude<ConsultationStatus, 'all'>;
  completionTime: string | null;
}

export interface StatsCardProps {
  count: number;
  label: string;
  color: string;
}

export interface ConsultationItemProps {
  consultation: ConsultationRequest;
  onAccept: (consultationId: string) => void;
  onViewDetail: (consultation: ConsultationRequest) => void;
  onChat: (consultation: ConsultationRequest) => void;
  onVideo: (consultationId: string) => void;
}

export interface ConsultationModalProps {
  visible: boolean;
  consultation: ConsultationRequest | null;
  onClose: () => void;
  onAccept: () => void;
}

export interface ChatModalProps {
  visible: boolean;
  consultation: ConsultationRequest | null;
  onClose: () => void;
}

export interface StatusFilterProps {
  visible: boolean;
  selectedStatus: ConsultationStatus;
  onStatusChange: (status: ConsultationStatus) => void;
  onClose: () => void;
}

