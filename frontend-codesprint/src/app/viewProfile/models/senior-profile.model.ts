import { BaseProfile } from './profile.model';

export interface SeniorProfile extends BaseProfile {
  age: number;
  gender: string;

  familyMember: string;
  relation: string;

  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;

  mobility?: string;
  medical?: string;
  allergies?: string;
}
