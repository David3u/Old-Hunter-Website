chrome.webRequest.onBeforeRequest.addListener(
(details) => {
	const url = new URL(details.url);

	// Is Hunter Website?
	if (url.hostname === 'myschoolapp.com') {
		// Is new style?
		if (url.pathname.includes("lms-assignment")) {
			// Is assignment?
			if (url.pathname.includes("assignment-student-view")) {
				const identifier = url.pathname.split('/').pop();
				fetch(`https://hunterschools.myschoolapp.com/api/DataDirect/AssignmentCenterAssignments/?format=json&filter=1&dateStart=9%2F1%2F2024&dateEnd=10%2F1%2F2024&persona=2&statusList=&sectionList=`)
				.then(response => response.json())
				.then(data => {
				  // Find the item with the specific key
					const item = data.find(item => item.assignment_index_id === identifier);
		
					if (item) {
						const newLink = `https://hunterschools.myschoolapp.com/app/student#assignmentdetail/${item.assignment_id}/${item.assignment_index_id}/0/studentmyday--assignment-center`;

						chrome.tabs.update(details.tabId, { url: newLink });
					}
				})
				.catch(error => console.error('Error fetching data:', error));
			} else if (url.pathname.includes("assignment-center")) {
				chrome.tabs.update(details.tabId, { url: "https://hunterschools.myschoolapp.com/app/student#studentmyday/assignment-center" });
			
			}

		}
	}

	return { cancel: false };
},
{ urls: ["<all_urls>"] },
["blocking"]
);