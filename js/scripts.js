const dashBoardPage = document.getElementById('dashboardPage')
function handleLogin() {
    const loginPage = document.getElementById('loginPage')
    const userName = document.getElementById('usernameInput').value
    const userPassword = document.getElementById("passwordInput").value
    const errorMessage = document.getElementById('loginError')
    if (userName === 'admin' && userPassword === 'admin123') {
        loginPage.classList.add('hidden')
        dashBoardPage.classList.remove('hidden')
        loadIssues("all")
    } else {
        errorMessage.classList.remove('hidden')
    }


}
function loadIssues(tab) {
    fetch('https://phi-lab-server.vercel.app/api/v1/lab/issues')
        .then(result => result.json())
        .then(data => {
            let issues = data.data
            if (tab === 'open') issues = issues.filter(issue => issue.status === 'open')
            if (tab === 'closed') issues = issues.filter(issue => issue.status === 'closed')
            document.getElementById('loadingSpinner').classList.add('hidden')
            document.getElementById('issueCountText').textContent = `${issues.length} Issues`
            renderCards(issues)
        })
}

function renderCards(issues) {
    const grid = document.getElementById("issues-Grid");
    const noResults = document.getElementById("noResults");

    grid.innerHTML = "";

    if (!issues || issues.length === 0) {
        grid.classList.add("hidden");
        noResults.classList.remove("hidden");
        return;
    }

    noResults.classList.add("hidden");
    grid.classList.remove("hidden");

    issues.forEach(issue => {
        const isOpen = issue.status === "open";
        const borderColor = isOpen ? "border-t-green-500" : "border-t-purple-500";
        const statusIcon = isOpen ? "./assets/Open-Status.png" : "./assets/Closed- Status .png";

        const labels = (issue.labels || []).map(label =>
            `<span style="font-size:11px; padding: 2px 8px; border-radius: 999px; ${getLabelColor(label)}">${label}</span>`
        ).join("");

        const priorityColor = getPriorityColor(issue.priority);

        const card = document.createElement("div");
        card.className = `bg-white rounded-lg shadow-sm border-t-4 ${borderColor} p-4`;

        card.innerHTML = `
      <div class="flex items-center justify-between mb-3">
        <img src="${statusIcon}" alt="status" class="w-5 h-5" />
     <span style="${priorityColor}" class="text-xs font-semibold px-2 py-0.5 rounded-full cursor-pointer" id="priority-${issue.id}">${issue.priority || "N/A"}</span>
      </div>
      <h3 class="font-semibold text-gray-800 text-sm mb-1">${issue.title}</h3>
      <p class="text-gray-500 text-xs mb-3">${issue.description ? issue.description.slice(0, 80) + "..." : ""}</p>
      <div class="flex flex-wrap gap-1 mb-3">${labels}</div>
      <div class="text-xs text-gray-400">
        <p>#${issue.id} by ${issue.author || "unknown"}</p>
        <p>${formatDate(issue.createdAt)}</p>
      </div>
    `;

        card.querySelector(`#priority-${issue.id}`).addEventListener("click", () => openModal(issue.id));
        grid.appendChild(card);
    });
}
function getPriorityColor(priority) {
    if (priority === 'high') return 'background:#fee2e2; color:#ef4444;'
    if (priority === 'medium') return 'background:#fef9c3; color:#ca8a04;'
    if (priority === 'low') return 'background:#f3f4f6; color:#6b7280;'
    return ''
}

function getLabelColor(label) {
    if (label === 'bug') return 'border: 1px solid #f87171; color:#ef4444; background:#fef2f2;'
    if (label === 'help wanted') return 'border: 1px solid #fb923c; color:#f97316; background:#fff7ed;'
    if (label === 'enhancement') return 'border: 1px solid #4ade80; color:#16a34a; background:#f0fdf4;'
    if (label === 'documentation') return 'border: 1px solid #60a5fa; color:#3b82f6; background:#eff6ff;'
    if (label === 'good first issue') return 'border: 1px solid #c084fc; color:#a855f7; background:#faf5ff;'
    return 'border: 1px solid #d1d5db; color:#6b7280; background:#f9fafb;'
}

function formatDate(dateStr) {
    if (!dateStr) return ''
    const d = new Date(dateStr)
    return d.toLocaleDateString('en-GB')
}
function openModal(id) {
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issue/${id}`)
        .then(res => res.json())
        .then(data => {
            const issue = data.data

            document.getElementById('modalTitle').textContent = issue.title
            document.getElementById('modalOpenedBy').textContent = `• Opened by ${issue.author}`
            document.getElementById('modalDate').textContent = `• ${issue.createdAt}`
            document.getElementById('modalBody').textContent = issue.description
            document.getElementById('modalAssignee').textContent = issue.assignee || 'Unassigned'
            document.getElementById('modalPriority').textContent = issue.priority

            const statusEl = document.getElementById('modalStatus')
            statusEl.textContent = issue.status === 'open' ? 'Opened' : 'Closed'
            statusEl.style = issue.status === 'open' ? 'background:#22c55e; color:white; padding: 2px 10px; border-radius: 999px; font-size: 12px;' : 'background:#a855f7; color:white; padding: 2px 10px; border-radius: 999px; font-size: 12px;'

            document.getElementById('issueModal').classList.remove('hidden')
        })
}
function closeModal() {
    document.getElementById('issueModal').classList.add('hidden')
}

// function openModal(id) {
//     console.log(id)
// }
function switchTab(tab) {
    document.getElementById('tabAll').className = 'px-5 py-2 rounded text-sm font-medium cursor-pointer bg-white text-gray-700 border border-gray-300'
    document.getElementById('tabOpen').className = 'px-5 py-2 rounded text-sm font-medium cursor-pointer bg-white text-gray-700 border border-gray-300'
    document.getElementById('tabClosed').className = 'px-5 py-2 rounded text-sm font-medium cursor-pointer bg-white text-gray-700 border border-gray-300'

    if (tab === 'all') document.getElementById('tabAll').className = 'px-5 py-2 rounded text-sm font-medium cursor-pointer bg-indigo-600 text-white'
    if (tab === 'open') document.getElementById('tabOpen').className = 'px-5 py-2 rounded text-sm font-medium cursor-pointer bg-indigo-600 text-white'
    if (tab === 'closed') document.getElementById('tabClosed').className = 'px-5 py-2 rounded text-sm font-medium cursor-pointer bg-indigo-600 text-white'

    loadIssues(tab)
}
function handleSearch() {
    const q = document.getElementById('searchInput').value.trim()
    if (!q) {
        loadIssues('all')
        return
    }
    fetch(`https://phi-lab-server.vercel.app/api/v1/lab/issues/search?q=${q}`)
        .then(res => res.json())
        .then(data => {
            const issues = data.data || []
            document.getElementById('issueCountText').textContent = `${issues.length} Issues`
            renderCards(issues)
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
