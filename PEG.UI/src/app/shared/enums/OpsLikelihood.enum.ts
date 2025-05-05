export enum OpsLikelihoodEnum {
   VeryHigh=1,
   High=2,
   Medium=3,
   Low=4,
   Staffed=5,
   Unknown=6,
   Confirmed_NearlyLocked=7

}

export const  OpsLikelihoodSortOrderMap:{[key:string]:number} = {
   "Staffed":0,
   "Confirmed_NearlyLocked":1,
   "VeryHigh":2,
   "High":3,
   "Medium":4,
   "Low":5,
   "Unknown":6,
}