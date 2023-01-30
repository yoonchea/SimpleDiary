
import './App.css';
import DiaryEditor from './DiaryEditor';
import DiaryList from './DiaryList';

import React, { useCallback, useEffect, useMemo, useReducer, useRef } from "react";

const reducer = (state, action) => {
  switch(action.type) {
    case 'INIT': {
      return action.data
    }
    case 'CREATE': {
      const created_date = new Date().getTime();
      const newItem = {
        ...action.data,
        created_date
      }
      return [newItem, ...state];
    }
    case 'REMOVE': {
      return state.filter((it) => it.id !== action.targetId)
    }
    case "EDIT": {
      return state.map((it) => it.id === action.targetId ? {
        ...it,
        content: action.newContent 
      } : it)
    }
    default: 
    return state;
  }
}

//비구조화 할당을 통해서만 임포트 받을수 있음
export const DiaryStateContext = React.createContext() 
export const DiaryDispatchContext = React.createContext()

function App() {

  const [data, dispatch] = useReducer(reducer, [])

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
    dispatch({type: "INIT", data: initData}) 
  }

  useEffect(() => {
    getData();
  },[])

  const onCreate = useCallback((author, content, emotion) => {
    dispatch({type: 'CREATE', data: {author, content, emotion, id: dataId.current}})
 
    dataId.current += 1;
  },[]);

  const onRemove = useCallback((targetId) => {

    dispatch({type: 'REMOVE', targetId})

  }, [])

  const onEdit = useCallback((targetId, newContent) => {

    dispatch({type: 'EDIT', targetId, newContent})

  }, [])


  //useMemo를 사용하여 재생성 되지 않게.
  const memoizedDispatches = useMemo(() => {
    return {
      onCreate, onEdit, onRemove
    }
  },[])


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
    <DiaryStateContext.Provider value={data}>
      <DiaryDispatchContext.Provider value={memoizedDispatches}>
        <div className="App">
          {/* <OptimizeTest /> */}
          <DiaryEditor />
          <div>전체 일기 : {data.length}</div>
          <div>기분 좋은 일기 개수 : {goodCount}</div>
          <div>기분 나쁜 일기 개수 : {badCount}</div>
          <div>기분 좋은 일기 비율 : {goodRatio}%</div>
          <DiaryList />
        </div>
      </DiaryDispatchContext.Provider>
    </DiaryStateContext.Provider>
  );
}

export default App;
