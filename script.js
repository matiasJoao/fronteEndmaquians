document.getElementById('loginForm').addEventListener('submit', async function(event) {
    event.preventDefault();

    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    try {
        const response = await axios.post('http://localhost:3333/login', {
            numberRegister: username,
            password: password
        });
        console.log(response)

        if (response.status === 200) {
            alert('Login successful');
            let key = 'name'
            const a = JSON.stringify(response)
            localStorage.setItem(key, response.data.name)
            window.location.href = 'landing.html';
        } 
    } catch (error) {
        console.error('errro', error)
        alert('Usuario ou senha incorreta');
    }
});
