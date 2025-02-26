import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"


/**
 *
 * @param param0 
 * @returns 
 */
export function RecentSales({rankList}:{rankList:any}) {
  const formatAddress = (address:string) => {
    return address.slice(0, 6) + "..." + address.slice(-8);
  }
  // 保留有效小数点后两位 
  const formatPoints = (points:string) => {
    return parseFloat(points).toFixed(2);
  }
  return (
    <div className="space-y-8">
      {rankList.map((item:any,index:any)=>(
          <div key={index} className="flex items-center">
          <Avatar className="h-9 w-9">
            <AvatarImage src="/avatars/01.png" alt="Avatar" />
            <AvatarFallback>{item.rank}</AvatarFallback>
          </Avatar>
          <div className="ml-4 space-y-1">
            <p className="text-sm font-medium leading-none">    {formatAddress(item.walletAddress) }</p>
            <p className="text-sm text-muted-foreground">
            points
            </p>
          </div>
          <div className="ml-auto font-medium">
            {formatPoints(item.totalPoints)}
          </div>
        </div>
      ))}
    </div>
  )
}
