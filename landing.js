document.addEventListener('DOMContentLoaded', async function() {
    let machines = [];

    const searchInput = document.getElementById('searchInput');
    const searchButton = document.getElementById('searchButton');
    const machineList = document.querySelector('.machine-list');

    // Função para renderizar a lista de máquinas
    function renderMachineList(machineData) {
        machineList.innerHTML = '';

        machineData.forEach(machine => {
            const machineItem = document.createElement('div');
            machineItem.classList.add('machine-item');
            machineItem.innerHTML = `
                <h3>${machine.name}</h3>
                <p>Serial: ${machine.serial}</p>
                <p>Descrição: ${machine.update_description}</p>
                <p>Ultima vez atualizado em: ${machine.update_at}</p>
                <p>Ultima vez atualizado por: ${machine.update_by}</p>
                <button class="edit-button">Editar</button>
            `;

            // Evento de clique no botão "Editar"
            machineItem.querySelector('.edit-button').addEventListener('click', () => {
                let storage = localStorage.getItem('name')
                console.log(storage)
                if(storage === null){
                    return alert('Para editar voce tem que estar logado!!!');
                }else{
                    renderEditForm(machine);
                }
                
            });

            machineList.appendChild(machineItem);
        });
    }

    // Função para renderizar o formulário de edição
    function renderEditForm(machine) {
        machineList.innerHTML = `
        <div class="edit-form">
            <h3>Editando: ${machine.name}</h3>
            <label for="editName">Nome:</label>
            <input type="text" id="editName" readonly value="${machine.name}">
            <label for="editSerial">Serial:</label>
            <input type="text" id="editSerial" readonly value="${machine.serial}">
            <label for="editDescription">Nova Descrição:</label>
            <textarea id="editDescription"></textarea>
            <label for="editUpdatedAt">Atualizado em:</label>
            <input type="text" id="editUpdatedAt" readonly value="${machine.update_at}">
            <label for="editUpdatedBy">Atualizado por:</label>
            <input type="text" id="editUpdatedBy" readonly value="${machine.update_by}">
            <button class="save-button">Salvar</button>
            <button class="cancel-button">Cancelar</button>
        </div>
        `;

        // Evento de clique no botão "Salvar"
        document.querySelector('.save-button').addEventListener('click', async () => {
            const description = document.getElementById('editDescription').value;
            const serial = document.getElementById('editSerial').value;
            const getValue = localStorage.getItem('name')
            const body = {
                description: description,
                serial: serial,
                UpdateBy: getValue
            }

             await axios.patch('https://backendmaquinas.onrender.com/atualizar-maquina', body ).then(response => {
                if (response.status === 200) {
                    alert('Máquina atualizada com sucesso');
                    renderMachineList(machines);
                    location.reload()
                } else {
                    alert('Falha ao atualizar a máquina');
                }
             }).catch(error => {
                     console.error('Erro ao tentar atualizar a máquina:', error);
                     alert('Erro ao tentar atualizar a máquina. Verifique a console para mais detalhes.');
                 });

            renderMachineList(machines);
        });

        // Evento de clique no botão "Cancelar"
        document.querySelector('.cancel-button').addEventListener('click', () => {
            renderMachineList(machines);
        });
    }

    // Função para filtrar máquinas por nome
    function filterMachinesByName(name) {
        return machines.filter(machine => machine.name.toLowerCase().includes(name.toLowerCase()));
    }

    async function loadMachineList() {
        try {
            const response = await axios.get('https://backendmaquinas.onrender.com/listar-maquinas');

            if (response.status === 200) {
                machines = response.data;
                renderMachineList(machines);
            } else {
                alert('Falha ao carregar a lista de máquinas');
            }
        } catch (error) {
            console.error('Erro ao tentar obter a lista de máquinas:', error);
            alert('Erro ao tentar obter a lista de máquinas. Verifique a console para mais detalhes.');
        }
    }
    await loadMachineList();

    // Evento de clique no botão de busca
    searchButton.addEventListener('click', () => {
        const searchTerm = searchInput.value.trim();
        const filteredMachines = filterMachinesByName(searchTerm);
        renderMachineList(filteredMachines);
    });
    backButton.addEventListener('click', () => {
        window.location.href = 'index.html'; 
    });
});
