const Persons = ({contactsShown, onClick}) => (
  <div>
    {contactsShown.map(person => (
  
      <div key={person.name}>
        {person.name} {person.number}
       <button onClick={() => onClick(person.id)}>delete</button>
       </div>
    ))}
  </div>
)

export default Persons