import { request } from "@/services/clientService";

const patchRequest = (url, data, token) => {
  return request(
    {
      method: "PATCH",
      url: url,
      data,
    },
    token
  );
};

export default patchRequest;
