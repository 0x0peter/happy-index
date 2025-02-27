"use client"

import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis, Legend, Tooltip } from "recharts"
import React from "react"



// 将组件包装在React.memo中，只有当chartData变化时才会重新渲染
export const TeamOverview = React.memo(({chartData}:{chartData:any}) => {
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
        <Bar dataKey="total" fill="#adfa1d" radius={[4, 4, 0, 0]} name="Total Volume" />
      </BarChart>
    </ResponsiveContainer>
  )
})

// 添加displayName属性以解决react/display-name警告
TeamOverview.displayName = 'Overview';
