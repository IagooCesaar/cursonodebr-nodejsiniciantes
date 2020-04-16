# Repositório do projeto criado durante o curso Node.js para Iniciantes do [#NodeBR](https://nodebr.org/)

Link do curso: https://treinamento.nodebr.org/?origin=CursoErickWendel

## Conteúdo as aulas:

### Módulo 00 – Introdução ao curso

### Módulo 01 – Sincronia de funções Javascript

#### Aula 02: Neste módulo vimos sobre callbacks e promises

Nessa aula foi o primeiro "Boom" que deu no meu cérebro...
Vi instruturores em outros cursos utilizando ora o callback, ora a promise, mas em nenhum deles o instrutor aprofundo sobre o conceito de cada um deles (talvez para ganhar tempo...).
Mas neste curso pude realmente entender o conceito de cada uma deles e até mesmo converter um callback em um promise, manual ou automaticamente

#### Aula 03: EventEmitter

Nessa aula vimos sobre uma biblioteca do node que possuí um alta aplicabilidade. Pode ser utilizado, por exemplo, para geração de logs, para envio de notificações/alertas, para disparar outras funções, etc

### Módulo 02 – Manipulação de listas

#### Aula 04 - Listas

Nesta aula vimos sobre manipulação de listas (vetores):

- for / for in / for of
- Array.map
- Array.filter
- Array.reduce

### Módulo 03 – Introdução de testes automatizados

#### Aula 05 - Testes

Uma introdução ao desenvolvimento orientado a testes com a biblioteca Mocha

### Módulo 04 – Node.js além da Web - Criando ferramentas de linha de comando

#### Aula 06 - CLI

Criamos uma ferramenta de linha de comando para simular um CRUD com banco de dados em arquivo .json

### Módulo 05 – Nosso proketo multi-banco de dados

#### Aula 07 - Multi DB

Criado padrão de projeto (design patterns) Strategy para trabalhando com multi bancos, no que segue:

1. Criamos a classe **ICrud**. Esta classe será responsável por "interfacear" as estratégias relacionadas com CRUD nos nossos bancos de dados (MongoDB e Postgres). Ou seja, ela disponibilizará métodos padrões para que, independente da estratégia adotada, todas as classes de manipulação de dados no banco sejam uniformes. Deste modo, ao utilizarmos o método B da estratégia A, se o mesmo não estiver implementado, levantará uma exceção, se o mesmo possuir uma implementação, deverá executar conforme esperado

2. Depois criamos as classes que representarão nossos **schemas**, que são a representação/configuração de um objeto em um banco de dados. Para o MongoDB utilizamos o Mongoose, e para o Postgres utilizamos o Sequelize. Essas classes extendem métodos da classe ICrud

3. Então criamos as classes que irão compor nossas **estratégia** para manipulação desses dados nos respectivos bancos, que envolve desde a conexão até procedimentos de manipulação dos dados, considerando um schema específico. Essas classes, que extendem métodos da classe ICrud, foram nomeadas **MongoDB** e **Postgres**. Elas recebem em seus constrututores dois parâmetros essencias: _a conexão_ a ser utilizada (retornada por método estático da própria classe base) e _o schema dos dados_ que serão utilizados

4. Em seguida criamos nossa classe que implementa o nosso contexto de conexão e manipulação dos dados, denominada **ContextStrategy**. Ela recebe em seu construtor o parâmetro que definirá o contexto que deverá ser trabalhado. Ou seja: conterá os dados da conexão que deverá ser utilizada e o schema de dados que serão manipulados

5. Por último criamos nossos contextos que deverão ser trabalhados e os disponibilizamos para nossas rotas

Vide exemplo:

```
const connMongo = await MongoDB.connect();
const contextMongo = new Context(new MongoDB(connMongo, HeroiSchema));

const connPG = await Postgres.connect();
const modelUsuario = await Postgres.defineModel(connPG, UsuarioSchema);
const contextPG = new Context(new Postgres(connPG, modelUsuario));
```

