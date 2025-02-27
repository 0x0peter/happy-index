import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import useAxios from "@/src/lib/useAxios";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { createTeamState, inviteCodeState, teamInfoState } from "@/store/globalState";
import { useAccount, useSignMessage } from "wagmi";
import { useToast } from "@/components/ui/use-toast";

const CreateTeam = () => {
  const [name, setName] = useState("");
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { post } = useAxios();
  const { toast } = useToast();

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const createTeamed = useRecoilValue(createTeamState);
  const setCreateTeam = useSetRecoilState(createTeamState);
  const setInviteCode = useSetRecoilState(inviteCodeState);
  const inviteCode = useRecoilValue(inviteCodeState);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  
  const createTeam = async () => {
    if (!address) {
      toast({
        title: "钱包未连接",
        description: "请先连接钱包后再创建团队",
        variant: "destructive",
      });
      return;
    }

    try {
      const message = `Create Team Name:${name} Address:${address}`;
      
      const signature = await signMessageAsync({ message });
      
      const dto = {
        address: address,
        name: name,
        signature: signature,
        message: message,
      };
      
      setLoading(true);
      const response = await post("api/activity/create-invite-code", dto);
      
      if (response.data?.code === 400) {
        toast({
          title: "创建失败",
          description: response.data?.message || "创建团队失败",
          variant: "destructive",
        });
      } else {
        console.log(response.data);
        setCreateTeam(true);
        setInviteCode(response.data.inviteCode.inviteCode);
        setTeamInfo(response.data);
      }
    } catch (error) {
      console.error("创建团队失败:", error);
      toast({
        title: "签名失败",
        description: "无法完成签名操作，请重试",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };
  
  const copyInviteCode = () => {
    navigator.clipboard.writeText(`https://happy.hyperindex.trade/invite/${inviteCode}`);
    setCopied(true);
    toast({
      title: "复制成功",
      description: "邀请链接已复制到剪贴板",
      duration: 1500,
    });
  };

  if (createTeamed) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">创建团队</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>创建团队</DialogTitle>
            <DialogDescription>
              创建团队后您将获得16%的团队奖金
            </DialogDescription>
          </DialogHeader>
          <div className="grid">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label>🎉您的邀请链接</Label>
              <Label htmlFor="name" className="text-left">
                https://happy.hyperindex.trade/invite/{inviteCode}
              </Label>
              <Button onClick={copyInviteCode}>{copied ? <Check /> : "复制"}</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    );
  }
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">创建团队</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>创建团队</DialogTitle>
            <DialogDescription>
              创建团队后您将获得16%的团队奖金
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                名称
              </Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>
          <DialogFooter>
            <Button
              disabled={loading}
              type="submit"
              onClick={() => createTeam()}
            >
              {loading ? "创建中..." : "创建"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTeam;
