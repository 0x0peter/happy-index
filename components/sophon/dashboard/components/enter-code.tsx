import { Button } from "@/components/ui/button";
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
import { useToast } from "@/components/ui/use-toast";
import useAxios from "@/src/lib/useAxios";
import { inviteCodeState, teamInfoState } from "@/store/globalState";
import { useState } from "react";
import { useSetRecoilState } from "recoil";
import { useAccount, useSignMessage } from "wagmi";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const { post } = useAxios();
  const { toast } = useToast();
  const [submitLoading, setSubmitLoading] = useState(false);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  const setInviteCode = useSetRecoilState(inviteCodeState);

  const { address } = useAccount();
  const { signMessageAsync } = useSignMessage();

  const submitCode = async () => {
    if (!address) {
      toast({
        title: "钱包未连接",
        description: "请先连接钱包后再输入邀请码",
        variant: "destructive",
      });
      return;
    }

    try {
      setSubmitLoading(true);
      const message = `Join Team Address:${address}`;

      const signature = await signMessageAsync({ message });
      
      const dto = {
        address: address,
        inviteCode: code,
        signature: signature,
        message: message,
      };
      
      const response = await post("api/activity/join-team", dto);
      
      if (response.data.code === 400) {
        toast({
          title: "操作失败",
          description: `错误: ${response.data.message}`,
          duration: 1500,
          variant: "destructive",
        });
      } else if (response.data.code === 200) {
        console.log(response.data.data);
        setTeamInfo(response.data.data.team);
        setInviteCode(response.data.data.team.inviteCode.inviteCode);
        toast({
          title: "加入成功",
          description: "您已成功加入团队",
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("加入团队失败:", error);
      toast({
        title: "签名失败",
        description: "无法完成签名操作，请重试",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
    }
  };
  
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            输入邀请码获取奖励
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>输入邀请码获取奖励</DialogTitle>
            <DialogDescription>
              输入邀请码可获得+10积分 🎁
              <br />
              前十名将自动成为团队成员
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                邀请码
              </Label>
              <Input
                id="inviteCode"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                className="col-span-3"
              />
            </div>
          </div>  
          <DialogFooter>
            <Button 
              type="submit" 
              onClick={submitCode} 
              disabled={submitLoading}
            >
              {submitLoading ? "提交中..." : "提交"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnterCode;