### Módulo 06 – Introdução ao Postgres e Bancos Relacionais

#### Aula 08 - Multi DB - Implementação do Postgres

Conhecemos um pouco sobre o Sequelize e o Postgres, um banco de dados relacional

### Módulo 07 – Introdução ao MongoBD e Bancos Não Relacionais

#### Aula 09 - Multi DB - Implementação do MongoDB

Conhecemos um pouco sobre o MongoDB, um banco de dados não relacional

### Módulo 08 – Refatorando nosso projeto para bancos de dados multi-schemas

#### Aula 10 - Multi DB - Refatorando implementação do MongoDB

#### Aula 11 - Multi DB - Refatorando implementação do Postgres

### Módulo 09 – Node.js e Web Services - Criando serviços profissionais com Hapi.js

Nesse módulo, aulas 13 a 18, criamos as rotas do Web Service que serão responsáveis pelo CRUD de heróis.
para isto utilizamos a biblioteca Hapi.js

#### Aula 12 - HTTP

#### Aula 13 - Criando a estrutura da API

#### Aula 14 - Listando Heróis da API

#### Aula 15 - Validação de parâmetros com Joi

#### Aula 16 - Cadastrando novos Heróis na API

#### Aula 17 - Atualizando o cadastro de Heróis na API

#### Aula 18 - Deletando o cadastro de Heróios na API

### Módulo 10 – Documentação de Serviços com Swagger

#### Aula 19 - Documentação de rotas da API com o Swagger

Este eu considero o segundo "Boom" que deu no meu cérebro...
Ver toda a documentação da API ser gerada de forma tão rica e com tão pouco esforço foi demais!

Em projetos que trabalhei em outras oportunidades, tivemos de consumir um serviço privado que a empresa havia adquirido. Este serviço até continha alguma documentação, mas como não era o principal produto da mesma, a documentação era bastante precária. No final, após muitos e-mails e contatos telefônicos, consegui implementar a nossa solução que consumiria aquele serviço. Mas após olhar a riqueza de detalhes gerado pelo Swagger eu me lembrei instantaneamente deste episódio e, se estivesse documentado com esta biblioteca, meu trabalho teria sido muito mais simplificado

### Módulo 11 – Autenticação dom Json Web Token (JWT)

Este conteúdo é o que eu mais queria ver de todo o curso. Vi vídeos no youtube e também em artigos, mas a explicação que eu mais consegui abstrair informação foi a deste curso.
Agora estou mais tranquilo para poder aprofundar ainda mais no tópico

#### Aula 20 - Implementação de estratégia de autenticação com o JWT

Nesta aula aprendemos como implementar uma validação simples de autenticação e implementar o controle em todas as rotas, para então definir quais as rotas que não exigirão que exista um token válido no cabeçalho das solicitações (ex: login)

#### Aula 21 - Validação de usuários com o token JWT

Implementação da estratégia de validação do conteúdo do token

### Módulo 12 – Publicação de serviços na Web

Neste módulo vi sobre algumas práticas para publicação da serviços na Web.
Utilizamos ferramentas que possuem um plano free, como o Heroku (para hospedar o serviço), o PM2 (para monitorar indicadores do servidor, além de implementar serviços de clusters, e outros). Também utilizamos a biblioteca Istanbul, que verifica o quão coberto de testes está nossa API, identificando deste modo pontos sensíveis da aplicação.

- Neste link você poderá conferir a documentação gerado pelo Swagger: https://cursonodebr-nodejsiniciantes.herokuapp.com/documentation
- Neste link você poderá conferir a cobertura de testes da API: https://cursonodebr-nodejsiniciantes.herokuapp.com/coverage/

#### Aula 22 - Variáveis de ambiente (.env)

#### Aula 23 - Publicando API com Heroku

#### Aula 24 - Implementação de consulta de indicadores do servidor com PM2

#### Aula 25 - Percentual de cobertura do código com testes
