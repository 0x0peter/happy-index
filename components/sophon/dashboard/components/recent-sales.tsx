import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import makeBlockie from "ethereum-blockies-base64";


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
           <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={makeBlockie(item.walletAddress)} alt="Avatar" />
                      <AvatarFallback>
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 24 24"
                          fill="none"
                          stroke="currentColor"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          className="h-4 w-4 text-muted-foreground"
                        >
                          <rect width="7" height="18" x="3" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="3" rx="1" />
                          <rect width="7" height="7" x="14" y="14" rx="1" />
                        </svg>
                      </AvatarFallback>
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
