let members = [
  { id: 123, name: "이낙생", age: 20 },
  { id: 456, name: "김문기", age: 40 },
  { id: 789, name: "나오성", age: 30 },
];

// 현재 정렬 상태를 저장하는 객체
let sortState = {
  column: null, // 'id', 'name', 'age' 중 하나
  direction: "asc", // 'asc' (오름차순) 또는 'desc' (내림차순)
};

const tableBody = document.getElementById("table-body");
const tableHeaders = document.querySelectorAll("#sortable-table th[data-key]");

/**
 * 정렬된 데이터를 기반으로 테이블 본문을 다시 그립니다.
 */
function renderTable() {
  // 1. 테이블 본문 초기화
  tableBody.innerHTML = "";

  // 2. 데이터 행 생성 및 삽입
  members.forEach((member) => {
    const row = tableBody.insertRow();
    row.innerHTML = `
            <td>${member.id}</td>
            <td>${member.name}</td>
            <td>${member.age}</td>
        `;
  });

  // 3. 헤더 UI 업데이트 (아이콘 및 강조)
  tableHeaders.forEach((header) => {
    const key = header.getAttribute("data-key");
    const icon = header.querySelector(`.sort-icon[data-icon-for="${key}"]`);

    // 모든 헤더에서 강조 클래스 제거 및 중립 아이콘 설정
    header.classList.remove("sorted");
    icon.textContent = "unfold_more"; // 중립 아이콘

    if (sortState.column === key) {
      // 현재 정렬 컬럼 강조
      header.classList.add("sorted");

      // 정렬 방향에 따른 아이콘 변경
      if (sortState.direction === "asc") {
        icon.textContent = "arrow_upward"; // 오름차순 아이콘
      } else {
        icon.textContent = "arrow_downward"; // 내림차순 아이콘
      }
    }
  });
}

/**
 * 주어진 키를 기준으로 테이블 데이터를 정렬합니다.
 * @param {string} columnKey 정렬할 컬럼의 키 ('id', 'name', 'age')
 */
function sortTable(columnKey) {
  if (sortState.column === columnKey) {
    // 같은 컬럼을 다시 클릭 -> 방향 토글
    sortState.direction = sortState.direction === "asc" ? "desc" : "asc";
  } else {
    // 다른 컬럼 클릭 -> 새 컬럼 설정 및 오름차순 시작
    sortState.column = columnKey;
    sortState.direction = "asc";
  }

  const { column, direction } = sortState;

  members.sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    // 문자열 비교 (대소문자 구분 없이)
    if (typeof aValue === "string" && typeof bValue === "string") {
      const comparison = aValue.localeCompare(bValue, "ko", {
        sensitivity: "base",
      });
      return direction === "asc" ? comparison : -comparison;
    }

    // 숫자 비교
    if (aValue < bValue) {
      return direction === "asc" ? -1 : 1;
    }
    if (aValue > bValue) {
      return direction === "asc" ? 1 : -1;
    }
    return 0;
  });

  renderTable();
}

// 이벤트 리스너 및 초기화
tableHeaders.forEach((header) => {
  header.addEventListener("click", () => {
    const key = header.getAttribute("data-key");
    sortTable(key);
  });
});

// 초기 테이블 렌더링
renderTable();
