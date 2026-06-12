export type Wishes = {
  id: string;
  userWishes: string[];
  totalOfItems: number;
  user: { id: string };
  createdAt?: string;
  modifiedAt?: string;
};
