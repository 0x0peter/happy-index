import { Metadata } from "next";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Hero from "./components/hero";
import Team from "./components/team";
import { useState, useEffect } from "react";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useAccount,useSwitchChain, useChainId } from "wagmi";
import CreateTeam from "./components/create-team";
import { useRecoilValue } from "recoil";
import { inviteCodeState, teamInfoState } from "@/store/globalState";
import { useToast } from "@/components/ui/use-toast";
import useAxios from "@/src/lib/useAxios";
import {  createClient, formatEther, http } from "viem";
import { useWriteContract, useReadContract } from "wagmi";
import HappyClaimAbi from '@/public/abi/HappyClaim.json';
import { readContract } from "viem/actions";

export const metadata: Metadata = {
  title: "Dashboard",
  description: "Example dashboard app using the components.",
};

export default function DashboardPage() {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const inviteCode = useRecoilValue(inviteCodeState);
  const teamInfo = useRecoilValue(teamInfoState);
  const [isClaiming, setIsClaiming] = useState(false);
  const { toast } = useToast();
  const { get } = useAxios();
  const [proof, setProof] = useState<string[]>([]);
  const [amount, setAmount] = useState("0");
  const [countdown, setCountdown] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0,
  });
  const { writeContractAsync } = useWriteContract();
  // const { readContract } = useReadContract();
  const { switchChain } = useSwitchChain();
  const [hasClaimed, setHasClaimed] = useState(false);

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
    const eventEndDate = new Date("2025-04-10T23:59:59+08:00"); // 将此处改为您需要的固定日期和时间

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

  //  连接后请求 http://localhost:3000/proof/address
  useEffect(() => {
    if (isConnected) {
      const fetchProof = async () => {
        try {
          const startDate = new Date('2025-03-25 23:59:59');
          const endDate = new Date('2025-04-10 23:59:59');
         
          if(new Date() < startDate || new Date() > endDate){
            return;
          }
          const res = await get(`/api/activity/proof/${address}`);
          setProof(res.data.proof);
          setAmount(res.data.amount);
        } catch (error) {
          console.log(error);
        }
      };
      
      
      fetchProof();
    }
  }, [isConnected, address]);

  // 添加检查是否已领取的函数
  useEffect(() => {
    const checkHasClaimed = async () => {
      const startDate = new Date('2025-03-25 23:59:59');
      const endDate = new Date('2025-04-10 23:59:59');
      if(new Date() < startDate || new Date() > endDate){
        return;
      }
      setIsClaiming(true);
      if (address && isConnected && chainId === 177) {
        try {
          const hashkeyChain = {
            id: 177,
            name: 'Hashkey Chain',
            network: 'hashkey',
            nativeCurrency: {
              name: 'HSK',
              symbol: 'HSK',
              decimals: 18,
            },
            rpcUrls: {
              default: {
                http: ['https://mainnet.hsk.xyz'],
              },
              public: {
                http: ['https://mainnet.hsk.xyz'],
              },
            },
          };
          const client = createClient({
            chain: hashkeyChain,
            transport: http(),
          });
          const result = await readContract(client, {
            address: '0xD2d83Aabfa6ee6DE24847B47A22c0Ad7bB35F6A0' as `0x${string}`,
            abi: HappyClaimAbi.abi,
            functionName: 'hasClaimed',
            args: [address]
          });          
          setHasClaimed(Boolean(result));
        } catch (error) {
          console.error("check has claimed error", error);
        }
      }
    };
    
    checkHasClaimed();
  }, [address, isConnected, chainId]);

  // 发送推特，领取奖金
  const handleClaim = async () => {
    try {
      // 获取当前网络信息
      
      // 检查是否为Hashkey Chain (ID: 133)
      const isHashkeyChain = chainId === 177;
      
      if (!isHashkeyChain) {
        toast({
          title: "Wrong network",
          description: "please switch to Hashkey Chain",
          variant: "destructive",
          duration: 3000,
        });
        
        // 尝试自动切换到Hashkey Chain
        try {
          await switchChain({ chainId: 177 });
          // 不立即返回，等待chainId更新后再判断
        } catch (switchError) {
          console.error("切换网络失败", switchError);
          return;
        }
      }
      
     
      
      // 构建推特分享内容
      const tweetText = encodeURIComponent(`I won the @hyperindex_ Happy Trading Competition:${formatEther(BigInt(amount))} HSK🎉🎉,Let's meet at Hashkey Chain!`);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${tweetText}`;
      
      // 打开推特分享窗口
      window.open(twitterUrl, '_blank', 'width=600,height=400');
      
      // 调用合约领取奖金
      const CONTRACT_ADDRESS='0xD2d83Aabfa6ee6DE24847B47A22c0Ad7bB35F6A0';
      const hash = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: HappyClaimAbi.abi,
        functionName: 'claimReward',
        args: [amount.toString(), proof],  // 更新：传递金额和证明两个参数
      });
     
      toast({
        title: "Transaction submitted",
        description:<a href={`https://explorer.hsk.xyz/tx/${hash}`}>{hash}</a>,
        duration: 3000,
      });
     
    } catch (error) {
      console.log(error);
      toast({
        title: "Claim failed",
        description: "Please try again later",
        variant: "destructive",
        duration: 3000,
      });
    }
  };


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
              {
                isClaiming && isConnected ? (
                  <span className="mt-2 font-bold">Your {hasClaimed ? "has claimed" : "has not claimed"} trading contest prize is {formatEther(BigInt(amount))} HSK🎉 🎉   
                 {hasClaimed ? null:<Button size="sm" onClick={() => handleClaim()}>Claim</Button>}
                  </span>
                ) : (null)
              }
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
