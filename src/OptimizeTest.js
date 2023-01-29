import React,  { useState, useEffect } from "react"


//React.memo 를 이용하여 count가 변경되도 text가 렌더링 되지 않음
const TextView = React.memo(({text}) => {
  useEffect(() => {
    console.log(`Update :: Text : ${text}`)
  })
  return <div>{text}</div>
})

const CountView = ({count}) => {
  useEffect(() => {
    console.log(`Update :: Count : ${count}`)
  })
  return <div>{count}</div>
}

const OptimizeTest = () => {

  const [count, setCount] = useState(1)
  const [text, setText] = useState("");

  return (
    <div style={{padding: 50}}>
      <div>
        <h2>count</h2>
        <CountView count={count} />
        <button onClick={() => {setCount(count + 1)}}>+</button>
      </div>
      <div>
        <h2>text</h2>
        <TextView text={text} />
        <input value={text} onChange={(e) => setText(e.target.value)} /> 
     </div>
    </div>
  )
}

export default OptimizeTest