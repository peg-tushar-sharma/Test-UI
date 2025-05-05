export class DealAuth {
    ContextTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean,isTabReadOnly:boolean };
    ExpertsTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean ,isTabReadOnly:boolean };
    ClientsTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean ,isTabReadOnly:boolean };
    AllocationTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean ,isTabReadOnly:boolean };
    SecurityTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean,isTabReadOnly:boolean  };
    HeaderTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean ,isTabReadOnly:boolean };
    AuditTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean ,isTabReadOnly:boolean };
    StrategyTab : { isVisible:boolean, isEditable:boolean, isNone:boolean, isTabVisible:boolean ,isTabReadOnly:boolean };

    constructor(){
        this.ContextTab = { isVisible:false, isEditable:false, isNone:false, isTabVisible:false,isTabReadOnly:false  };
        this.ExpertsTab = { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
        this.ClientsTab = { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
        this.AllocationTab = { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
        this.SecurityTab  = { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
        this.HeaderTab  = { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
        this.AuditTab =  { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
        this.StrategyTab =  { isVisible:false, isEditable:false, isNone:false, isTabVisible:false ,isTabReadOnly:false};
    }
}