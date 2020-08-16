import { getApiUrl } from '@/common';

export default (answer: string) => {
  const url = getApiUrl("/submit");
  return fetch(url, {
    method: "POST",
    mode: "cors",
    credentials: "include",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      answer
    })
  });
};
