## Objetivo - 1

Recebemos um códgio mal estruturado, com alto acoplamento, mal otimizado e complexo de ler e entender. Objetivo é melhorar o código como um todo. O sistema atual está dessa maneira:

![Untitled](https://prod-files-secure.s3.us-west-2.amazonaws.com/f778cd8b-6c5f-4fbf-96e7-e587ebcde82a/6816dfdd-57f9-4f19-980e-035641f4ddb4/Untitled.png)

O objetivo é diminuir o numero de métodos (responsabilidades) do ‘Sistema’. Será implementado tambem um classe de ‘Pagamento’. Para calcular o sálario teremos uma classe ‘CalcularSalario’ e outra para lidar com o ‘QuadroDeColaboradores’, onde vamos contratar, demitir e buscar esses colaboradores.

## **O que é acoplamento?**

Na engenharia de software é o grau de dependencia entre diferentes partes de um sistema. Sistema com alto acoplamento significa que os módulos estão muito conectados, assim, alterar um módulo pode afetar os demais.

## **Principais tipos de acoplamento:**

### **1- Data Coupling (Acoplamento de Dados):**

Quando o módulo depende apenas das estruturas de dados específicas do outro modulo.

```tsx
class Usuario {
  constructor(private nome: string) {}

  getNome(): string {
    return this.nome;
  }
}

class GerenciadorUsuario {
  constructor(private usuario: Usuario) {}

  mostrarNomeUsuario(): void {
    console.log(this.usuario.getNome());
  }
}

// Utilização dos Módulos A e B
const usuario = new Usuario("Ana");
const gerenciadorUsuario = new GerenciadorUsuario(usuario);
gerenciadorUsuario.mostrarNomeUsuario();
```

Neste exemplo, o `GerenciadorUsuario` depende diretamente do `Usuario` para funcionar corretamente, logo, qualquer alteração na estrutura ou comportamento da classe `Usuario` pode afetar diretamente o `GerenciadorUsuario`.

### **2 -**  **Stamp Coupling (Acoplamento por Carimbo):**

Onde os módulos compartilham muitos campos em uma estrutura de dados complexas, mas cada módulo usa apenas um subconjunto desses campos.

```tsx
// Módulo A
class Pedido {
  constructor(
    private id: number,
    private descricao: string,
    private valor: number
  ) {}

  getId(): number {
    return this.id;
  }
}

// Módulo B
class GerenciadorPedido {
  constructor(private pedido: Pedido) {}

  mostrarIdPedido(): void {
    console.log(this.pedido.getId());
  }
}

// Utilização dos Módulos A e B
const pedido = new Pedido(1, "Produto A", 100);
const gerenciadorPedido = new GerenciadorPedido(pedido);
gerenciadorPedido.mostrarIdPedido();
```

Neste exemplo, o `GerenciadorPedido` depende de um objeto `Pedido` que possui uma estrutura de dados complexa, mas apenas usa um subconjunto específico de campos desse objeto (`id`). Isso demonstra um acoplamento por carimbo.

### **3 -**  **Control Coupling (Acoplamento de Controle):**

Envolve a dependência entre módulos devido ao compartilhamento de informações de controle, como valores de flags, ou indicadores que afetam o fluxo de execução do programa.

```tsx
// Módulo A
class ProcessadorPagamento {
  processarPagamento(status: boolean): void {
    if (status) {
      console.log("Pagamento processado com sucesso.");
    } else {
      console.log("Falha ao processar pagamento.");
    }
  }
}

// Módulo B
class CarrinhoCompras {
  constructor(private processador: ProcessadorPagamento) {}

  finalizarCompra(status: boolean): void {
    this.processador.processarPagamento(status);
  }
}

// Utilização dos Módulos A e B
const processador = new ProcessadorPagamento();
const carrinho = new CarrinhoCompras(processador);
carrinho.finalizarCompra(true);
```

Neste exemplo, o `CarrinhoCompras` depende do `ProcessadorPagamento` para determinar se a compra deve ser finalizada com sucesso ou não, com base no status do pagamento. Isso demonstra um acoplamento de controle

### **4 -**  **Common Coupling (Acoplamento Comum):**

Ocorre quando dois ou mais módulos dependem de um terceiro módulo comum para realizar suas funções. Isso cria uma forte interdependência entre os módulos, tornando o sistema mais difícil de ser modularizado.

```tsx
// Módulo A
class Log {
  registrarMensagem(mensagem: string): void {
    console.log(`[LOG] ${mensagem}`);
  }
}

// Módulo B
class ServicoAutenticacao {
  constructor(private log: Log) {}

  autenticarUsuario(): void {
    // Lógica de autenticação
    this.log.registrarMensagem("Usuário autenticado com sucesso.");
  }
}

// Utilização dos Módulos A e B
const log = new Log();
const servicoAutenticacao = new ServicoAutenticacao(log);
servicoAutenticacao.autenticarUsuario();
```

Neste exemplo, o `ServicoAutenticacao` depende do `Log` para registrar mensagens de log durante o processo de autenticação. Ambos os módulos compartilham a mesma dependência do `Log`, demonstrando um acoplamento comum.

### **5 -**  **Content Coupling (Acoplamento de Conteúdo):**

Onde um módulo depende diretamente da implementação interna do outro módulo, acessando e manipulando suas variáveis internas.

```tsx
// Módulo A
class Calculadora {
  private resultado: number = 0;

  somar(a: number, b: number): void {
    this.resultado = a + b;
  }

  obterResultado(): number {
    return this.resultado;
  }
}

// Módulo B
class Logger {
  private calculadora: Calculadora;

  constructor(calculadora: Calculadora) {
    this.calculadora = calculadora;
  }

  registrarLog(): void {
    console.log(`Resultado da operação: ${this.calculadora.obterResultado()}`);
  }
}

// Utilização dos Módulos A e B
const calculadora = new Calculadora();
calculadora.somar(2, 3);
const logger = new Logger(calculadora);
logger.registrarLog();
```

Neste exemplo, o `Logger` depende diretamente da implementação interna da classe `Calculadora`, usando e manipulando sua variável interna `resultado`. Isso demonstra um acoplamento de conteúdo, considerado o tipo mais forte.

## Dividindo responsabilidades em classes

A primeira coisa que vamos fazer é criar um método de calcular salario. Para isso criamos um arquivo ‘`CalcularSalario.ts`’ e recortamos o codigo de ‘`*calcularSalario`’\* do Sistema e refatoramos nesse arquivo.

```tsx
import { Cargos } from "./enum/cargos";

export default class CalcularSalario {
  protected salarioBase: number;

  constructor(salarioBase: number = 1000) {
    this.salarioBase = salarioBase;
  }

  calcular(cargo: Cargos) {
    if (cargo === Cargos.Estagiario) {
      return this.salarioBase * 1.2;
    } else if (cargo === Cargos.Junior) {
      return this.salarioBase * 3;
    } else if (cargo === Cargos.Pleno) {
      return this.salarioBase * 5;
    } else if (cargo === Cargos.Senior) {
      return this.salarioBase * 7;
    }
    return 0;
  }
}
```

Perceba que nesse caso renomeamos o método para `calcular`, pois na hora de usarmos o nome da classe já explicativo.

Agora vamos desacoplar o método ‘`pagaColaborador`’. Para isso vamos criar um arquivo ‘`Pagamento.ts`’ e recortamos o codigo do sistema e refatoramos nesse arquivo.

```tsx
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
```

Nesse exemplo, tambêm renomeamos o nome do método pois o nome da classe para `pagar` ja é explicativo. Nesse método usamos a classe `CalcularSalario`, e demonstra a facilidade de entender quando colocamos nomes explicativos.

Agora vamos recortar do sistema o método ‘`*gerarRelatorioJSON`’ e refatorar no arquivo ‘`GerarRelatorio.ts`’\*

```tsx
import CalcularSalario from "./CalcularSalario";
import Colaborador from "./Colaborador";

export default class GerarRelatorio {
  constructor(
    private _colaboradores: Colaborador[],
    private servicoCalculaSalario: CalcularSalario
  ) {}

  gerarJSON() {
    let relatorio = this._colaboradores.map((colaborador) => {
      return {
        nome: colaborador.nome,
        cargo: colaborador.cargo,
        salario: this.servicoCalculaSalario.calcular(colaborador.cargo),
      };
    });
    return JSON.stringify(relatorio);
  }
}
```

Para finalizar vamos renomear o ‘`Sistema`’ para ‘`QuadroColaboradores`’, pois ficaram somente métodos relacionado aos colaboradores.

```
import Colaborador from "./Colaborador";

export default class QuadroColaboradores {
  private _colaboradores: Colaborador[];
  protected salarioBase: number;

  constructor(salarioBase: number = 1000) {
    this._colaboradores = [];
    this.salarioBase = salarioBase;
  }

  contratar(colaborador: Colaborador) {
    this._colaboradores.push(colaborador);
  }

  demitir(colaboradorChave: Colaborador) {
    this._colaboradores = this._colaboradores.filter(
      (colaborador) => colaborador !== colaboradorChave
    );
  }

  get colaboradores() {
    return this._colaboradores;
  }
}

```

agora para testarmos, vamos no arquivo principal fazer as alterações necessarias para podermos testar:

```tsx
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
```

```json
// Output
[
	{"nome":"José","cargo":"Estagiário","salario":1200},
	{"nome":"Maria","cargo":"Júnior","salario":3000},
	{"nome":"João","cargo":"Pleno","salario":5000}
]

Colaborador { nome: 'José', _cargo: 'Estagiário', _saldo: 0 }
Colaborador { nome: 'José', _cargo: 'Estagiário', _saldo: 1200 }
```
