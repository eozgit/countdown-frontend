import { getApiUrl } from '@/common';

export default (count: number) => {
  const url = getApiUrl("/numbers");
  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      count
    })
  });
};
