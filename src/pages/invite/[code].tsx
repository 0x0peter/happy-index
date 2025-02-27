import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import useAxios from "@/src/lib/useAxios";
import { inviteCodeState, teamInfoState } from "@/store/globalState";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { LogOut, Wallet } from "lucide-react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { useRecoilValue, useSetRecoilState } from "recoil";
import makeBlockie from "ethereum-blockies-base64"


export default function InvitePage() {
    const { toast } = useToast();
  const router = useRouter();
  const { code } = router.query;
  const { get, post } = useAxios();
  const { account, activate, active, library,deactivate } = useWeb3React();
  const [memberInfo, setMemberInfo] = useState<any>([]);
  const [submitLoading,setSubmitLoading] = useState(false);
  const setTeamInfo = useSetRecoilState(teamInfoState);
  const setInviteCode = useSetRecoilState(inviteCodeState);

  const injected = new InjectedConnector({
    supportedChainIds: [1,56, 133, 177,80094,8453,42161,43114,146,137,10,5000,59144,81457,167000,130],
  });
  const setProvider = (type: string) => {
    window.localStorage.setItem("provider", type);
  };
  const getOKXProvider = () => {
    if ((window as any).okxwallet) {
      return (window as any).okxwallet;
    }
    if ((window as any).ethereum && (window as any).ethereum.providers) {
      return (window as any).ethereum.providers.find((provider: any) => provider.isOkxWallet);
    }
    return (window as any).ethereum;
  };
  const connectWallet = async () => {
    try {
      const okxProvider = getOKXProvider();
      if (okxProvider) {
        // 强制设置 window.ethereum 为 OKX Wallet
        (window as any).ethereum = okxProvider;
        
        // 连接 OKX Wallet
        await activate(injected, undefined, true);
        console.log("Connected to OKX Wallet!");
      } else {
        // 使用默认的以太坊提供者
        await activate(injected, undefined, true);
        console.log("Connected with default provider!");
      }
    } catch (error) {
      console.error("连接钱包失败:", error);
    }
};
  const diconnectWallet = async () => {
    try {
      await deactivate();
      window.localStorage.removeItem("provider");
    } catch (error) {
      console.error("断开钱包失败:", error);
    }
  };
  const formatAddress = (address: any) => {
    if (!address) {
      return "无效地址"; // 返回默认值或错误信息
    }
    return address.slice(0, 6) + "..." + address.slice(-4);
  };
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
    router.push("/");
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
        {active ? (
          <Button variant="outline" onClick={() => diconnectWallet()} size="sm">
            {formatAddress(account)}
            <LogOut className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button onClick={() => connectWallet()} variant="outline" size="sm">
            <Wallet className="mr-2 h-4 w-4" />
            connect wallet
          </Button>
        )}
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
          {active ? (
            <Button type="submit" onClick={() => submitCode()}>Join Team</Button>
          ) : (
            <Button type="submit" onClick={() => connectWallet()}>Connect Wallet</Button>
          )}
        </div>
      </div>
    </div>
  );
}
