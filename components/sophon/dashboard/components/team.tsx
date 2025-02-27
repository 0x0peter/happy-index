import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardDescription,
} from "@/components/ui/card";
import { TabsContent } from "@radix-ui/react-tabs";
import { DollarSign, Users, Activity, Flag } from "lucide-react";
import { useEffect, useState } from "react";
import useAxios from "@/src/lib/useAxios";
import { useToast } from "@/components/ui/use-toast";
import { useRecoilValue, useSetRecoilState } from "recoil";
import {
  createTeamState,
  inviteCodeState,
  teamInfoState,
  teamVolumeHistoryState,
} from "@/store/globalState";
import { TeamMembersList } from "./team-members-list";
import { TeamOverview } from "./team-overview";

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
  const teamInfo = useRecoilValue(teamInfoState);
  const setTeamVolumeHistory = useSetRecoilState(teamVolumeHistoryState);
  const teamVolumeHistory = useRecoilValue(teamVolumeHistoryState);
  useEffect(() => {
    const fetchTeamInfo = async () => {
      if (!account) return;
      const res: any = await get(`/api/activity/team-info/${account}`);
      if (res.response && res.response.data.status === 422) {
        // 地址有问题
        toast({
          title: "errors",
          description: `errors: ${res.response.data.errors.address}`,
          duration: 1500,
          variant: "destructive",
        });
      } else if (res.data.id) {
        setTeamName(res.data.team.name);
        setMembers(res.data.team.members);
        setTeamInviteCode(res.data.team.inviteCode.inviteCode);
        setInviteCode(res.data.team.inviteCode.inviteCode);
        setCreateTeam(true);
        console.log(res.data.team);
        setTeamInfo(res.data.team);

        const teamVolumeHistory = await get(`/api/activity/team-volume-history/${res.data.team.id}`);
        setTeamVolumeHistory(teamVolumeHistory.data);
      } else if (res.data.status === 400) {
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
              <CardTitle className="text-sm font-medium">Team Name</CardTitle>
              <Flag className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{teamInfo.name}</div>
              <p className="text-xs text-muted-foreground">
                {/* +20.1% from last month */}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Team Members</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {teamInfo.members.length}
              </div>
              <p className="text-xs text-muted-foreground">
                {/* +180.1% from last month */}
              </p>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Team Total Volume
              </CardTitle>
              <DollarSign className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">${teamInfo.totalVolume}</div>
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
              <div className="text-2xl font-bold">{teamInfo.teamRank}</div>
              <p className="text-xs text-muted-foreground">
                {/* +201 since last hour */}
              </p>
            </CardContent>
          </Card>
        </div>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
          <Card className="col-span-4">
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
            </CardHeader>
            <CardContent className="pl-2">
              {/* <TeamOverview chartData={teamVolumeHistory} /> */}
            </CardContent>
          </Card>
          <Card className="col-span-3">
            <CardHeader>
              <CardTitle>Members</CardTitle>
              <CardDescription></CardDescription>
            </CardHeader>
            <CardContent>
              <TeamMembersList memberList={members} />
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </>
  );
};
export default Team;
