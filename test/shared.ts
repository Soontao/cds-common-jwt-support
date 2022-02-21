
export const baseConfig = {
  validateStatus: function (status: any) {
    return status >= 200 && status < 500;
  },
};
