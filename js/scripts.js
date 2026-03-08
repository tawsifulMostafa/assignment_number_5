const dashBoardPage = document.getElementById('dashboardPage')
function handleLogin() {
    const loginPage = document.getElementById('loginPage')
    const userName = document.getElementById('usernameInput').value
    const userPassword = document.getElementById("passwordInput").value
    const errorMessage = document.getElementById('loginError')
    if (userName === 'admin' && userPassword === 'admin123') {
        loginPage.classList.add('hidden') 
        dashBoardPage.classList.remove('hidden')


    } else {
        errorMessage.classList.remove('hidden')
    }
}