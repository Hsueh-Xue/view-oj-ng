import type { user_item } from '@/type/user_info'
import { formattedDate } from '@/utils/utils'

interface RatingGraphData {
  x: number;
  y: number;
  rank: number;
  diff_rating: string;
  contest_name: string;
  contest_time: string;
  link?: string;
}

function getDiffRating(oldRating: number, newRating: number) {
  const diff = newRating - oldRating
  if (newRating > oldRating) {
    return `+${diff.toString()}`
  } else {
    return diff.toString()
  }
}

export function getContestGraphOptions(user_info: user_item) {
  const data: RatingGraphData[] = []
  for (const v of user_info.contest_info) {
    const item: RatingGraphData = {} as RatingGraphData
    item.x = v.rating_update_time_seconds * 1000
    item.y = v.new_rating
    item.rank = v.rank
    item.diff_rating = getDiffRating(v.old_rating, v.new_rating)
    item.contest_name = v.contest_name
    item.contest_time = formattedDate(v.rating_update_time_seconds)
    item.link = `https://codeforces.com/contest/${v.contest_id}`
    data.push(item)
  }
  let tickPositions = [
    1200,
    1400,
    1600,
    1900,
    2100,
    2300,
    2400,
    2600,
    3000
  ]

  {
    const user_min_rating = getMinRating(user_info)
    const user_max_rating = getMaxRating(user_info)
    const gap = 100
    const min_rating = Math.max(0, user_min_rating - gap)
    let max_rating = user_max_rating + gap

    for (const v of tickPositions) {
      if (v > max_rating) {
        max_rating = v
        break
      }
    }
    if (min_rating < 1200) {
      tickPositions = [min_rating, ...tickPositions]
    }
    if (max_rating > 3000) {
      tickPositions.push(max_rating)
    }
  }

  const options = {
    chart: {
      type: "line",
      height: "408px",
    },
    title: {
      text: null,
    },
    xAxis: {
      tickWidth: 0,
      gridLineWidth: 0.4,
      minRange: 30 * 24 * 60 * 60 * 1000,
      type: "datetime",
      showFirstLabel: true,
      showLastLabel: true,
      dateTimeLabelFormats: {
        month: "%b %Y",
      },
    },
    yAxis: {
      showEmpty: false,
      showFirstLabel: false,
      showLastLabel: false,
      tickPositions,
      tickWidth: 0,
      gridLineWidth: 0.6,
      labels: {
        enabled: true,
        format: "{value}",
      },
      title: {
        text: null,
      },
      plotBands: [
        {
          from: 0,
          to: 1199,
          color: "#CCCCCC",
        },
        {
          from: 1200,
          to: 1399,
          color: "#98FA87",
        },
        {
          from: 1400,
          to: 1599,
          color: "#90DABD",
        },
        {
          from: 1600,
          to: 1899,
          color: "#A9ACF9",
        },
        {
          from: 1900,
          to: 2099,
          color: "#EF91F9",
        },
        {
          from: 2100,
          to: 2299,
          color: "#F7CD91",
        },
        {
          from: 2300,
          to: 2399,
          color: "#F5BD67",
        },
        {
          from: 2400,
          to: 2599,
          color: "#Ef7F7B",
        },
        {
          from: 2600,
          to: 2999,
          color: "#EB483F",
        },
        {
          from: 3000,
          to: 0x3F3F3F3F,
          color: "#9C1E14",
        },
      ],
    },
    credits: {
      enabled: false,
    },
    plotOptions: {
      line: {
        color: "#ffec3d",
        dataLabels: {
          enabled: false,
        },
        enableMouseTracking: true,
        marker: {
          enabled: true,
          fillColor: "#fffb8f",
        },
      },
    },
    tooltip: {
      enabled: true,
      headerFormat: "",
      useHTML: true,
      shared: true,
      shadow: true,
      followPointer: false,
      followTouchMove: false,
      pointFormat: `= {point.y} ({point.diff_rating}),
              <br/>Rank: {point.rank}
              <br/>ContestTime: {point.contest_time}
              <br/><a href="{point.link}">{point.contest_name}</a>
              <br/>`,
    },
    series: [
      {
        showInLegend: false,
        allowPointSelect: true,
        data,
      },
    ],
  };
  return options
}

function getMinRating(user_info: user_item): number {
  let min_rating = 0
  if (user_info.contest_info.length != 0) {
    min_rating = user_info.contest_info[0].new_rating
  }
  for (const v of user_info.contest_info) {
    if (v.new_rating < min_rating) {
      min_rating = v.new_rating
    }
  }
  return min_rating
}

function getMaxRating(user_info: user_item): number {
  let max_rating = 0
  if (user_info.contest_info.length != 0) {
    max_rating = user_info.contest_info[0].new_rating
  }
  for (const v of user_info.contest_info) {
    if (v.new_rating > max_rating) {
      max_rating = v.new_rating
    }
  }
  return max_rating
}