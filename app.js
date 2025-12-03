//Julia Lemos
const API_URL = 'http://localhost:3000/api';
let currentToken = localStorage.getItem('token') || null;


let isFormVisible = false;


function updateDesktopUI() { 
    const loginSection = document.getElementById('login-section'); 
    const userManagement = document.getElementById('user-management'); 
    
    if (currentToken) { 
        loginSection.style.display = 'none'; 
        userManagement.style.display = 'block'; 
        loadUsers(); 
    } else { 
        loginSection.style.display = 'block'; 
        userManagement.style.display = 'none'; 
        hideForm(); 
    } 
} 

function updateFormVisibility() {
    const formContainer = document.getElementById('user-form-container');
    const newUserBtn = document.querySelector('#user-management > button:first-of-type');
    
    // Oculta o botão 'Novo Usuário' se o formulário estiver visível
    newUserBtn.style.display = isFormVisible ? 'none' : 'block'; 
    formContainer.style.display = isFormVisible ? 'block' : 'none';
}

function logout() { 
    localStorage.removeItem('token'); 
    currentToken = null; 
    updateDesktopUI(); 
} 


async function handleLogin() { 
    const nome = document.getElementById('login-nome').value; 
    const senha = document.getElementById('login-senha').value; 
    const msg = document.getElementById('login-message'); 

    if (!nome || !senha) {
        msg.textContent = 'Nome e Senha são obrigatórios.';
        return;
    }
    
    try { 
        const response = await fetch(`${API_URL}/auth/login`, { 
            method: 'POST', 
            headers: { 'Content-Type': 'application/json' }, 
            body: JSON.stringify({ nome, senha }) 
        }); 
        
        const data = await response.json(); 
        
        if (response.ok) { 
            localStorage.setItem('token', data.token); 
            currentToken = data.token; 
            msg.textContent = 'Login bem-sucedido!'; 
            updateDesktopUI(); 
        } else { 
            msg.textContent = data.error || 'Erro no login.'; 
        } 
    } catch (e) { 
        msg.textContent = 'Erro de conexão com a API. Verifique se o servidor Node.js está rodando.'; 
    } 
} 

// --- CRUD de Usuários --- 

async function loadUsers() { 
    const tableBody = document.getElementById('user-table').querySelector('tbody'); 
    tableBody.innerHTML = '<tr><td colspan="4">Carregando...</td></tr>';
    
    try { 
        const response = await fetch(`${API_URL}/usuarios`, { 
            headers: { 'Authorization': `Bearer ${currentToken}` } 
        }); 
        
        const users = await response.json(); 
        
        tableBody.innerHTML = ''; 
        
        if (response.ok && users.length > 0) {
            users.forEach(u => { 
                const row = tableBody.insertRow(); 
                row.insertCell().textContent = u.Id; 
                row.insertCell().textContent = u.Nome; 
                row.insertCell().textContent = u.Status ? 'Ativo' : 'Inativo'; 
                
                const actionsCell = row.insertCell(); 
                
                // Botão Editar
                const editBtn = document.createElement('button'); 
                editBtn.textContent = 'Editar'; 
                editBtn.onclick = () => editUser(u); 
                actionsCell.appendChild(editBtn); 
                
                // Botão Deletar (ADICIONADO)
                const deleteBtn = document.createElement('button');
                deleteBtn.textContent = 'Deletar';
                deleteBtn.style.marginLeft = '5px';
                deleteBtn.onclick = () => deleteUser(u.Id);
                actionsCell.appendChild(deleteBtn);
            }); 
        } else {
            tableBody.innerHTML = '<tr><td colspan="4">Nenhum usuário encontrado.</td></tr>';
        }
        
    } catch (e) { 
        tableBody.innerHTML = '<tr><td colspan="4" style="color: red;">Erro ao carregar usuários.</td></tr>';
    } 
} 

async function saveUser() { 
    const id = document.getElementById('user-id').value; 
    const nome = document.getElementById('user-nome').value; 
    const senha = document.getElementById('user-senha').value; 
    const status = document.getElementById('user-status').value === 'true'; 
    const isEditing = !!id; 
    const method = isEditing ? 'PUT' : 'POST'; 
    const url = isEditing ? `${API_URL}/usuarios/${id}` : `${API_URL}/usuarios`; 
    
    const payload = { Nome: nome, Status: status }; 
    if (senha) payload.Senha = senha; 
    
    try { 
        const response = await fetch(url, { 
            method: method, 
            headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${currentToken}` }, 
            body: JSON.stringify(payload) 
        }); 
        
        if (response.ok) { 
            alert(`Usuário ${isEditing ? 'atualizado' : 'cadastrado'} com sucesso!`); 
            loadUsers(); 
            hideForm(); 
        } else { 
            const errorData = await response.json(); 
            alert(`Erro: ${errorData.error || 'Falha na operação.'}`);
        } 
    } catch (e) { 
        alert('Erro de conexão com a API.'); 
    } 
} 

async function deleteUser(id) {
    if (!confirm('Tem certeza de que deseja deletar este usuário?')) {
        return;
    }
    try {
        const response = await fetch(`${API_URL}/usuarios/${id}`, {
            method: 'DELETE',
            headers: { 'Authorization': `Bearer ${currentToken}` }
        });

        if (response.status === 204) { // Status 204 = Sucesso sem Conteúdo (DELETE)
            alert('Usuário deletado com sucesso!');
            loadUsers(); 
        } else if (response.status === 403) {
             alert('Erro: Você não pode deletar seu próprio usuário enquanto logado!');
        } else {
            const errorData = await response.json();
            alert(`Erro: ${errorData.error || 'Falha ao deletar.'}`);
        }
    } catch (e) {
        alert('Erro de conexão com a API.');
    }
}

function showCreateForm() { 
    document.getElementById('form-title').textContent = 'Cadastrar'; 
    document.getElementById('user-id').value = ''; 
    document.getElementById('user-nome').value = ''; 
    document.getElementById('user-senha').value = ''; 
    document.getElementById('user-status').style.display = 'none'; 
    
    isFormVisible = true;
    updateFormVisibility();
} 

function editUser(user) { 
    document.getElementById('form-title').textContent = 'Editar'; 
    document.getElementById('user-id').value = user.Id; 
    document.getElementById('user-nome').value = user.Nome; 
    document.getElementById('user-senha').value = ''; // Sempre limpa a senha na edição 
    document.getElementById('user-status').value = user.Status.toString(); 
    document.getElementById('user-status').style.display = 'inline'; 
    
    isFormVisible = true;
    updateFormVisibility();
} 

function hideForm() { 
    isFormVisible = false;
    updateFormVisibility();
    // Limpa o formulário após esconder
    document.getElementById('user-id').value = ''; 
    document.getElementById('user-nome').value = ''; 
    document.getElementById('user-senha').value = ''; 
    document.getElementById('form-title').textContent = 'Cadastrar';
} 


document.addEventListener('DOMContentLoaded', updateDesktopUI);