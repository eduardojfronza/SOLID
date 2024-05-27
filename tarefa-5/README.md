## Objetivo - 5

O time de infra trouxe uma demanda relacionada ao módulo que lida com clientes nele:

- Temos um controller que possui a função de adicionar um cliente e listar todos os clientes do banco de dados;
- Temos um repositório que possui a implementação de como o banco é acessado para cada uma das funcionalidades do controller.

A equipe, sem muito planejamento, começou usando um banco em memória, para desenvolvimento e manteve-o em produção. Com isso, nosso objetivo será possibilitar/flexibilizar a adição de outro banco, como o Postgres, por exemplo. Atualmente, todas as funcionalidades estão acopladas ao banco em memória (um vetor).

## Injeção de dependência e Inversão de dependência

Antes de sabermos as diferenças precisamos saber o conceito de **Dependência** em programação orientada a objeto.

**Dependência** refere-se à relação entre diferentes partes de um sistema de software, no qual uma classe ou componente depende de outro para realizar suas operações. Essa dependência pode ser de diferentes tipos: uma classe pode depender de outra para realizar uma tarefa específica, ou pode depender de uma interface para interagir com diferentes implementações.

## Injeção de dependência

Esse conceito é um padrão de design que envolve **fornecer as dependências de um objeto externamente, em vez de criar essas dependências dentro do objeto**. Ou seja, as dependências são “injetadas” no objeto por meio de construtores, métodos ou propriedades.

Por exemplo, considere uma classe `Cliente` que depende de uma implementação da interface `Serviço`. Em vez de criar uma instância de `Serviço` dentro da classe `Cliente`, a dependência de `Serviço` é injetada no `Cliente` por meio do construtor:

```tsx
interface Servico {
  realizarOperacao(): void;
}

class Cliente {
  private servico: Servico;

  constructor(servico: Servico) {
    this.servico = servico;
  }

  executarOperacao(): void {
    this.servico.realizarOperacao();
  }
}

class ImplementacaoServicoA implements Servico {
  realizarOperacao(): void {
    console.log("Executando operação na ImplementacaoServicoA");
  }
}

class ImplementacaoServicoB implements Servico {
  realizarOperacao(): void {
    console.log("Executando operação na ImplementacaoServicoB");
  }
}

const clienteComServicoA = new Cliente(new ImplementacaoServicoA());
clienteComServicoA.executarOperacao(); // Saída: Executando operação na ImplementacaoServicoA

const clienteComServicoB = new Cliente(new ImplementacaoServicoB());
clienteComServicoB.executarOperacao(); // Saída: Executando operação na ImplementacaoServicoB
```

Aqui, a dependência `Servico` é injetada no objeto `Cliente` por meio do construtor, permitindo que diferentes implementações de `Servico` sejam usadas sem modificar a classe `Cliente`.

## Inversão de dependência

É um dos conceitos do SOLID que afirma que a classes de alto nível não devem depender de classes de baixo nível. Em vez disso, ambas devem depender de abstrações, ou seja interfaces.

Abstrações não devem depender de detalhes de implementação, mas os detalhes é que deve depender de abstrações.

Por exemplo, considere um cenário em que a classe `Cliente` depende diretamente da classe `ImplementacaoServicoA`, como mostrado abaixo:

```tsx
class Cliente {
  private servico: ImplementacaoServicoA;

  constructor() {
    this.servico = new ImplementacaoServicoA();
  }

  executarOperacao(): void {
    this.servico.realizarOperacao();
  }
}
```

Esta implementação viola o princípio, porque a classe `Cliente` está diretamente ligada à implementação específica de `Servico`, tornando-a menos flexível e difícil de testar.

Porém, ao aplicar a Inversão de Dependência, a classe `Cliente` depende de uma abstração (`Servico`), em vez de uma implementação concreta:

```tsx
// O servico vai ser uma interface, nesse caso é assim:
// interface Servico {
//  realizarOperacao(): void;
// }

class Cliente {
  private servico: Servico;

  constructor(servico: Servico) {
    this.servico = servico;
  }

  executarOperacao(): void {
    this.servico.realizarOperacao();
  }
}
```

Com essa modificação, a classe `Cliente` agora depende de uma abstração (`Servico`), permitindo que diferentes implementações de `Servico` sejam injetadas, seguindo o princípio.

## **Ilustrando o princípio de inversão de dependência**

![Untitled](assets/quadro.png)

Note que à esquerda, temos uma máquina panificadora, pois só pode fazer pães. Se observarmos, o batedor do tipo gancho está fixo na panificadora, o que significa que seria necessário danificar a máquina para poder encaixar outro tipo de batedor, como o utilizado para fazer biscoitos ou sorvetes.

