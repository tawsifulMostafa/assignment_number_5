const dashBoardPage = document.getElementById('dashboardPage')
function handleLogin() {
    const loginPage = document.getElementById('loginPage')
    const userName = document.getElementById('usernameInput').value
    const userPassword = document.getElementById("passwordInput").value
    const errorMessage = document.getElementById('loginError')
    if (userName === 'admin' && userPassword === 'admin123') {
        loginPage.classList.add('hidden')
        dashBoardPage.classList.remove('hidden')
        loadIssues()
    } else {
        errorMessage.classList.remove('hidden')
    }


}
function loadIssues() {
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(result => result.json())
        .then(data => {
            const issues = data.data
            renderCards(issues)
        })
}


function renderCards(issue) {
    document.getElementById('loadingSpinner').classList.add('hidden')
    const grid = document.getElementById('issues-Grid')
    grid.classList.remove('hidden')
    issue.forEach(issue => {
        const card = document.createElement('div')

        card.className = `bg-white rounded-lg shadow-sm border-t-4 p-4`
        card.innerHTML = `
       <div class="flex items-center justify-between mb-3">
       <img src="${issue.status === 'open' ? './assets/Open-Status.png' : './assets/Closed- Status .png'}" class="w-5 h-5" />
      <span style="${getPriorityColor(issue.priority)}" class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer" id="priority-${issue.id}">${issue.priority}</span>
      
       </div>
        <p>${issue.title}</p>
        <p class="text-gray-500 text-xs mb-3">${issue.description}</p>
        <div class="flex flex-wrap gap-1 mb-3">${issue.labels}</div>
        <div class="text-xs text-gray-400">
       <p>#${issue.id} by ${issue.author}</p>
      <p>${issue.createdAt}</p>
      </div>
`
        grid.appendChild(card)
        card.querySelector(`#priority-${issue.id}`).addEventListener('click', () => openModal(issue.id))
    })

}
function getPriorityColor(priority) {
    if (priority === 'high') return 'background:#fee2e2; color:#ef4444;'
    if (priority === 'medium') return 'background:#fef9c3; color:#ca8a04;'
    if (priority === 'low') return 'background:#f3f4f6; color:#6b7280;'
    return ''
}




// "id": 1,
//       "title": "Fix navigation menu on mobile devices",
//       "description": "The navigation menu doesn't collapse properly on mobile devices. Need to fix the responsive behavior.",
//       "status": "open",
//       "labels": [
//         "bug",
//         "help wanted"
//       ],
//       "priority": "high",
//       "author": "john_doe",
//       "assignee": "jane_smith",
//       "createdAt": "2024-01-15T10:30:00Z",
//       "updatedAt": "2024-01-15T10:30:00Z
