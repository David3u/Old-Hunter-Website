chrome.runtime.sendMessage(
  { action: "fetchData", url: "https://api.example.com/data" },
  (response) => {
    if (response.success) {
      // Assume the JSON has a property called "newLink"
      const newLink = response.data.newLink;
      if (newLink) {
        window.location.href = newLink; // Change the link based on the fetched data
      }
    } else {
      console.error("Error fetching data:", response.error);
    }
  }
);
