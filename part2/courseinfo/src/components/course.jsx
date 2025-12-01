const Header = ({ header }) => {
  return <h1>{header}</h1>
}
const Total = ({ parts }) => {
  const total = parts.reduce((acc, curr) => acc + curr.exercises, 0)

  return (
    <div><b>total of {total}</b></div>
  )
}

const Part = ({ part }) => {
  return <div>{part.name} {part.exercises}</div>
}

const Content = ({ parts }) => {
  return (
    <div>
      {parts.map(part => {
        return <Part key={part.id} part={part}/>
      })}
    </div>
  )
}

const Course = ({ course }) => {
  return (
    <div>
      <Header header={course.name}/>
      <Content parts={course.parts}/>
      <Total parts={course.parts}/>
    </div>
  )
}

export default Course