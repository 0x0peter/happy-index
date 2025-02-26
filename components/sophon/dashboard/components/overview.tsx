"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from "recharts"
import React from "react"

const data = {
  "points": [
    {
      "name": "Jan",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Feb",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Mar",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Apr",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "May",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Jun",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Jul",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Aug",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Sep",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Oct",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Nov",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Dec",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
  ],
  "cross": [
    {
      "name": "Jan",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Feb",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Mar",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Apr",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "May",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Jun",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Jul",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Aug",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Sep",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Oct",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Nov",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Dec",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
  ],
  "trade": [
    {
      "name": "Jan",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Feb",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Mar",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Apr",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "May",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Jun",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Jul",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Aug",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Sep",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Oct",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Nov",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
    {
      "name": "Dec",
      "total": Math.floor(Math.random() * 5000) + 1000,
    },
  ]
}

// 合并数据，以便图表能正确显示
const mergedData = data.points.map((item, index) => ({
  name: item.name,
  points: item.total,
  cross: data.cross[index].total,
  trade: data.trade[index].total
}))

// 将组件包装在React.memo中，只有当chartData变化时才会重新渲染
export const Overview = React.memo(({chartData}:{chartData:any}) => {
  return (
    <ResponsiveContainer width="100%" height={350}>
      <BarChart data={chartData}>
        <XAxis
          dataKey="name"
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
        />
        <YAxis
          stroke="#888888"
          fontSize={12}
          tickLine={false}
          axisLine={false}
          tickFormatter={(value) => `$${value}`}
        />
        <Tooltip 
          formatter={(value,name) => [`$${value}`, `${name}`]}
          labelStyle={{ color: '#333' }}
          cursor={{ fill: 'rgba(0, 0, 0, 0.05)' }}
        />
        <Legend 
          verticalAlign="top" 
          align="right" 
          wrapperStyle={{ paddingBottom: '10px' }}
        />
        <Bar dataKey="points" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Points" />
        <Bar dataKey="cross" fill="#36cfc9" radius={[4, 4, 0, 0]} name="Cross chain" />
        <Bar dataKey="trade" fill="#ff7a45" radius={[4, 4, 0, 0]} name="Trade" />
      </BarChart>
    </ResponsiveContainer>
  )
})

// 添加displayName属性以解决react/display-name警告
Overview.displayName = 'Overview';
