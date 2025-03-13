import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Hero from "./components/hero";
import Team from "./components/team";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount, useConfig, useDisconnect } from "wagmi";
import CreateTeam from "./components/create-team";
import { useRecoilValue } from "recoil";
import { inviteCodeState, teamInfoState } from "@/store/globalState";
import { useToast } from "@/components/ui/use-toast";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const inviteCode = useRecoilValue(inviteCodeState);
  const teamInfo = useRecoilValue(teamInfoState);
  const { toast } = useToast();

  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });

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
    // 设置活动结束时间为3月15号23:59:59（设置时区香港时间）
    const eventEndDate = new Date("2025-03-15T23:59:59+08:00"); // 将此处改为您需要的固定日期和时间

    const calculateTimeLeft = () => {
      const difference = eventEndDate.getTime() - new Date().getTime();

      if (difference > 0) {
        setCountdown({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
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
          <div className="flex flex-col gap-4 md:grid md:grid-cols-3 md:items-center">
            <div className="text-center md:text-left">
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
              {/* <span className="mt-2 font-bold">Comming SOOON🎉</span> */}
            </div>

            <div className="flex flex-col md:flex-row items-center justify-center md:justify-end space-y-2 md:space-y-0 md:space-x-2">
              {isConnected ? (
                <>
                  {teamInfo.id ? (
                    <Button
                      onClick={() => copyInviteCode()}
                      size="sm"
                      className="w-full md:w-auto"
                    >
                      🎉Copy the invite link 🎉
                    </Button>
                  ) : (
                    <CreateTeam />
                  )}
                </>
              ) : null}
              <ConnectButton
                showBalance={false}
                chainStatus="none"
              />
            </div>
          </div>

          <Tabs defaultValue="Hero" className="space-y-4">
            <TabsList>
              <TabsTrigger value="Hero">Hero Panel</TabsTrigger>
              <TabsTrigger value="Team">Team Panel</TabsTrigger>
            </TabsList>
            <Hero active={isConnected} account={address} />
            <Team active={isConnected} account={address} />
          </Tabs>
        </div>
      </div>
    </>
  );
}
