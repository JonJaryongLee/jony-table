<script setup>
import CommonTable from "@/components/CommonTable.vue";

const tableHeadersProps = [
  { key: "id", title: "ID" },
  { key: "name", title: "이름" },
  { key: "age", title: "나이" },
];

const tableDataProps = [
  { id: 123, name: "이낙생", age: 20 },
  { id: 456, name: "김문기", age: 40 },
  { id: 789, name: "나오성", age: 30 },
];


</script>

<template>
  <div class="app-container">
    <h1 class="title">멤버 목록</h1>
    <div class="app-table-wrapper">
      <CommonTable :headers="tableHeadersProps" :initial-data="tableDataProps" />
    </div>
  </div>
</template>

<style scoped>
body {
  font-family: "Noto Sans KR", sans-serif;
  background-color: #f4f7f9;
  color: #333;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  min-height: 100vh;
  padding: 40px 20px;
  margin: 0;
}

.app-container {
  background-color: #ffffff;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
  width: 100%;
  max-width: 768px;
}

.title {
  font-weight: 700;
  color: #1a202c;
  margin-bottom: 25px;
  font-size: 1.8rem;
  text-align: center;
}
</style>
