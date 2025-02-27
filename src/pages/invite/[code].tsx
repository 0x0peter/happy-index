import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useAxios from "@/src/lib/useAxios";
import { inviteCodeState, teamInfoState } from "@/store/globalState";
import { InjectedConnector } from "@web3-react/injected-connector";
import { LogOut } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {  useSetRecoilState } from "recoil";
import makeBlockie from "ethereum-blockies-base64"
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useDisconnect, useSignMessage } from "wagmi";


export default function InvitePage() {
    const { toast } = useToast();
  const router = useRouter();
  const { code } = router.query;
  const { get, post } = useAxios();
  const { address, isConnected } = useAccount();
  const { signMessageAsync } = useSignMessage();
  const [memberInfo, setMemberInfo] = useState<any>([]);
  const [submitLoading,setSubmitLoading] = useState(false);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  const setInviteCode = useSetRecoilState(inviteCodeState);


  const submitCode = async () => {
    setSubmitLoading(true);
    try {
      const walletAddress = address;
      const message = `Join Team Address:${walletAddress}`;
      
      // 使用wagmi的签名方法
      let signature;
      if (signMessageAsync) {
        signature = await signMessageAsync({ message });
      } else {
        throw new Error("No signing method available");
      }
      const dto = {
        address: walletAddress,
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
        console.log(response.data.data)
        setTeamInfo(response.data.data.team);
        setInviteCode(response.data.data.team.inviteCode.inviteCode);
      }
    } catch (error) {
      console.error("Failed to submit code:", error);
      toast({
        title: "Error",
        description: "Failed to sign message or submit code",
        variant: "destructive",
      });
    } finally {
      setSubmitLoading(false);
      router.push("/");
    }
  };

  useEffect(() => {
    if (!code) {
      return;
    }
    const getTeamInfo = async () => {
      const res = await get(`/api/activity/team-info-by-code/${code}`);
      console.log(res.data.members);
      setMemberInfo(res.data.members);
    };
    getTeamInfo();
  }, [code]);

  return (
    <div>
      <div className="flex items-center justify-between space-x-2">
        <Button variant="default" onClick={() => router.push("/")} size="sm">
          Go to Dashboard
          <LogOut className="ml-2 h-4 w-4" />
        </Button>
        <ConnectButton
          showBalance={false}
          chainStatus="none"
          accountStatus={{
            smallScreen: "avatar",
            largeScreen: "full",
          }}
        />
      </div>
      <div className="flex flex-col items-center justify-center space-x-2 ">
        <div className="mt-20">
          You will get 10 Points +10 🎁
          <br />
          The top ten automatically become team members
        </div>
        <div className="mt-10">
          <div className="grid grid-cols-5 gap-4">
            {Array(10).fill(null).map((_, index) => {
              const member = memberInfo[index];
              return (
                <div key={index} className="flex justify-center">
                  {member ? (
                    <Avatar className="h-12 w-12 flex-shrink-0">
                      <AvatarImage src={makeBlockie(member.walletAddress)} alt="Avatar" />
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
                  ) : (
                    <div className="h-12 w-12 rounded-full border-2 border-dashed border-gray-300 flex items-center justify-center">
                      <span className="text-gray-300">+</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
        <div className="mt-10">
          {isConnected ? (
            <Button 
              type="submit" 
              onClick={submitCode}
              disabled={submitLoading}
            >
              {submitLoading ? "Processing..." : "Join Team"}
            </Button>
          ) : (
            <ConnectButton
              showBalance={false}
              chainStatus="none"
              accountStatus={{
                smallScreen: "avatar",
                largeScreen: "full",
              }}
            />
          )}
        </div>
      </div>
    </div>
  );
}
