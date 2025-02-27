import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import {
  DollarSign,
  CircleDollarSign,
  FileDigit,
  Activity,
  Bold,
  Italic,
  Underline,
} from "lucide-react";
import { Overview } from "./overview";
import { RecentSales } from "./recent-sales";
import { useEffect, useState } from "react";
import useAxios from "@/src/lib/useAxios";
import { chartDataState, currentRankState, heroInfoState, rankListState } from "@/store/globalState";
import { useRecoilValue, useSetRecoilState } from "recoil";

const Hero = ({
  active,
  account,
}: {
  active: boolean;
  account: string | null | undefined;
}) => {
  const { get } = useAxios();
  const setHeroInfo = useSetRecoilState(heroInfoState);
  const heroInfo = useRecoilValue(heroInfoState);
  const [type, setType] = useState("all");
  const setChartData = useSetRecoilState(chartDataState);
  const chartData = useRecoilValue(chartDataState);
  const setRankList = useSetRecoilState(rankListState);
  const rankList = useRecoilValue(rankListState);
  const setCurrentRank = useSetRecoilState(currentRankState);
  const currentRank = useRecoilValue(currentRankState);
  useEffect(() => {
    // /api/activity/user-score/{address}
    if (!account) {
      return;
    }
    const fetchUserInfo = async () => {
      const res = await get(`api/activity/user-score/${account}`);
      if(res.data.code===400){
        console.log("user score not found");
      }else{
        setHeroInfo(res.data);

      }
    };
    const getChartData = async () => {
      
      const res:any = await get(`/api/activity/user-score-history/${account}/${type}`);

      const mergedData = res.data.points.map((item:any, index:any) => ({
        name: item.name,
        points: item.total,
        cross: res.data.cross[index].total,
        trade: res.data.trade[index].total
      }))
      setChartData(mergedData);
    }
    const getRank = async () => {
      const res:any = await get(`/api/activity/user-rank/${account}`);
      if(res.data.status===400){
        console.log("user rank not found");
      }else{
        setCurrentRank(res.data.data.currentRank);
        setRankList(res.data.data.rankList);
      }
   
    }
    fetchUserInfo();
    getChartData();
    getRank();
  }, [active, account]);

  // const handleSetType = (value:string) => {
  //   if(value===""){
  //     setType("all");
  //   }else{
  //     setType(value);
  //   }
  // }

  return (
    <>
      <TabsContent value="Hero" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Cross Chain Volume
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${heroInfo ? heroInfo.totalCrossChainVolume : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                Go to <a href="https://owlto.finance/" target="_blank" rel="noreferrer noopener" className="text-green-500 font-medium hover:underline mr-1">Owlto</a> Or
                <a href="https://www.orbiter.finance/en?src_chain=177&tgt_chain=10&src_token=ETH" target="_blank" rel="noreferrer noopener" className="ml-1 mr-1 text-green-500 font-medium hover:underline">Orbiter</a>
                Bridge
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total HSK Trade Volume
              </CardTitle>
              <CircleDollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                ${heroInfo ? heroInfo.totalTradeVolume : 0}
              </div>
              <p className="text-xs text-muted-foreground">
              Go to <a href="https://www.hyperindex.trade" target="_blank" rel="noreferrer noopener" className="text-green-500 font-medium hover:underline mr-1">HyperIndex</a>Trade
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Total Points
              </CardTitle>
              <FileDigit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {heroInfo ? heroInfo.userScore.totalPoints : 0}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* +19% from last month */}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {heroInfo ? heroInfo.userScore.rank : "Bronze"}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* +201 since last hour */}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
{/* 
              <ToggleGroup type="single" onValueChange={(value) => handleSetType(value)}>
                <ToggleGroupItem value="cross" aria-label="Toggle bold">
                  Cross chain
                </ToggleGroupItem>
                <ToggleGroupItem value="trade" aria-label="Toggle italic">
                  Trade
                </ToggleGroupItem>
                <ToggleGroupItem
                  value="points"
                  aria-label="Toggle strikethrough"
                >
                  Points 
                </ToggleGroupItem>
              </ToggleGroup> */}
            </CardHeader>
            <CardContent className="pl-2">
              {/* <Overview chartData={chartData} /> */}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Rank</CardTitle>
              <CardDescription>Real time ranking  </CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales rankList={rankList} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
};
export default Hero;
