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
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useSetRecoilState } from "recoil";

const EnterCode = () => {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");
  const { account, library } = useWeb3React();
  const { post } = useAxios();
  const { toast } = useToast();
  const [submitLoading,setSubmitLoading] = useState(false);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  const setInviteCode = useSetRecoilState(inviteCodeState);

  const submitCode = async () => {
    setSubmitLoading(true);
    const message = `Join Team Address:${account}`;
    const signature = await library.provider.request({
      method: "personal_sign",
      params: [message, account],
    });
    const dto = {
      address: account,
      inviteCode: code,
      signature: signature,
      message: message,
    };
    const response = await post("api/activity/join-team", dto);
    
    if(response.data.code === 400){
      toast({
        title: "Operation failed",
        description: `massage: ${response.data.message}`,
        duration: 1500,
        variant: "destructive",
      });
    }else if(response.data.code === 200){
      console.log(  response.data.data)
      setTeamInfo(response.data.data.team);
      setInviteCode(response.data.data.team.inviteCode.inviteCode);
    }
    setSubmitLoading(false);
  };
  return (
    <>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="destructive" size="sm">
            Enter code for reward
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Enter code for reward</DialogTitle>
            <DialogDescription>
              Enter code for Points +10 🎁
              <br />
              The top ten automatically become team members
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="name" className="text-right">
                Code
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
            <Button type="submit" onClick={() => submitCode()} disabled={submitLoading}>
              Submit
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default EnterCode;
