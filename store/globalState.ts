import { atom, useSetRecoilState } from 'recoil';

export const userState = atom<{ token: string; user: any } | null>({
  key: 'userState',
  default: {
    token: '', 
    user: {
      createdAt:"",
      deletedAt:null,
      email:"",
      firstName:"",
      id:3,
      lastName:'',
      photo:null,
      provider:"email"
    }
  },
});


export const countState = atom({
  key: 'countState',
  default: 0,
});

export const createTeamState = atom({
  key: 'createTeamState',
  default: false,
});
export const inviteCodeState = atom({
  key: 'inviteCodeState',
  default: '',
});
export const teamInfoState = atom({
  key: 'teamInfoState',
  default: {
    name: '',
    id: null,
    inviteCode: {
      inviteCode: '',
      id: null,
    },
    totalVolume: 0,
    members: [],
    teamRank:0
  },
});

export const heroInfoState = atom({
  key: 'heroInfoState',
  default: {
    userScore:{
      totalPoints:0,
      rank:"Bronze",
      crossChainPoints:0,
      id:0,
      maxPointsCap:0,
      tradePoints:0,
      updatedAt:"",
      usdtBalance:0,
      walletAddress:"",
    },
    totalTradeVolume: 0,
    totalCrossChainVolume: 0,
  },
});


export const loadingVisibleState = atom({
  key: 'loadingVisibleState',
  default: false,
});
export const chartDataState = atom({
  key: 'chartDataState',
  default: [],
});
export const rankListState = atom({
  key: 'rankListState',
  default: [],
});
export const currentRankState = atom({
  key: 'currentRankState',
  default: 0,
});

export function useLoading() {
  const setLoadingVisible = useSetRecoilState(loadingVisibleState);
  return setLoadingVisible;
}
