import { RegistrationType } from '../../shared/enums/registration-type.enum';

export interface Investment {
  /**
     * nodeid
     */
    nid: string;

  /**
   * investmentId
   */
  id: number;
  /**
   * investment targetDisplayName
   */
  tdn: string;
   /**
    * LastSubmittedDate
    */
  lsd: Date;
   /**
    * upload date: To be used as status date in grid
    */
  ud: Date;
    /**
    * registration type
    */
  rt: RegistrationType;

}

