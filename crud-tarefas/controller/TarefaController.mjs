import { Tarefa } from '../model/Tarefa.mjs';
import { TarefaService } from '../service/TarefaService.mjs';

const svc = new TarefaService();

export class TarefaController {
  listarTarefas() {
    return svc.buscarTodas();
  }

  adicionarTarefa(descricao) {
    const erros = Tarefa.validar({ descricao });
    if (erros.length) throw new Error(erros.join(' | '));

    const lista = svc.buscarTodas();
    const tarefa = new Tarefa({ descricao });
    lista.push(tarefa);
    svc.salvarTodas(lista);
    return tarefa;
  }

  atualizarTarefa(id, novosDados) {
    const erros = Tarefa.validar(novosDados);
    if (erros.length) throw new Error(erros.join(' | '));

    const lista = svc.buscarTodas().map(t =>
      t.id === id ? { ...t, ...novosDados, id } : t
    );
    svc.salvarTodas(lista);
  }

  removerTarefa(id) {
    const lista = svc.buscarTodas().filter(t => t.id !== id);
    svc.salvarTodas(lista);
  }

  alternarConclusao(id) {
    const lista = svc.buscarTodas().map(t =>
      t.id === id ? { ...t, concluida: !t.concluida } : t
    );
    svc.salvarTodas(lista);
  }
}