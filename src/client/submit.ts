import host from "./host";

export default (answer: string) => {
  return fetch(host + "/submit", {
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
