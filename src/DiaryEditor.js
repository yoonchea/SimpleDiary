import React, { useState,useRef, useContext } from 'react';
import { DiaryDispatchContext } from './App';

const DiaryEditor = () => {

  const {onCreate} = useContext(DiaryDispatchContext)  //비 구조화 할당

  const [state, setState] = useState({
    author: "",
    content: "",
    emotion: 1,
  });

  const authorInput = useRef() //DOM요소를 선택하는 기능
  const contentInput = useRef()



  const handleChangeState = (e) => {
    setState({
      ...state,
      [e.target.name] : e.target.value,
    });
  }

  const handleSubmit = () => {
    if(state.author.length < 1) {
      authorInput.current.focus();      //focus
      return;
    }
    if (state.content.length < 5) {
      contentInput.current.focus()      //focus
      return;
    }
    onCreate(state.author, state.content, state.emotion)
    alert("저장 완료")
    setState({
      author: "",
      content: "",
      emotion: 1,
    })
  }

  return (
    <div className="DiaryEditor">
      <h2>오늘의 일기</h2>
      <div>
        <input ref={authorInput} name="author" value={state.author} onChange={handleChangeState} />
      </div>
      <div>
        <textarea ref={contentInput} name="content" value={state.content} onChange={handleChangeState} />
      </div>
      <div>
        <span>오늘의 감정 점수 : </span>
        <select name='emotion' value={state.emotion} onChange={handleChangeState}>
          <option value={1}>1</option>
          <option value={2}>2</option>
          <option value={3}>3</option>
          <option value={4}>4</option>
          <option value={5}>5</option>
        </select>
        <div>
          <button onClick={handleSubmit}>일기 저장하기</button>
        </div>
      </div>
    </div>
  )
}

export default React.memo(DiaryEditor);  //React.memo 를 사용하여 최적화