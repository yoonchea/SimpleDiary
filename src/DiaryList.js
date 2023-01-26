import DiaryItem from "./DiaryItem";

const DiaryList = ({onRemove, onEdit, diaryList}) => {
  return (
    <div className="DiaryList">
      <h2>일기 리스트</h2>
      <h4>{diaryList.length}개의 일기가 있습니다.</h4>
      <div>
        {diaryList.map((it) => (
          <DiaryItem key={it.id} {...it} onEdit={onEdit} onRemove={onRemove} />
          ))}
      </div>
    </div>
  )
}

DiaryList.defaultProps = {  //기본 값 설정
  diaryList: [],
}

export default DiaryList;