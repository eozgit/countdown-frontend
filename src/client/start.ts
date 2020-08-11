import host from "./host";

export default (round: string) => {
  return fetch(host + "/start", {
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
