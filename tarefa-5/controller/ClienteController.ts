import Cliente from "../entities/Cliente";
import IClienteRepository from "../repositories/Interfaces/IClienteRepository";

export default class ClienteController {
  constructor(private repository: IClienteRepository) {}

  adicionaCliente(cliente: Cliente) {
    this.repository.adicionaCliente(cliente);
  }
  listaClientes() {
    return this.repository.listaClientes();
  }
}
