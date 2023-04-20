// function callApi(url, method, data, headers = {}) {
//   return fetch(url, {
//     method: method,
//     body: JSON.stringify(data),
//     headers: {
//       "Content-Type": "application/json",
//       ...headers,
//     },
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error("Network response was not ok");
//       }
//       return response.json();
//     })
//     .catch((error) => {
//       console.error("Error:", error);
//     });
// }

export const callApi = async(url, method, data, headers = {}) => {
  try {
    const options = {
      method: method,
      headers: {
        "Content-Type": "application/json",
        ...headers,
      },
    };
    if (method === "POST") {
      options.body = JSON.stringify(data);
    }

    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("Error:", error);
  }
}
