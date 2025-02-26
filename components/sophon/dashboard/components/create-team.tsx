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
import { useWeb3React } from "@web3-react/core";
import { useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { createTeamState, inviteCodeState, teamInfoState } from "@/store/globalState";

const CreateTeam = () => {
  const [name, setName] = useState("");
  const { account, library } = useWeb3React();
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const { post } = useAxios();

  const createTeamed = useRecoilValue(createTeamState);
  const setCreateTeam = useSetRecoilState(createTeamState);
  const setInviteCode = useSetRecoilState(inviteCodeState);
  const inviteCode = useRecoilValue(inviteCodeState);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  const createTeam = async () => {
    if (!account) {
      return;
    }

    const message = `Create Team Name:${name} Address:${account}`;
    const signature = await library.provider.request({
      method: "personal_sign",
      params: [message, account],
    });
    const dto = {
      address: account,
      name: name,
      signature: signature,
      message: message,
    };
    setLoading(true);
    const response = await post("api/activity/create-invite-code", dto);
    console.log(response.data);
    setLoading(false);
    setCreateTeam(true);
    setInviteCode(response.data.inviteCode.inviteCode);
    setTeamInfo(response.data);
  };
  const copyInviteCode = () => {
    navigator.clipboard.writeText(`https://happy.hyperindex.trade/invite/${inviteCode}`);
    setCopied(true);
  };

  if (createTeamed) {
    return (
      <Dialog>
        <DialogTrigger asChild>
          <Button size="sm">Create a Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Team</DialogTitle>
            <DialogDescription>
              Create a team and you will receive 16% team bonus
            </DialogDescription>
          </DialogHeader>
          <div className="grid">
            <div className="grid grid-cols-1 items-center gap-4">
              <Label>🎉your invite link</Label>
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
          <Button size="sm">Create a Team</Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Create a Team</DialogTitle>
            <DialogDescription>
              Create a team and you will receive 16% team bonus
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
              Create
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default CreateTeam;
