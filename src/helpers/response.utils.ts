export function successResponse(message: string, data: any = {}) {
    return {
      status: 'success',
      message,
      data,
    };
  }
  