import { RegistrationType } from '../../shared/enums/registration-type.enum';

export class Prohibition {

    /**
     * nodeid
     */
    nid: string;
    
    /**
     * targetId
     */
    ti: number;

    /**
     * targetDisplayName
     */
    tdn: string;

    /**
     * ProhibitionId
     */
    id: number;

    /**
    * Legal Notes
    */
    ln?: string;

    /**
     * LastSubmittedDate
     */
    lsd?: Date;

    /**
    * Is Active (Active or Terminated)
    */
    iac?: boolean;

    /**
     * SubmittedBy
     */
    sb?: string;

    /**
     * Submitted By Name
     */
    sbn?: string;

    /**
     * UpdatedBy
     */
    ub?: string;

    /**
    * UpdatedBy Name
    */
    ubn?: string;

    /**
     * RegistrationType
     */
    rt: RegistrationType;


    /**
     *
     */
    constructor() {
        this.ti = null;
        this.tdn = '';
        this.id = 0;
        this.ln = '';
        this.lsd = null;
        this.iac = true;
        this.sb = '';
        this.rt = RegistrationType.Prohibitions;
    }
}
