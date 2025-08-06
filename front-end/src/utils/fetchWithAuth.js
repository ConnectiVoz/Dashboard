// src/utils/fetchWithAuth.js
export async function fetchWithAuth(url, options = {}) {
  const token = sessionStorage.getItem("token");

  const headers = {
    ...options.headers,
    "Authorization": `Bearer ${token}`,
  };

  // Add content-type if not using FormData
  const isFormData = options.body instanceof FormData;
  if (!isFormData && !headers["Content-Type"]) {
    headers["Content-Type"] = "application/json";
  }

  return fetch(url, {
    ...options,
    headers,
  });
}
