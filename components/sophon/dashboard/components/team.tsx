import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { DollarSign, Users, FileDigit, Activity } from "lucide-react";
import { Overview } from "./overview";
import { RecentSales } from "./recent-sales";
import { useEffect, useState } from "react";
import useAxios from "@/src/lib/useAxios";
import { useToast } from "@/components/ui/use-toast";
import { useSetRecoilState } from "recoil";
import { createTeamState, inviteCodeState, teamInfoState } from "@/store/globalState";

const Team = ({
  active,
  account,
}: {
  active: boolean;
  account: string | null | undefined;
}) => {
  const { get, post } = useAxios();
  const [teamName, setTeamName] = useState<string>("");
  const [members, setMembers] = useState<any[]>([]);
  const [teamInviteCode, setTeamInviteCode] = useState<string>("");
  const { toast } = useToast();
  const setCreateTeam = useSetRecoilState(createTeamState);
  const setInviteCode = useSetRecoilState(inviteCodeState);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!account) return;
      const res:any = await get(`/api/activity/team-info/${account}`);
      if (res.response&&res.response.data.status === 422) {
        // 地址有问题
        toast({
          title: "errors",
          description: `errors: ${res.response.data.errors.address}`,
          duration: 1500,
          variant: "destructive",
        });
      } else if(res.data.id){
        setTeamName(res.data.team.name);
        setMembers(res.data.team.members);
        setTeamInviteCode(res.data.team.inviteCode.inviteCode);
        setInviteCode(res.data.team.inviteCode.inviteCode);
        setCreateTeam(true);
        console.log(res.data.team);
        setTeamInfo(res.data.team);
      } else if(res.data.status === 400){
        // 这里没有团队
      }

      // setTeamName(teamInfo.data.name);
    };

    fetchTeamInfo();
  }, [active, account]);

  return (
    <>
      <TabsContent value="Team" className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Leader</CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">$45,231.89</div>
              <p className="text-xs text-muted-foreground">
                +20.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Subscriptions
              </CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+2350</div>
              <p className="text-xs text-muted-foreground">
                +180.1% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Sales</CardTitle>
              <FileDigit className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+12,234</div>
              <p className="text-xs text-muted-foreground">
                +19% from last month
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Rank Now</CardTitle>
              <Activity className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">+573</div>
              <p className="text-xs text-muted-foreground">
                +201 since last hour
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>{`Team Name`}</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              <Overview chartData={[]} />
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Recent Sales</CardTitle>
              <CardDescription>You made 265 sales this month.</CardDescription>
            </CardHeader>
            <CardContent>
              <RecentSales rankList={[]} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
};
export default Team;
