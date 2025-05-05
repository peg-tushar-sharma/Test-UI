import { Client } from '../../shared/interfaces/client';
import { RegistrationType } from '../../shared/enums/registration-type.enum';
import { CaseInfo } from '../../shared/interfaces/caseInfo';
import { ExpectedStart } from '../../shared/interfaces/expectedStart';

export class Registrations {

   /**
     * nodeid
     */
   nid: string;

   /**
    * registrationId
    */
   id: number = null;

   /**
    * targetId
    */
   ti: number = null;

   /**
    * targetDisplayName
    */
   tdn: string = "";

   /**
    * publiclyTradedEquityDisplayname
    */
   ptedn: string = null;

   /**
    * location
    */
   l: string = null;

   /**
    * client
    */
   cl: Client;

   /**
   * Client Priority Sort Order
   */
   CPSO: number = 0;

   /**
    * hedgeFundClientDisplayname
    */
   hfcdn: string = null;

   /**
    * workTypeId
    */
   wti: number = null;

   /**
    * workTypeName
    */
   wtn: string = null;

   /**
    * projectName
    */
   pn: string = null;

   /**
    * bainOffice
    */
   boc: number;

   /**
    * bainOfficeCode
    */
   bo: string;

   /**
    * lastSubmittedDate
    */
   lsd?: Date = null;

   /**
    * intrestOrCommitment
    */
   ic: string = null;

   /**
    * stageTypeId
    */
   sgTI: number = null;

   /**
    * stageTypeName
    */
   sgTN: string = null;

   /**
    * statusTypeId
    */
   sti: number = null;

   /**
    * statusTypeName
    */
   stn: any;

   /**
    * commitDate
    */
   cd: any = null;

   /**
    * terminateDate
    */
   td: any = null;

   /**
    * statusDate
    */
   sd: any = null;

   /**
    * completedDate
    */
   ceD: any = null;

   /**
    * hedgeFundClient
    */
   hfc: boolean = null;

   /**
    * publiclyTradedEquity
   */
   pte: boolean = null;

   /**
    * publiclyTradedDebt
    */
   ptd: boolean = null;

   /**
    * Target Owner/Parent Company
    */
   cr: string = null;

   /**
    * isOpenMarketPurchase
    */
   iomp: boolean = null;

   /**
   * isMultibidder
   */
   imb: boolean = null;

   /**
   * Legal Notes
   */
   ln?: string = null;

   /**
   * Is Active (Active or Terminated)
   */
   iac?: boolean;

   /**
   * RegistrationType
   */
   rt?: RegistrationType

   /**
    * SubmittedBy
    */
   sb?: any;

   /**
    * SubmittedByName
    */
   sbn?: string;

   /**
   * WorkToStart
   */
   wts?: number;

   /**
* carve Out
*/
   co?: boolean;

   /**
    * client Heads
    */
   ch: any;

   /**
    * client sector leads
    */
   csl: any;

   /**
    * others Involved
    */
   oi: any;

   /**
   * staffing Restrictions
   */
   sr?: boolean;

   /**
 * General Notes
 */
   gn?: string;

   /**
    * Industry Id
    */
   //indi?: number;

   /**
   * Industry Name
   */
   in?: any;

   /**
   * website
   */
   ws?: string;

   /**
    * staffing Approver
    */
   srAprv: any;

   /**
    * staffing approver employee code
    */
   sraprvcd?: string;

   /**
    * client Heads Display Names
    */
   chdn?: string;

   /**
    * client sector leads Display Names
    */
   csldn?: string;

   /**
    * others Involved Display Names
    */
   oidn?: string;

   /**
    * workToStart Display Names
    */
   wtsdn?: string;

   /**
   * targetLocationId
   */
   tl?: number;

   /**
   * targetLocation Name
   */
   tln?: string;
   /**
    * last Udpate Date
    */
   lud: Date = null;
   /**
    * is Impersonated
    */
   isImpersonated: boolean = null;

   /**
    * hasDeal
    */
   hasDeal: boolean = null;

   /**
   *Submitter Office Name
   */
   SON: string

   /** 
  * Registration Location Deal Id
  */
   LODI: Number

   /** 
   * Registration Location Deal Name
   */
   LODN: string

   /** 
  * is Mobile Submission
  */
   ism: boolean
   /** 
   * Email Count
   */
   ec: Number

   /** 
   * Is Email
   */
   ie: Number

   /** 
   * Is Email resend (for loader in side-bar)
   */
   ier: boolean = false;

   /**
    * Client Head with Employee code
    */
   chwec: string

   /**
    * Client sector lead with employee code
    */
   cslwec: string

   /**
    * Others Involved with employee code
    */
   oiwec: string

   /**
    * Stafing Approver with Office abbreviation
    */
   sraprvwAbbr: string

   /** 
   * Location Of Deal Region
   */
   LODR?: number

   /** 
   * DealId
   */
   dealId?: number

   /** 
   * DealId
   */
   conflictApprovalTracker: any


   /** 
   * Status cleared By
   */
   scb: string

   /** 
   * Special purpose acquisition company
   */
   spac: boolean = null;

   /** 
   * Case Info
   */
   case: CaseInfo | any;

   /**
    * isSinglebidder
   */
   isb: boolean = null;

   /**
    * isSeller
   */
   isSeller: boolean = null;
   /**
       * IsMasked
      */
   isMasked: boolean = null;

   /**
      * publiclyTradedEquity
     */
   hf: boolean = null;

   /**
    * Registration id
    */
   rid: string;

   /**
   * Is publiclyTradedDebt for Grid
  */
   isptd: boolean = null;

   /**
   * hasRegistrationIcon
   */
   hasRegistration: boolean = null;

   /* expected startDate */
   expectedStart: any = null;

   /*Is Risk engagment needed*/
   isREN: boolean = null;
   isProductREN: boolean = null;


   /*Industry Sector*/
   sectors: any[] = [];


}

export class AuditLogModel {
   isSelectedValue: boolean
   isSelectedOldValue: boolean
   fieldName: string
}
