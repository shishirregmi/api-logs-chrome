# API Request Capture Chrome Extension

This Chrome extension allows you to capture, view, and manage API request details directly from your browser. It is especially useful for developers looking to debug and inspect HTTP requests while browsing.

## Features
- Capture full details of HTTP requests (URL, method, headers, and body).
- View the list of captured API requests in a pop-up window.
- Filter requests by URL, HTTP method (GET, POST, PUT, DELETE), and request type (XHR, Fetch, etc.).
- View request details including headers and body in a detailed view.
- Copy API requests as `cURL` commands for easy replication.
- Clear captured requests with a single click.
- Store the last 50 unique requests, automatically removing duplicates.

## Installation

1. Download or clone this repository to your local machine.
2. Open Chrome and navigate to `chrome://extensions/`.
3. Enable **Developer mode** by toggling the switch in the top-right corner.
4. Click **Load unpacked** and select the directory where the extension files are located.
5. The extension icon should now appear in your Chrome toolbar.

## Usage

1. Click on the extension icon in the toolbar to open the pop-up interface.
2. The **List View** will show captured API requests.
3. You can filter the displayed requests using the input fields at the top (URL, HTTP method, and request type).
4. To view more details about a request, click on any request in the list.
5. In the **Request Details View**, you can see:
   - URL
   - Method
   - Type
   - Headers (if available)
   - Request Body (if available)
6. You can copy the request as a `cURL` command by clicking the "Copy cURL" button.
7. Click the **Back to List** button to return to the list view.
8. To clear all captured requests, click the **Clear All Requests** button.

## Permissions

This extension requires the following permissions:
- **webRequest**: To capture details of outgoing HTTP requests.
- **storage**: To save the captured requests locally.
- **activeTab**: To access information about the currently active tab.
- **clipboardWrite**: To copy the cURL command to the clipboard.
- **host_permissions**: Allows the extension to capture requests from any URL (`<all_urls>`).

## Files

- **manifest.json**: Contains the metadata for the extension (name, version, permissions).
- **background.js**: Handles capturing HTTP request details and storing them.
- **popup.html**: The HTML layout for the extension's user interface.
- **popup.js**: Contains the logic for rendering the captured requests and managing user interactions.
  
## Contribution

Feel free to contribute to this project by opening an issue or submitting a pull request.

## License

This project is open source and available under the [MIT License](LICENSE).

---

### Notes:
- This extension supports filtering by **URL**, **HTTP method** (GET, POST, PUT, DELETE), and **request type** (XHR, Fetch, etc.).
- The extension stores up to 50 unique requests and automatically removes duplicates, ensuring the list does not grow indefinitely.
