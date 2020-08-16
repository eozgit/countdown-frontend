import { getApiUrl } from '@/common';

export default (type: string) => {
  const url = getApiUrl("/letters");
  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      type
    })
  });
};
