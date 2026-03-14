import { BaseProfile } from './profile.model';

export interface FamilyProfile extends BaseProfile {
  relationToSenior: string;

  emergencyName: string;
  emergencyRelation: string;
  emergencyPhone: string;

  importantNotes?: string;
}
