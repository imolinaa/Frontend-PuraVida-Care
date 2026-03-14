export interface ProviderService {
  id: string;
  name: string;
  description: string;
  price: string;
  duration: string;
}

export interface ProviderReview {
  id?: string;
  author: string;
  rating: number;
  date: string;
  comment: string;
  avatar: string;
}

export interface ProviderProfile {
  id: string;
  fullName: string;
  phone: string;
  email: string;
  profileImage: string | null;
  address?: string;
  rating: number;
  reviews: number;
  verified: boolean;
  zone: string;
  yearsExperience: number;
  bio: string;
  insuranceActive: boolean;
  services: ProviderService[];
  reviewsList: ProviderReview[];
  memberSince?: string;
}
