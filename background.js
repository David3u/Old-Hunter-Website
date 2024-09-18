chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	// Check if the tab is loading and has a URL
	if (changeInfo.status === 'loading' && tab.url) {
		const url = new URL(tab.url);

		// Is Hunter Website?
		if (url.hostname === 'hunterschools.myschoolapp.com') {
			// Is new style?
			if (url.pathname.includes("lms-assignment")) {
				// Is assignment?
				if (url.pathname.includes("assignment-student-view")) {
					const identifier = url.pathname.split('/').pop();
					fetch(`https://hunterschools.myschoolapp.com/api/DataDirect/AssignmentCenterAssignments/?format=json&filter=1&dateStart=8%2F1%2F2024&dateEnd=10%2F1%2F2029&persona=2&statusList=&sectionList=`, {
						method: 'GET',
						//mode: 'no-cors',
						headers: {
							'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
							'Referer': 'https://google.com',
						}})
					.then(response => {
						if (!response.ok) {
							throw new Error(`HTTP error! Status: ${response.status}`);
						}
						return response.text(); // Use text() first to inspect the raw response
						})
						
					.then(data => {
						data = JSON.parse(data);

						console.log(identifier)
					// Find the item with the specific key
						const item = data.find(item => item.assignment_index_id == identifier);
			
						if (item) {
							const newLink = `https://hunterschools.myschoolapp.com/app/student#assignmentdetail/${item.assignment_id}/${item.assignment_index_id}/0/studentmyday--assignment-center`;

							chrome.tabs.update(tabId, { url: newLink });
						} else {
							console.log("No item")
						}
					})
					.catch(error => console.error('Error fetching data:', error));
				} else if (url.pathname.includes("assignment-center")) {
					chrome.tabs.update(tabId, { url: "https://hunterschools.myschoolapp.com/app/student#studentmyday/assignment-center" });
				
				}

			}
		} else {
			console.error('Not website ' + url.hostname );
		}
	}
});
