export class Tarefa {
  constructor({ id = null, descricao, concluida = false }) {
    this.id = id ?? crypto.randomUUID();
    this.descricao = descricao;
    this.concluida = concluida;
  }

  static validar(dados) {
    const erros = [];
    if (!dados.descricao?.trim()) erros.push('Descrição é obrigatória');
    return erros;
  }
}