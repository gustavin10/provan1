import { TarefaController } from './controller/TarefaController.mjs';

const ctrl = new TarefaController();

function renderTabela() {
  const tbody = document.getElementById('tbl-tarefas');
  const lista = ctrl.listarTarefas();

  tbody.innerHTML = lista.length === 0
    ? `<tr><td colspan="4" class="text-center text-muted">Nenhuma tarefa cadastrada.</td></tr>`
    : lista.map(t => `
      <tr class="${t.concluida ? 'table-success' : ''}">
        <td class="${t.concluida ? 'text-decoration-line-through text-muted' : ''}">${t.descricao}</td>
        <td>
          <span class="badge ${t.concluida ? 'bg-success' : 'bg-warning text-dark'}">
            ${t.concluida ? 'Concluída' : 'Pendente'}
          </span>
        </td>
        <td class="text-muted small">${new Date(t.criadaEm).toLocaleString('pt-BR')}</td>
        <td>
          <button class="btn btn-sm btn-outline-primary me-1"
            onclick="editarTarefa('${t.id}')">Editar</button>
          <button class="btn btn-sm ${t.concluida ? 'btn-outline-warning' : 'btn-outline-success'} me-1"
            onclick="alternarConclusao('${t.id}')">
            ${t.concluida ? 'Reabrir' : 'Concluir'}
          </button>
          <button class="btn btn-sm btn-outline-danger"
            onclick="removerTarefa('${t.id}')">Excluir</button>
        </td>
      </tr>`
    ).join('');
}

function salvarTarefa(form) {
  const dados = Object.fromEntries(new FormData(form));
  try {
    const id = form.dataset.editId;
    if (id) {
      ctrl.atualizarTarefa(id, dados);
    } else {
      ctrl.adicionarTarefa(dados.descricao);
    }
    form.reset();
    delete form.dataset.editId;
    document.getElementById('btn-salvar').textContent = 'Adicionar';
    renderTabela();
    mostrarAlerta('Tarefa salva com sucesso!', 'success');
  } catch (e) {
    mostrarAlerta(e.message, 'danger');
  }
}

function editarTarefa(id) {
  const lista = ctrl.listarTarefas();
  const tarefa = lista.find(t => t.id === id);
  if (!tarefa) return;

  const form = document.getElementById('form-tarefa');
  form.descricao.value = tarefa.descricao;
  form.dataset.editId = id;
  document.getElementById('btn-salvar').textContent = 'Atualizar';
  form.scrollIntoView({ behavior: 'smooth' });
}

function removerTarefa(id) {
  if (!confirm('Confirma a exclusão da tarefa?')) return;
  ctrl.removerTarefa(id);
  renderTabela();
}

function alternarConclusao(id) {
  ctrl.alternarConclusao(id);
  renderTabela();
}

function mostrarAlerta(msg, tipo) {
  const div = document.getElementById('alerta');
  div.className = `alert alert-${tipo}`;
  div.textContent = msg;
  div.classList.remove('d-none');
  setTimeout(() => div.classList.add('d-none'), 3000);
}

Object.assign(window, {
  salvarTarefa,
  editarTarefa,
  removerTarefa,
  alternarConclusao,
});

document.addEventListener('DOMContentLoaded', renderTabela);