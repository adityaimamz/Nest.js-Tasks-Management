export interface PaginationOptions {
    page: number;
    limit: number;
  }
  
  export interface PaginationResult<T> {
    data: T[];
    totalItems: number;
    totalPages: number;
    currentPage: number;
  }
  
  export function paginate<T>(
    data: T[],
    page: number,
    limit: number
  ): PaginationResult<T> {
    const totalItems = data.length;
    const totalPages = Math.ceil(totalItems / limit);
    const offset = (page - 1) * limit;
    const paginatedData = data.slice(offset, offset + limit);
  
    return {
      data: paginatedData,
      totalItems,
      totalPages,
      currentPage: page,
    };
  }
  