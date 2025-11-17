import axios from "axios";

const clientApi = axios.create({
  baseURL: "https://impact-back-end-m7hw.onrender.com/api",
});

export const request = async (options, token) => {
  console.log(options);
  try {
    const res = await clientApi.request({
      ...options,
      headers: {
        ...options.headers,
        Authorization: `Bearer ${token}`,
      },
    });
    return res;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw error;
    } else {
      throw new Error("An unexpected error occurred.");
    }
  }
};

export default clientApi;
