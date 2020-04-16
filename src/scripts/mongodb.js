// Listar databases
show dbs

// mudando o contexto para uma database
use herois

// Listar coleções (tabelas)
show collections

//Criando um novo registro
db.herois.create({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

//É possível rodar códigos javascript dentro do MongoDB com algumas restrições (ex: promises)
for (let i=0; i<= 50000; i++) {
  db.herois.create({
    nome: `Clone-${i+1}`,
    poder: 'Velocidade',
    dataNascimento: '1998-01-01'
  })
}

//Retornando qto registros de uma collection
db.herois.count()

//Buscando registros
db.herois.find()
db.herois.find().pretty() // formatar o json
db.herois.find({}, { poder: 1, _id: 0}) //Forçar retornar apenas coluna poder e forçar não exibir coluna _id (visivel por padrão)

//create
db.herois.create({
  nome: 'Flash',
  poder: 'Velocidade',
  dataNascimento: '1998-01-01'
})

//read
db.herois.find()

//update
db.herois.update({_id: 'id do item'}, {
  $set: {nome: 'Mulher Maravilha'}
})

//delete
db.herois.remove({_id: 'id do item'})



