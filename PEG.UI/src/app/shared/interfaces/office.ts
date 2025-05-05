export interface Office
{
    officeCode:number,
    officeName:string,
    officeAbbr:string,
    officeCluster:string,
    regionId?:number,
    officeClusterCode:number,
    parentOfficeCode?:string
}
