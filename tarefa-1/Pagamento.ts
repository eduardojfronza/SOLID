import CalcularSalario from "./CalcularSalario";
import Colaborador from "./Colaborador";

export default class Pagamento {
  constructor(private servicoCalculaSalario: CalcularSalario) {}

  pagar(colaborador: Colaborador) {
    const salarioColaborador = this.servicoCalculaSalario.calcular(
      colaborador.cargo
    );
    colaborador.saldo = salarioColaborador;
  }
}
