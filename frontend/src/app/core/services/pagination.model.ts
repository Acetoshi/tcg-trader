export interface PaginatedResponse<T> {
  count: number;
  next: string | null;
  previous: string | null;
  results: T[];
}

export interface PaginationObject {
  next: string | null;
  previous: string | null;
}

export const PaginationDefault = {
  next: null,
  previous: null,
};
