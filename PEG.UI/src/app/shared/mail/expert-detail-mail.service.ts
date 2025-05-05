import { Injectable } from '@angular/core';
import { CommonMethods } from '../common/common-methods';

@Injectable({
  providedIn: 'root'
})
export class ExpertDetailMailService {

  constructor() { }

  sendExpertDetailsMail(expertGroupList)
  {
    var body ="";
    
      expertGroupList.forEach(item => {
       let expertGroupName=  item?.expertGroupName;
       let expertGroupCategoryName = item?.expertGroupCategory?.categoryName
       if (expertGroupCategoryName && expertGroupCategoryName  != ""  ) { expertGroupName += " - " +expertGroupCategoryName ; }
       var table ="<div> <table  style= \"border: 1px solid black;  border-collapse: collapse;\">"
       + "<tr><th style= \"border: 1px solid black; padding:5px\">"+"Expert Name"+"</th>"
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Office"+"</th>"
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Title"+"</th>" 
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Cat of Expertise"+"</th>" 
       + "<th style= \"border: 1px solid black; padding:5px\">"+"Notes"+"</th></tr>" 

       item?.experts?.forEach (expertItem=>{
        let expertName= expertItem?.expertName !=null ? expertItem?.expertName:"";
        let office=expertItem?.bainOffice!=null ? expertItem?.bainOffice:"";
        let abbreviation = expertItem?.abbreviation !=null? expertItem?.abbreviation:"";        
        let categoryName=expertItem?.categoryName !=null ? expertItem?.categoryName:"";
        let note=expertItem?.note !=null ? expertItem?.note:"";
        table+="<tr>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+expertName+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+office+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+abbreviation+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+categoryName+"</td>";
        table+="<td style= \"border: 1px solid black; padding:5px\">"+note+"</td></tr>";
       });
       table +="</table></div>";

       body += "<div><b>" + expertGroupName+ "</b></div>";
       body  += "<br>";
       body+=table;
       body  += "<br>";
      })
      
      const handleCopy = CommonMethods.copyToClipboard("<div>" + body + "</div>")
       
      var subject = "Experts Overview";
      let mailText = "mailto:?subject=" + subject + "&body=" + "Note: Press Ctrl+V to paste the copied data"; // add the links to body
      window.open(mailText, "_blank");
      
  }
}