Isso contrasta com o cenário apresentado no segundo princípio, da batedeira planetária, que possui uma interface que permite o uso de diferentes tipos de batedores. Assim, a batedeira planetária continuaria funcionando independentemente do tipo de batedor utilizado, graças à flexibilidade proporcionada pela interface.

Nos código fica da seguinte maneira:

```tsx
// errado
interface Batedor {
  bater(): void;
}

class BatedorGlobo implements Batedor {
  bater() {
    console.log("Com esse batedor eu posso fazer sorvete!");
  }
}

class BatedorLeque implements Batedor {
  bater() {
    console.log("Com esse batedor eu posso fazer biscoito!");
  }
}

class BatedorGancho implements Batedor {
  bater() {
    console.log("Com esse batedor eu posso fazer pão!");
  }
}

class Maquina {
  batedor: BatedorGancho;

  constructor() {
    this.batedor = new BatedorGancho();
  }

  bater(): string {
    return "Só bato os ingredientes com o batedor gancho!";
  }
}
```

```tsx
// correto
interface Batedor {
    bater(): void;
}

class BatedorGlobo implements Batedor {
    bater() {
        console.log("Com esse batedor eu posso fazer sorvete!");
    }
}

class BatedorLeque implements Batedor {
    bater() {
        console.log("Com esse batedor eu posso fazer biscoito!");
    }
}

class BatedorGancho implements Batedor {
    bater() {
        console.log("Com esse batedor eu posso fazer pão!");
    }
}

class Maquina {
    constructor(public batedor: Batedor) {}

    constructor() {
        this.batedor = new BatedorGancho();
    }

    bater(): string {
        return "Bato os ingredientes com o batedor que me derem!";
       }
    }
}

```

## Implementando uma nova forma de contrato

para começar vamos criar uma pasta dentro de ‘`repositories`’ chamada ‘`Interfaces`’, onde dentro dessa pasta vamos criar a interface de cliente: “`IClienteRepository`’:

```tsx
import Cliente from "../../entities/Cliente";

interface IClienteRepository {
  adicionaCliente(cliente: Cliente): void;
  listaClientes(): Cliente[];
}

export default IClienteRepository;
```

dentro do interface colocamos todos os métodos que estamos usando.

agora no ‘`ClienteController`' vamos implementar nossa interface:

```tsx
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
```

nessa caso, nos não vamos instanciar dentro do ‘`constructor`', vamos deixar com que outro módulo seja responsável por injetar essa instancia dentro do nosso controller.

agora precisamos que nossos repositorios ‘`InMemoryRepository`' e ‘`PostgresRepository`' implementem essa interface, e podemos fazer de duas formas:

```tsx
// Passando as funções
import Cliente from "../entities/Cliente";
import IClienteRepository from "./Interfaces/IClienteRepository";

export default class PostgresRepository implements IClienteRepository {
  private db: Record<number, Cliente>;

  constructor() {
    this.db = {};
  }

  adicionaCliente(cliente: Cliente): void {
    this.add(cliente);
  }

  listaClientes(): Cliente[] {
    return this.list();
  }

  add(cliente: Cliente) {
    this.db[cliente.id] = cliente;
  }

  list() {
    const clientes: Cliente[] = [];

    for (const chave in this.db) {
      if (Object.prototype.hasOwnProperty.call(this.db, chave)) {
        clientes.push(this.db[chave]);
      }
    }

    return clientes;
  }
}
```

```tsx
// Colocando a lógica dentro

import Cliente from "../entities/Cliente";
import IClienteRepository from "./Interfaces/IClienteRepository";

export default class PostgresRepository implements IClienteRepository {
  private db: Record<number, Cliente>;

  constructor() {
    this.db = {};
  }

  adicionaCliente(cliente: Cliente): void {
    this.db[cliente.id] = cliente;
  }

  listaClientes(): Cliente[] {
    const clientes: Cliente[] = [];

    for (const chave in this.db) {
      if (Object.prototype.hasOwnProperty.call(this.db, chave)) {
        clientes.push(this.db[chave]);
      }
    }

    return clientes;
  }
}
```

para ver tudo isso funcionando, vamos no arquivo ‘`main`' e vamos fazer uma pequena alteração, que é passar o ‘`repository`' que vamos usar.

```tsx
const clienteController = new ClienteController(new PostgresRepository());
// ou
const clienteController = new ClienteController(new InMemoryRepository());
```

dessa forma não precisamos alterar o código, apenas alterar a injeção de dependencia.
