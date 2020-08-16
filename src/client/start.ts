import { getApiUrl } from '@/common';

export default (round: string) => {
  const url = getApiUrl("/start");
  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      round
    })
  });
};
