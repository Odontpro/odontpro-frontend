export interface Review {
  profilePhotoUrl: string;
  authorName: string;
  relativeTimeDescription: string;
  rating: number;
  text: string;
  expanded?: boolean;
}
