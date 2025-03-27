"use client"

import { useEffect, useState } from "react"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { formatEther } from "viem"

interface TradingData {
  WalletAddress: string
  Points: string
  Rank: string
  Reward: string
  TradeCount: string
  TradeVolume: string
  CCCount: string
}

export function TradingTable() {
  const [data, setData] = useState<TradingData[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      try {
        const response = await fetch('/data/happy-data.csv')
        const text = await response.text()
        
        // 预处理文本，统一换行符
        const normalizedText = text.replace(/\r\n/g, '\n').replace(/\r/g, '\n')
        
        // 简单CSV解析
        const rows = normalizedText.split('\n')
        const headers = rows[0].split(',')
        
        const parsedData = rows.slice(1).map(row => {
          if (!row.trim()) return null
          
          const values = row.split(',')
          const entry = {} as TradingData
          
          headers.forEach((header, index) => {
            // 清理每个值中可能的空白字符和回车符
            const value = values[index] ? values[index].trim() : '';
            entry[header as keyof TradingData] = value;
          })
          
          return entry
        }).filter(Boolean) as TradingData[]
        
        setData(parsedData)
      } catch (error) {
        console.error('加载CSV数据失败', error)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // 简化地址显示
  const formatAddress = (address: string) => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <div className="rounded-md border">
      <Table>
        <TableCaption>Trading Competition</TableCaption>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[100px]">RANK</TableHead>
            <TableHead>Wallet</TableHead>
            <TableHead className="text-right">Trade Count</TableHead>
            <TableHead className="text-right">Trade Volume</TableHead>
            <TableHead className="text-right">Cross-Chain Count</TableHead>
            <TableHead className="text-right">Total Points</TableHead>
            <TableHead className="text-right">Reward HSK</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {isLoading ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">Loading...</TableCell>
            </TableRow>
          ) : data.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="text-center">No data</TableCell>
            </TableRow>
          ) : (
            data.map((row, index) => (
              <TableRow key={index}>
                <TableCell className="font-medium">{row.Rank}</TableCell>
                <TableCell>{formatAddress(row.WalletAddress)}</TableCell>
                <TableCell className="text-right">{row.TradeCount}</TableCell>
                <TableCell className="text-right">{row.TradeVolume}</TableCell>
                <TableCell className="text-right">{row.CCCount}</TableCell>
                <TableCell className="text-right">{row.Points}</TableCell>
                <TableCell className="text-right">{row.Reward}</TableCell>
              </TableRow>
            ))
          )}
        </TableBody>
      </Table>
    </div>
  )
} 