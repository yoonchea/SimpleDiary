
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

import { useCallback, useEffect, useMemo, useRef, useState } from "react";



function App() {

  const [data, setData] = useState([]);

  const dataId = useRef(0);

  //API호출, Promise를 반환하는 비동기호출
  const getData = async() => {
    const res = await fetch('https://jsonplaceholder.typicode.com/comments').then((res) => res.json())
    
    // 0~19번째 까지 자른 후 map함수를 써서 배열을 만든 후 initData에 저장 
    const initData = res.slice(0, 20).map((it) => {
      return {
        author: it.email,
        content: it.body,
        emotion: Number(Math.floor(Math.random() * 5) + 1),
        created_date: new Date().getTime(),
        id: dataId.current ++,
      }
    }) 
    setData(initData)
  }

  useEffect(() => {
    getData();
  },[])

  const onCreate = useCallback((author, content, emotion) => {
    const created_date = new Date().getTime();
    const newItem = {
      author,
      content,
      emotion,
      created_date,
      id : dataId.current
    }
    dataId.current += 1;
    setData((data) => [newItem, ...data]) 
  },[]);

  const onRemove = useCallback((targetId) => {
    setData(data => data.filter((it) => it.id !== targetId))
  }, [])

  const onEdit = useCallback((targetId, newContent) => {
    setData((data) =>
      data.map((it) =>
       it.id === targetId ? {...it, content: newContent} : it)
    )
  }, [])


  //useMemo로 부터 값을 return 받음
  const getDiaryAnalysis = useMemo(
    () => {
    const goodCount = data.filter((it) => it.emotion >= 3).length;
    const badCount = data.length - goodCount;
    const goodRatio = (goodCount / data.length) * 100;
    return {
      goodCount, badCount, goodRatio
    }
    },[data]
  )

  const {goodCount, badCount, goodRatio} = getDiaryAnalysis //useMemo 사용으로 인한 함수 사용 X

  return (
    <div className="App">
      {/* <OptimizeTest /> */}
      <DiaryEditor onCreate={onCreate} />
      <div>전체 일기 : {data.length}</div>
      <div>기분 좋은 일기 개수 : {goodCount}</div>
      <div>기분 나쁜 일기 개수 : {badCount}</div>
      <div>기분 좋은 일기 비율 : {goodRatio}%</div>
      <DiaryList onEdit={onEdit} onRemove={onRemove} diaryList={data} />
    </div>
  );
}

export default App;
