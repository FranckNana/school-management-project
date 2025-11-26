export interface Notification {
  id?: number;
  icon: string;
  color: string;
  importance: string;
  title: string;
  description?: string;
  dateTime: Date;
}