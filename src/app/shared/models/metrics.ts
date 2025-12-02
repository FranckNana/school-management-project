export enum Month {
  January = 1,
  February,
  March,
  April,
  May,
  June,
  July,
  August,
  September,
  October,
  November,
  December
}

export interface Metrics {
  totalStudents: number;
  totalTeachers: number;
  paymentComplianceRate: number; // en pourcentage
  todaysClassesCount: number;
  year: number;
  month: Month;
  comparedStudent: number;
  comparedTeacher: number;
}
