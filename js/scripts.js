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
    const grid = document.getElementById('issues-Grid')
    grid.classList.remove('hidden')
    issue.forEach(issue => {
        const card = document.createElement('div')
        grid.appendChild(card)
        card.className = `bg-white rounded-lg shadow-sm border-t-4 p-4`
        card.innerHTML = `
        <div>
        <h3>${issue.title}</h3>
        <p>${issue.description}</p>
        <span>${issue.labels}</span>
        <span>#${issue.id} ${issue.author}</span>
        <span>${issue.priority}</span>
        <span>${issue.createdAt}</span>
        </div>
        `
        })
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
