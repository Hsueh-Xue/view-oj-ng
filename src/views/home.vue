<template>
  <el-table
    :data="reactiveData.tableData"
    :default-sort="{ prop: 'rating', order: 'descending' }"
    @expand-change="drawChart"
    stripe
  >
    <el-table-column type="index" label="Rank" align="center" width="100px" />
    <el-table-column prop="name" label="Name" align="center" />
    <el-table-column prop="grade" label="Grade" align="center" />
    <el-table-column prop="rating" label="Rating" sortable align="center" />
    <el-table-column prop="contest_total" label="ContestTotal" sortable align="center" />
    <el-table-column prop="problem_total" label="ProblemTotal" sortable align="center" />
    <el-table-column label="CodeforcesHandle" align="center">
      <template #default="scope">
        <el-link
          :href="'https://codeforces.com/profile/' + scope.row.codeforces_handle"
          :underline="false"
          target="_blank"
        >
          <b :style="getNameColorInfo(scope.row.rating, 0)">
            {{ scope.row.codeforces_handle[0] }}
          </b>
          <b :style="getNameColorInfo(scope.row.rating, 1)">
            {{ scope.row.codeforces_handle.slice(1) }}
          </b>
        </el-link>
      </template>
    </el-table-column>
    <el-table-column type="expand" align="center">
      <template #default="scope">
        <Chart
          :options="getContestGraphOptions(scope.row)"
        />
      </template>
    </el-table-column>
  </el-table>
  <div class="update_time">
    <el-text>UpdateTime: {{ reactiveData.updateTime }}</el-text>
  </div>

</template>

<script setup lang="ts">
import axios from 'axios'
import { type user_data, type user_item } from '@/type/user_info'
import * as echarts from 'echarts'
import { formattedDate } from '@/utils/utils'
import { nextTick, reactive } from 'vue'
import { Chart } from 'highcharts-vue'
import { getContestGraphOptions } from '@/type/rating_graph'


const reactiveData = reactive<any>({
  updateTime: '',
  tableData: []
})

async function fetchData(): Promise<user_data> {
  try {
    const response = await axios.get<user_data>('/data.json')
    return response.data
  } catch (error) {
    console.error('Error fetching data:', error)
    throw error
  }
}


async function processUserData() {
  try {
    const userData = await fetchData()
    reactiveData.updateTime = userData.update_time
    reactiveData.tableData = Object.values(userData.user_info)
  } catch (error) {
    console.error('Error processing user data:', error)
  }
}

processUserData()

function drawChart(row: user_item, expendRows: user_item[]) {
  const isExpend = expendRows.some(r => r.codeforces_handle == row.codeforces_handle)
  if (!isExpend) {
    return
  }
  nextTick(() => {
    const chart = echarts.init(
      document.getElementById('chartContainer-' + row.codeforces_handle)
    )
    const splitLineValues = [1000, 1200, 1400, 1600, 1900, 2100, 2300, 2400, 2600, 3000]
    const backgroundColors = [
      { from: -Infinity, to: 1000, color: '#808080' },
      { from: 1000, to: 1200, color: '#808080' },
      { from: 1200, to: 1400, color: '#008000' },
      { from: 1400, to: 1600, color: '#03A89E' },
      { from: 1600, to: 1900, color: '#0000ff' },
      { from: 1900, to: 2100, color: '#AA00AA' },
      { from: 2100, to: 2300, color: '#FF8C00' },
      { from: 2300, to: 2400, color: '#FF8C00' },
      { from: 2400, to: 2600, color: '#ff0000' },
      { from: 2600, to: 3000, color: '#ff0000' },
      { from: 3000, to: Infinity, color: '#ff0000' }
    ]
    const splitLineOptions = backgroundColors.map(({ from, to, color }) => {
      return {
        show: true,
        interval: 0,
        lineStyle: {
          color: '#ccc',
          type: 'dashed'
        },
        areaStyle: {
          color
        },
        data: [
          {
            value: from,
            label: {
              show: false
            }
          },
          {
            value: to,
            label: {
              show: false
            }
          }
        ]
      }
    })

    const option = {
      xAxis: {
        type: 'category',
        data: row.contest_info.map(item => formattedDate(item.rating_update_time_seconds))
      },
      yAxis: {
        type: 'value'
      },
      series: [{
        data: row.contest_info.map(item => item.new_rating),
        type: 'line'
      }]
    }
    chart.setOption(option)
  })
}

const getNameColorInfo = (rating: number, index: number) => {
  let color = getNameColor(rating)
  return 'color: ' + color[index] + ';'
}
const getNameColor = (rating: number) => {
  if (rating < 1200) return ['#808080', '#808080']
  if (rating < 1400) return ['#008000', '#008000']
  if (rating < 1600) return ['#03A89E', '#03A89E']
  if (rating < 1900) return ['#0000ff', '#0000ff']
  if (rating < 2100) return ['#AA00AA', '#AA00AA']
  if (rating < 2300) return ['#FF8C00', '#FF8C00']
  if (rating < 2400) return ['#ff0000', '#FF8C00']
  if (rating < 2600) return ['#ff0000', '#ff0000']
  if (rating < 3000) return ['#FF00FF', '#ff0000']
  return ['#000000', '#ff0000']
}
</script>
<style scoped>
[id^="chartContainer-"] {
  width: 100%;
  height: 500px;
}

.update_time {
  text-align: center;
}
</style>
