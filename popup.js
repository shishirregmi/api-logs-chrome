document.addEventListener("DOMContentLoaded", () => {
  const listView = document.getElementById("listView");
  const detailView = document.getElementById("detailView");
  const requestList = document.getElementById("requestList");
  const requestDetails = document.getElementById("requestDetails");
  const clearBtn = document.getElementById("clearBtn");
  const backToListBtn = document.getElementById("backToListBtn");
  const urlFilter = document.getElementById("urlFilter");
  const methodFilter = document.getElementById("methodFilter");
  const typeFilter = document.getElementById("typeFilter");

  // Restore filter values from storage
  chrome.storage.local.get(["requestFilters", "lastDetailRequest"], (result) => {
      const savedFilters = result.requestFilters || {};
      urlFilter.value = savedFilters.url || "";
      methodFilter.value = savedFilters.method || "";
      typeFilter.value = savedFilters.type || "";

      // If there's a saved detail request, show it
      if (result.lastDetailRequest) {
          showRequestDetails(result.lastDetailRequest);
      } else {
          renderRequests();
      }
  });

  function renderRequests() {
    listView.style.display = "block";
    detailView.style.display = "none";
    requestList.innerHTML = "";

    // Save current filter state
    chrome.storage.local.set({
      requestFilters: {
        url: urlFilter.value,
        method: methodFilter.value,
        type: typeFilter.value
      }
    });

    chrome.storage.local.get(["capturedRequests"], (result) => {
      let requests = result.capturedRequests || [];

      // Apply filters
      requests = requests.filter(request => {
        const urlMatch = urlFilter.value === "" || 
          request.url.toLowerCase().includes(urlFilter.value.toLowerCase());
        const methodMatch = methodFilter.value === "" || 
          request.method === methodFilter.value;
        const typeMatch = typeFilter.value === "" || 
          request.type === typeFilter.value;
        
        return urlMatch && methodMatch && typeMatch;
      });

      if (requests.length === 0) {
        const noRequestsMsg = document.createElement("div");
        noRequestsMsg.textContent = "No requests match the current filters.";
        requestList.appendChild(noRequestsMsg);
        return;
      }

      requests.reverse().forEach((request, index) => {
        const requestElement = document.createElement("div");
        requestElement.classList.add("request");

        requestElement.innerHTML = `
          <div class="request-summary">
            <div>
              <strong>${request.method}</strong> 
              <span class="truncate">${request.url}</span>
            </div>
            <div>${request.type}</div>
          </div>
        `;

        requestElement.addEventListener('click', () => {
          showRequestDetails(request);
        });

        requestList.appendChild(requestElement);
      });
    });
  }

  function showRequestDetails(request) {
    listView.style.display = "none";
    detailView.style.display = "block";

    // Save the last viewed request details
    chrome.storage.local.set({ lastDetailRequest: request });

    const copyBtn = document.createElement("button");
    copyBtn.textContent = "Copy cURL";
    copyBtn.classList.add("copy-btn");

    const curlCommand = generateCurlCommand(request);

    copyBtn.addEventListener("click", () => {
      navigator.clipboard.writeText(curlCommand).then(() => {
        copyBtn.textContent = "Copied!";
        setTimeout(() => {
          copyBtn.textContent = "Copy cURL";
        }, 2000);
      });
    });

    requestDetails.innerHTML = `
      <h2>Request Details</h2>
      <strong>URL:</strong> ${request.url}<br>
      <strong>Method:</strong> ${request.method}<br>
      <strong>Type:</strong> ${request.type}<br>
      ${
        request.headers
          ? `<strong>Headers:</strong><br>
        <pre>${request.headers.join("\n")}</pre>`
          : ""
      }
      ${
        request.postData
          ? `<strong>Request Body:</strong><br>
        <pre>${request.postData}</pre>`
          : ""
      }
    `;

    requestDetails.appendChild(copyBtn);
  }

  // Back to list button
  backToListBtn.addEventListener('click', renderRequests);

  // Initial render
  clearBtn.addEventListener("click", () => {
    chrome.storage.local.remove("capturedRequests", () => {
      renderRequests();
    });
  });

  // Add event listeners for filters
  urlFilter.addEventListener('input', renderRequests);
  methodFilter.addEventListener('change', renderRequests);
  typeFilter.addEventListener('change', renderRequests);
});

function generateCurlCommand(request) {
  let curlCmd = `curl -X ${request.method} '${request.url}'`;

  // Add headers correctly
  if (request.headers) {
    request.headers.forEach((header) => {
      curlCmd += ` \\\n  -H '${header}'`;
    });
  }

  // Add post data for POST/PUT requests
  if (request.postData) {
    curlCmd += ` \\\n  -d '${request.postData}'`;
  }

  return curlCmd;
}