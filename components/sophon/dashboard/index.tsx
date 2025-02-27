import { Metadata } from "next";
import { Wallet, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import useAxios from "@/src/lib/useAxios";
import Hero from "./components/hero";
import Team from "./components/team";
import { useWeb3React } from "@web3-react/core";
import { InjectedConnector } from "@web3-react/injected-connector";
import { useState, useEffect } from "react";

import EnterCode from "./components/enter-code";
import CreateTeam from "./components/create-team";
import { useRecoilValue } from "recoil";
import { createTeamState, inviteCodeState, teamInfoState } from "@/store/globalState";
import { useToast } from "@/components/ui/use-toast";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default function DashboardPage() {
  const { get, post } = useAxios();
  const { account, activate, active, deactivate } = useWeb3React();
  const [formattedAddress, setFormattedAddress] = useState<string | null>(null);
  const [name, setName] = useState<string>("");
  const inviteCode = useRecoilValue(inviteCodeState);
  const teamInfo = useRecoilValue(teamInfoState);
  const { toast } = useToast();
  const injected = new InjectedConnector({
    supportedChainIds: [1, 133, 177],
  });
  const [countdown, setCountdown] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

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
  const formatAddress = async (address: any) => {
    if (!address) {
      return "无效地址"; // 返回默认值或错误信息
    }
    return address.slice(0, 6) + "..." + address.slice(-4);
  };

  const copyInviteCode = () => {
    // 我希望这里复制是 根据当前url 后面加上：/invite+inviteCode
    const url = window.location.href;

    const newUrl = url + "invite/" + inviteCode;

    navigator.clipboard.writeText(newUrl);
    toast({
      title: "Copied to clipboard",
      description: "Invite code copied to clipboard",
      duration: 1500,
    });
  };

  

  useEffect(() => {
    const fetchAddress = async () => {
      if (account) {
        const address = await formatAddress(account);
        setFormattedAddress(address);
      }
    };
    fetchAddress();
  }, [account]);

  useEffect(() => {
    // 设置活动开始时间（当前日期加3天）
    const eventStartDate = new Date('2025-02-26T00:00:00Z'); // 将此处改为您需要的固定日期和时间
    eventStartDate.setDate(eventStartDate.getDate() + 3);
    
    const calculateTimeLeft = () => {
      const difference = eventStartDate.getTime() - new Date().getTime();
      
      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60)
        });
      }
    };
    
    // 初始计算
    calculateTimeLeft();
    
    // 每秒更新一次
    const timer = setInterval(calculateTimeLeft, 1000);
    
    // 清理定时器
    return () => clearInterval(timer);
  }, []);

  return (
    <>
      <div className="flex-col ">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="grid grid-cols-3 items-center">
            <div>
              <h2 className="text-3xl font-bold tracking-tight">Dashboard</h2>
            </div>
            
            <div className="flex flex-col items-center justify-center">
              <div className="flex items-center gap-4 tracking-tight">
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold">{countdown.days}</span>
                  <span className="text-xs text-gray-500">DAYS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold">{countdown.hours}</span>
                  <span className="text-xs text-gray-500">HOURS</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold">{countdown.minutes}</span>
                  <span className="text-xs text-gray-500">MINUTES</span>
                </div>
                <div className="flex flex-col items-center">
                  <span className="text-xl font-bold">{countdown.seconds}</span>
                  <span className="text-xs text-gray-500">SECONDS</span>
                </div>
              </div>
              <span className="mt-2 font-bold">Comming SOOON🎉</span>
            </div>
            
            <div className="flex items-center justify-end space-x-2">
              {active ? (
                <>
                {/* {teamInfo.id?<Button variant="ghost">{teamInfo.name}</Button>:<EnterCode />} */}
                
                {teamInfo.id?<Button  onClick={() => copyInviteCode()} size="sm">Team Invite Code: {inviteCode}</Button>:<CreateTeam />}
                </>
              ) : null}

              {active ? (
                <Button variant="outline" onClick={() => diconnectWallet()} size="sm">
                  {formattedAddress}
                  <LogOut className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={() => connectWallet()} size="sm">
                  <Wallet className="mr-2 h-4 w-4" />
                  {active ? formattedAddress : "Connect Wallet"}
                </Button>
              )}
            </div>
          </div>
          
          <Tabs defaultValue="Hero" className="space-y-4">
            <TabsList>
              <TabsTrigger value="Hero">Hero Panel</TabsTrigger>
              <TabsTrigger value="Team">Team Panel</TabsTrigger>
            </TabsList>
            <Hero active={active} account={account} />
            <Team active={active} account={account} />
          </Tabs>
        </div>
      </div>
    </>
  );
}
