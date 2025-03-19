
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	// Check if the tab is loading and has a URL
	if (changeInfo.status === 'complete' && tab.url) {
		const url = new URL(tab.url);

		if (tab.url.includes("https://hunterschools.myschoolapp.com/app/student#studentmyday/assignment-center")) {
			setTimeout(() => {
				chrome.scripting.executeScript({
					target: { tabId: tabId },
					function: dueButton
				});
				}, 200);
		}

		// Is Hunter Website?
		if (url.hostname != 'hunterschools.myschoolapp.com') {
			return;
		}

		// Is new style?
		if (!(url.pathname.includes("lms-assignment"))) {
			return;
		}
				
		// Is assignment?
		if (url.pathname.includes("assignment-student-view")) {
			const identifier = url.pathname.split('/').pop();
			fetch(`https://hunterschools.myschoolapp.com/api/DataDirect/AssignmentCenterAssignments/?format=json&filter=1&dateStart=10%2F1%2F2024&dateEnd=10%2F1%2F2029&persona=2&statusList=&sectionList=`, {
				method: 'GET',
				headers: {
					'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/92.0.4515.107 Safari/537.36',
					'Referer': 'https://google.com',
				}})
			.then(response => {
				if (!response.ok) { throw new Error(`HTTP error! Status: ${response.status}`); }
				return response.text(); })
			.then(data => {
				data = JSON.parse(data);

				// Find the assignment object
				const item = data.find(item => item.assignment_index_id == identifier);
	
				if (item) {
					const newLink = `https://hunterschools.myschoolapp.com/app/student#assignmentdetail/${item.assignment_id}/${item.assignment_index_id}/0/studentmyday--assignment-center`;

					chrome.tabs.update(tabId, { url: newLink });
				} else {
					console.log("WTF!! Assignment doesn't exist!");
				}
			})
			.catch(error => console.error('Error fetching data:', error));

		// Is Assingment Center?	
		} else if (url.pathname.includes("assignment-center")) {
			chrome.tabs.update(tabId, { url: "https://hunterschools.myschoolapp.com/app/student#studentmyday/assignment-center" });
		}
	}

});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
	if (message.action === "pageLoaded") {
	chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
		chrome.scripting.executeScript({
		target: { tabId: tabs[0].id },
		function: dueButton
		});
	});
	}
});

function dueButton() {

	function waitForElement() {	
		const targetButton = document.querySelector("#calendar-header-container > div > div > div:nth-child(3) > div > div.col-md-4 > div > label:nth-child(3)");
		
		if (targetButton) {
			targetButton.click();
		} else {
			setTimeout(waitForElement, 300);
		}
	}
	
	waitForElement();
}