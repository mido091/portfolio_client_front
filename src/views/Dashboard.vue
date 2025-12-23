<template>
  <div class="dashboard-home">
    <div class="title-info">
      <p>dashboard summary</p>
      <i class="fas fa-chart-bar"></i>
    </div>
    <div class="data-info">
      <div class="box">
        <i class="fas fa-user"></i>
        <div class="data">
          <p>total users</p>
          <span class="user_count">{{ stats.users }}</span>
        </div>
      </div>
      <div class="box">
        <i class="fas fa-pen"></i>
        <div class="data">
          <p>total posts</p>
          <span class="post_count">{{ stats.posts }}</span>
        </div>
      </div>
      <div class="box">
        <i class="fas fa-table"></i>
        <div class="data">
          <p>products</p>
          <span>130</span>
        </div>
      </div>
      <div class="box">
        <i class="fas fa-dollar"></i>
        <div class="data">
          <p>revenue</p>
          <span>82%</span>
        </div>
      </div>
    </div>

    <div class="title-info">
      <p>recent products</p>
      <i class="fas fa-table"></i>
    </div>

    <div class="table-wrapper">
      <table>
        <thead>
          <tr>
            <th>product</th>
            <th>price</th>
            <th>count</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="i in 5" :key="i">
            <td>tv</td>
            <td><span class="price">$123</span></td>
            <td><span class="count">265</span></td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>

<script setup>
import { reactive, onMounted } from "vue";
import api from "@/services/api";

const stats = reactive({
  users: 0,
  posts: 0,
});

const loadStats = async () => {
  try {
    const [usersData, blogsData] = await Promise.all([
      api("/users"),
      api("/plogs"),
    ]).catch((err) => {
      console.error("Error fetching stats:", err);
      return [{ users: [] }, { plogs: [] }];
    });

    stats.users = usersData.users?.length || 0;
    stats.posts = blogsData.plogs?.length || 0;
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
  }
};

onMounted(() => {
  loadStats();
});
</script>

<style scoped>
.data-info {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 20px;
  margin-bottom: 30px;
}

.data-info .box {
  background-color: rgb(56, 55, 55);
  height: 150px;
  flex: 1 1 200px;
  border-radius: 8px;
  display: flex;
  align-items: center;
  justify-content: space-around;
  color: white;
  transition: transform 0.2s;
}

.data-info .box:hover {
  transform: translateY(-5px);
  background-color: #ffffff22;
}

.data-info .box i {
  font-size: 40px;
  color: #0481ff;
}

.data-info .box .data {
  text-align: center;
}

.data-info .box .data p {
  margin: 0;
  font-size: 14px;
  opacity: 0.8;
}

.data-info .box .data span {
  font-size: 32px;
  font-weight: bold;
}

.price,
.count {
  padding: 6px 12px;
  border-radius: 6px;
  font-weight: bold;
}

.price {
  background-color: #28a745;
}
.count {
  background-color: #ffc107;
  color: black;
}

/* Table wrapper for horizontal scroll on mobile */
.table-wrapper {
  overflow-x: auto;
  -webkit-overflow-scrolling: touch;
  margin: 10px;
  border-radius: 12px;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .data-info .box {
    flex: 1 1 calc(50% - 20px);
    min-width: 150px;
  }
}

@media (max-width: 480px) {
  .data-info {
    gap: 15px;
  }

  .data-info .box {
    flex: 1 1 100%;
    height: 120px;
  }

  .data-info .box i {
    font-size: 32px;
  }

  .data-info .box .data span {
    font-size: 28px;
  }

  .table-wrapper {
    margin: 10px 0;
  }
}
</style>
