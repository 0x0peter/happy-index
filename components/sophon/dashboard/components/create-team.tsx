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
        title: "Wallet not connected",
        description: "Please connect your wallet first",
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
          title: "Create failed",
          description: response.data?.message || "Create team failed",
          variant: "destructive",
        });
      } else {
        console.log(response.data);
        setCreateTeam(true);
        setInviteCode(response.data.inviteCode.inviteCode);
        setTeamInfo(response.data);
      }
    } catch (error) {
      console.error("Create team failed:", error);
      toast({
        title: "Signature failed",
        description: "Cannot complete signature operation, please try again",
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
      title: "Copy success",
      description: "Invite link copied to clipboard",
      duration: 1500,
    });
  };

  if (createTeamed) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Create Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              After creating the team, you will receive a 16% team bonus
            </DialogDescription>
          </DialogHeader>
          <div className="grid">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label>🎉Your invite link</Label>
              <Label htmlFor="name" className="text-left">
                https://happy.hyperindex.trade/invite/{inviteCode}
              </Label>
              <Button onClick={copyInviteCode}>{copied ? <Check /> : "Copy"}</Button>
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
          <Button size="sm">Create Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create Team</DialogTitle>
            <DialogDescription>
              After creating the team, you will receive a 10% team bonus! 🎁
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Name
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
              {loading ? "Creating..." : "Create"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTeam;
