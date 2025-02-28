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
        title: "Wallet not connected",
        description: "Please connect your wallet first",
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
          title: "Operation failed",
          description: `Error: ${response.data.message}`,
          duration: 1500,
          variant: "destructive",
        });
      } else if (response.data.code === 200) {
        console.log(response.data.data);
        setTeamInfo(response.data.data.team);
        setInviteCode(response.data.data.team.inviteCode.inviteCode);
        toast({
          title: "Join success",
          description: "You have successfully joined the team",
          duration: 1500,
        });
      }
    } catch (error) {
      console.error("Join team failed:", error);
      toast({
        title: "Signature failed",
        description: "Cannot complete signature operation, please try again",
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
            Enter invite code to get rewards
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter invite code to get rewards</DialogTitle>
            <DialogDescription>
              Enter invite code to get +10 points 🎁
              <br />
              The top ten will automatically become team members
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Invite code
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
              {submitLoading ? "Submitting..." : "Submit"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnterCode;
