export class OppFormSection {
    slug: string;
    title: string;
    show: boolean;
    enabled:boolean = true;

    constructor(private slugName:string, private titleName:string, private visible:boolean = true){
        this.slug = slugName;
        this.title = titleName;
        this.show = visible;
    }

    public toggle(value){
        this.show = value;
    }

    // While disabled, a section will not appear on the page but its form control values will remain unchanged
    public disable(){
        this.enabled = false;
    }

    public enable(){
        this.enabled = true;
    }


}