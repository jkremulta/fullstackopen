import { useState } from 'react'

const StatisticsLine = ({text, value}) => {
  return (
    <tr>
      <td>{text}</td>
      <td>{value}</td>
    </tr>
  )
}

const Statistics = ({good, neutral, bad}) => {
  const total = good + neutral + bad

  if (total == 0) {
    return (
      <>
        <h1>statistics</h1>
        <div>No feedback given</div>
      </>
    )
  }
  return (
    <>
      <h1>statistics</h1>
      <table>
        <tbody>
          <StatisticsLine text={"good"} value={good}/>
          <StatisticsLine text={"neutral"} value={neutral}/>
          <StatisticsLine text={"bad"} value={bad}/>
          <StatisticsLine text={"all"} value={good + neutral + bad}/>
          <StatisticsLine text={"average"} value={(good - bad) / total}/>
          <StatisticsLine text={"positive"} value={`${(good / total) * 100}%`}/>
        </tbody>
      </table>
    </>
  )
}

const Button = ({onClick, text}) => {
  return (
    <>
      <button onClick={onClick}>{text}</button>
    </>
  )
}

const App = () => {
  // save clicks of each button to its own state
  const [good, setGood] = useState(0)
  const [neutral, setNeutral] = useState(0)
  const [bad, setBad] = useState(0)

  return (
    <div>
      <h1>give feedback</h1>
      <div>
        <Button onClick={() => setGood(good + 1)} text={"good"}/>
        <Button onClick={() => setNeutral(neutral + 1)} text={"neutral"}/>
        <Button onClick={() => setBad(bad + 1)} text={"bad"}/>
      </div>
      <Statistics good={good} neutral={neutral} bad={bad}/>
    </div>
  )
}

export default App