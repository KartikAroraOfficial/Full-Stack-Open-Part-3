const mongoose = require('mongoose')

// check for password
if ( process.argv.length<3 ) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]
const url = `mongodb+srv://kartikarora346:${password}@cluster0.llpcbsd.mongodb.net/?retryWrites=true&w=majority`


mongoose.set('strictQuery',false)
mongoose.connect(url)

const personSchema = new mongoose.Schema({
  name: String,
  number: String,
})

personSchema.set('toJSON', {
  transform: (document, returnedObject) => {
      returnedObject.id = returnedObject._id.toString()
      delete returnedObject._id
      delete returnedObject.__v
  }
})

const Person = mongoose.model('Person', personSchema)

if( process.argv.length === 3) {
  Person.find({}).then(result => {
    console.log('phonebook:')
    console.log(typeof(result))
    result.map(peron => (
      console.log(peron['name'], peron['number'])
    ))
    mongoose.connection.close();
  })
}


if( process.argv.length === 5 ) {
  const person = new Person({
    name: process.argv[3],
    number: process.argv[4],
  })

  person.save().then(result => {
    console.log('note saved!')
    console.log('added', person['name'], 'number', person['number'], 'to phonebook')
    console.log(result);
    mongoose.connection.close()
  })
}

