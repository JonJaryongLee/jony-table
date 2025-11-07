<script setup>
import { ref, computed } from "vue";

const props = defineProps({
  // 테이블의 헤더 정의 (data-key와 header-text를 포함)
  headers: {
    type: Array,
    required: true,
    // 예: [{ key: 'id', title: 'ID' }, { key: 'name', title: '이름' }, { key: 'age', title: '나이' }]
  },
  // 테이블에 표시할 데이터
  initialData: {
    type: Array,
    default: () => [],
  },
});

const sortColumn = ref(null); // 현재 정렬 컬럼의 key
const sortDirection = ref("asc"); // 'asc' 또는 'desc'

const sortedData = computed(() => {
  // 초기 데이터가 없거나 정렬 기준이 없으면 원본 데이터 반환
  if (!props.initialData || props.initialData.length === 0 || !sortColumn.value) {
    return props.initialData;
  }

  const dataCopy = [...props.initialData];
  const column = sortColumn.value;
  const direction = sortDirection.value;

  dataCopy.sort((a, b) => {
    const aValue = a[column];
    const bValue = b[column];

    // 문자열 비교 (대소문자 구분 없이, 한국어 고려)
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

  return dataCopy;
});

/**
 * 헤더 클릭 시 정렬 상태를 업데이트합니다.
 * @param {string} columnKey 정렬할 컬럼의 키
 */
function handleHeaderClick(columnKey) {
  if (sortColumn.value === columnKey) {
    // 같은 컬럼을 다시 클릭 -> 방향 토글
    sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  } else {
    // 다른 컬럼 클릭 -> 새 컬럼 설정 및 오름차순 시작
    sortColumn.value = columnKey;
    sortDirection.value = "asc";
  }
}

/**
 * 현재 정렬 상태에 따른 Material Icon 텍스트를 반환합니다.
 * @param {string} key 현재 헤더의 키
 */
function getSortIcon(key) {
  if (sortColumn.value !== key) {
    return "unfold_more"; // 중립
  }
  return sortDirection.value === "asc" ? "arrow_upward" : "arrow_downward";
}
</script>

<template>
  <div class="sortable-table__container">
    <table class="sortable-table__table">
      <thead>
        <tr>
          <th
            v-for="header in props.headers"
            :key="header.key"
            :data-key="header.key"
            class="sortable-table__header"
            :class="{ sorted: sortColumn === header.key }"
            @click="handleHeaderClick(header.key)"
          >
            <span class="header-text">{{ header.title }}</span>
            <span class="material-symbols-outlined sort-icon">{{ getSortIcon(header.key) }}</span>
          </th>
        </tr>
      </thead>
      <tbody class="sortable-table__body">
        <tr v-for="(member, index) in sortedData" :key="index">
          <td v-for="header in props.headers" :key="header.key">
            {{ member[header.key] }}
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<style scoped>
.sortable-table__container {
  width: 100%;
  height: 100%;
}

/* Table Style */
.sortable-table__table {
  width: 100%;
  height: 100%;
  border-collapse: separate;
  border-spacing: 0;
}

/* Table Header Style */
.sortable-table__header {
  background-color: #e9eff5;
  color: #4a5568;
  padding: 12px 16px;
  text-align: left;
  cursor: pointer;
  font-weight: 600;
  transition: background-color 0.2s ease;
  user-select: none;
  position: relative; /* 아이콘 위치 지정을 위해 */
}

.sortable-table__header:hover {
  background-color: #dce3eb;
}

.sortable-table__header .header-text {
  margin-right: 5px;
}

.sort-icon {
  font-size: 18px;
  vertical-align: middle;
  transition: color 0.2s ease, opacity 0.2s ease;
  color: #718096; /* 비활성화된/중립 아이콘 색상 */
  opacity: 0.7;
}

.sortable-table__header.sorted {
  background-color: #3182ce; /* 파란색 계열 강조 */
  color: #ffffff;
  font-weight: 700;
}

.sortable-table__header.sorted .sort-icon {
  color: #ffffff; /* 활성화된 아이콘 색상 */
  opacity: 1;
}

.sortable-table__body tr {
  transition: background-color 0.15s ease;
}

.sortable-table__body tr:nth-child(even) {
  background-color: #f7fafc;
}

.sortable-table__body tr:hover {
  background-color: #edf2f7;
}

.sortable-table__body td {
  padding: 12px 16px;
  border-bottom: 1px solid #e2e8f0;
  color: #4a5568;
}

/* 둥근 모서리 적용 */
.sortable-table__table thead tr:first-child .sortable-table__header:first-child {
  border-top-left-radius: 8px;
}
.sortable-table__table thead tr:first-child .sortable-table__header:last-child {
  border-top-right-radius: 8px;
}
.sortable-table__body tr:last-child td:first-child {
  border-bottom-left-radius: 8px;
}
.sortable-table__body tr:last-child td:last-child {
  border-bottom-right-radius: 8px;
}
.sortable-table__body tr:last-child td {
  border-bottom: none;
}
</style>
