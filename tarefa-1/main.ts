import CalcularSalario from "./CalcularSalario";
import Colaborador from "./Colaborador";
import GerarRelatorio from "./GerarRelatorio";
import Pagamento from "./Pagamento";
import QuadroColaboradores from "./QuadroColaboradores";
import { Cargos } from "./enum/cargos";

const quadroColaboradores = new QuadroColaboradores();
const calculaSalario = new CalcularSalario();
const gerardorDeRelatorio = new GerarRelatorio(
  quadroColaboradores.colaboradores,
  calculaSalario
);
const pagamento = new Pagamento(calculaSalario);

const colaborador1 = new Colaborador("José", Cargos.Estagiario);
const colaborador2 = new Colaborador("Maria", Cargos.Junior);
const colaborador3 = new Colaborador("João", Cargos.Pleno);

quadroColaboradores.contratar(colaborador1);
quadroColaboradores.contratar(colaborador2);
quadroColaboradores.contratar(colaborador3);

console.log(gerardorDeRelatorio.gerarJSON());

console.log(colaborador1);
pagamento.pagar(colaborador1);
console.log(colaborador1);
