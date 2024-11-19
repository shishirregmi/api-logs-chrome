const requestDetails = {};

chrome.webRequest.onBeforeRequest.addListener(
  (details) => {
    // Capture request body
    const requestBody = details.requestBody
      ? details.requestBody.raw
        ? new TextDecoder().decode(details.requestBody.raw[0].bytes)
        : details.requestBody.formData
        ? JSON.stringify(Object.fromEntries(details.requestBody.formData))
        : null
      : null;

    requestDetails[details.requestId] = {
      url: details.url,
      method: details.method,
      type: details.type,
      postData: requestBody,
    };

    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["requestBody"]
);

chrome.webRequest.onBeforeSendHeaders.addListener(
  (details) => {
    if (requestDetails[details.requestId]) {
      // Explicitly stringify headers
      requestDetails[details.requestId].headers = details.requestHeaders
        .filter((header) => header.name && header.value)
        .map((header) => `${header.name}: ${header.value}`)
        .filter(
          (header) =>
            !header.toLowerCase().includes("cookie:") &&
            !header.toLowerCase().includes("origin:") &&
            !header.toLowerCase().includes("referer:")
        );
    }
    return { cancel: false };
  },
  { urls: ["<all_urls>"] },
  ["requestHeaders"]
);

chrome.webRequest.onCompleted.addListener(
  (details) => {
    if (requestDetails[details.requestId]) {
      chrome.storage.local.get(["capturedRequests"], (result) => {
        const requests = result.capturedRequests || [];
        requests.push(requestDetails[details.requestId]);

        // Keep last 50 unique requests
        const uniqueRequests = Array.from(new Set(requests.map((r) => r.url)))
          .map((url) => requests.find((r) => r.url === url))
          .slice(-50);

        chrome.storage.local.set({ capturedRequests: uniqueRequests });
        delete requestDetails[details.requestId];
      });
    }
  },
  { urls: ["<all_urls>"] }
);
