const mongoose = require('mongoose')

if (process.argv.length < 3) {
  console.log('give password as argument')
  process.exit(1)
}

const password = process.argv[2]

const url = `mongodb+srv://fullstack:${password}@cluster0.wd8lfr.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.connect(url, { family: 4 })

const phonebookSchema = new mongoose.Schema({
  name: String,
  number: String,
})

const Phonebook = mongoose.model('Phonebook', phonebookSchema)

// show all contacts
if (process.argv.length === 3) {
  Phonebook.find({}).then(phonebooks => {
    console.log('phonebook:')
    phonebooks.forEach(p => console.log(p.name, p.number))
    mongoose.connection.close()
  })
  
}

// if complete arguments then save the contact
if (process.argv.length === 5) {
  const phonebook = new Phonebook({
    name: process.argv[3],
    number: process.argv[4],
  })

  phonebook.save().then(result => {
    console.log(`added ${phonebook.name} number ${phonebook.number} to phonebook`)
    mongoose.connection.close()
  })
}




