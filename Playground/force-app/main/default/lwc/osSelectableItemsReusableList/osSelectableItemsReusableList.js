/**
  * Reusable Selectable Items with support for WCAG
  * Developer: Kirk Leibert
  * @class {OsSelectableItemsReusableList}
  *
  * @classdesc
  * {OsSelectableItemsReusableList} is a component that is used to display a selectable items list in OmniScript.<br/><br/>
  * 
  * <b>Features</b> <br/>
  * 1.Display List <br/>
  * 2.Select List Item <br/>
  * 
  * @property {String} source - This is the list data to be displayed.
  * @property {String} multiselect - a boolean value controlling whether to allow multi select or use single select.
  *
  * Include the component in your OS simply by adding a custom LWC input element to your step
  *
  *| Attribute Name    | Type Expected                                                                   | Required |
  *|-------------------|---------------------------------------------------------------------------------|----------|
  *| source            | It expects a JSON list but can handle a property set if your DR returns it.     | required |
  *|                   |                                                                                 |          |
  *| multiselect       | It expects either true/false value as a boolean.                                | required |
  *|-----------------------------------------------------------------------------------------------------------------
  *  KEY INFO -
  *   
  *  events fired :
  *                | Event Name                       | Description                                     |
  *                |----------------------------------|-------------------------------------------------|
  *                | handleSelection                  | Row Selection event                                   
  *                | handleFirst                      | Display first available page (pagination)
  *                | handleLast                       | Display last available page (pagination)
  *                | handleNext                       | Display next page (pagination)
  *                | handlePrevious                   | Display previous page (pagination)
  *                
  *  Dependency - this component only works inside OmniScript and depends on the OmniscriptBaseMixin mixin provided by the OmniScript.
  *
  * @version 2.0
  *
  * History
  * =======
  * 2.0 - Sept 6, 2021 - Initial Version 
  * 2.0.1 - Sept 22, 2021 - modify data type support - code saved below
  *                     <td key={field.key} aria-colindex={field.ariaindex} aria-readonly="true">{field.fieldValue}</td>
  *                                         <lightning-input read-only="true" type={field.type} value={field.fieldValue} variant="label-hidden"></lightning-input>
  */

  import { LightningElement,track,api } from 'lwc';
  import { OmniscriptBaseMixin } from 'vlocity_ins/omniscriptBaseMixin';
  export default class OsSelectableItemsReusableList extends OmniscriptBaseMixin(LightningElement) {  
      @track multiselectEnabled;
      @track dataAvailable;
      @track totalPages;
      @track pageNo;
      @track pagelinks = false;
      @track paginationRequired;
      @track displayList = [];
      @track columnList = [];
      @track multiselect_data;
      @api title;
 
      @api multiselect
      get multiselect() {
          return this.multiselect_data; //this.multiselect_data === 'true'
      }
 
      set multiselect(val) { 
          //  Note that we get null if there data is not yet present in the OS
          if (val === null) {
             console.log("Got null multiselect value. Should be true or false.");
              return    
          }  
          this.multiselect_data = val;      
      }
  
      @track 
      source_data = [];
  
      @api
      get source() {
          return this.source_data;
      }
   
      set source(val) {
          //  Note that we get null if there data is not yet present in the OS
          if (val === null) {
             console.log("Got null source data");
              return    
          }
          this.source_data = []; 
          this.source_data = val;    
          this.sourceAvailable = true;  
          this.initMethod();
      } 

      @api
      get columns() {
          return this.columns_data;
      }
  
      set columns(val) {
          //  Note that we get null if there data is not yet present in the OS
          if (val === null) {
             console.log("Got null source data for columns");
              return    
          }
          this.columns_data = []; 
          this.columns_data = val;  
          this.columnsAvailable = true;    
      }
  
      connectedCallback() {
          console.log('connectedCallback');
          this.initMethod();
      }
  
      renderedCallback() {
          console.log('renderedCallback');
      }
      
      initMethod() {
        if ((this.sourceAvailable) && (this.columnsAvailable)) {

          this.multiselectEnabled = this.multiselect == true ? true : false;
          this.pageNo = 1;
          this.recordsPerPage = 10;
          this.totalPages = 1;
          this.recordList = [];
  
          let s = JSON.parse(JSON.stringify(this.source_data))
  
          if (s.constructor == Object) {
              console.log("LWC received single property set object, convert to list");
              this.recordList.push(s)
          }
          else {
              console.log("received list, use as is")
              this.recordList = s;
          }
  
          if (this.recordList.length == 0) {
              console.log("source data is null - look for data in data.json node with same name as Custom LWC element");
              this.dataReceived = false;
              return;
              //this.recordList = JSON.parse(JSON.stringify(this.omniJsonData[this.omniJsonDef.name]));
          }
          else {
              this.dataReceived = true;
          }
          
          this.totalPages = Math.ceil(this.recordList.length / this.recordsPerPage );
          this.paginationRequired = this.totalPages > 1 ? true : false;
          let columnsList = JSON.parse(JSON.stringify(this.columns));
          this.displayList = [];

          //preprocess columns to be displayed
          //add aria index - WCAG

          this.columnList = [];
          this.columns.forEach((col, i) => {
             let newcol = {};
             newcol.ariaindex = i+2;
             newcol.fieldName = col.fieldName;
             newcol.label = col.label;
             newcol.type = col.type;
             this.columnList.push(newcol);
          });

          // preprocess list data to be displayed
          // add aria index - WCAG

          this.recordList.forEach((record, i) => {
             record.tagname = "cb_" + i;
             record.rowid = i;
             record.ariaindex = i + 2;
             record.checked = false;
             record.fields = [];
             columnsList.forEach((item, j) => {
                let c = {};
                c.key = j;
                c.fieldName = item.fieldName;
                c.label = item.label;
                c.type = item.type;
                c.fieldValue = record[item.fieldName];
                c.ariaindex = j+2;
                if (item.type == "text") {
                    c.textType = true;
                }
                else if (item.type == "Date") {
                    c.dateType = true;
                }
                else if (item.type == "number") {
                    c.numberType = true;
                }
                else { 
                    c.textType = true; // easy to add support for more types as necessary
                } 
                record.fields.push(c);
            });
            this.displayList.push(record);
          });
          this.preparePaginationList();
        }
      }
  
      handleNext() {
          this.pageNo += 1;
          this.preparePaginationList();
      }
  
      handlePrevious() {
          this.pageNo -= 1;
          this.preparePaginationList();
      }
  
      handleFirst() {
          this.pageNo = 1;
          this.preparePaginationList();
      }
  
      handleLast() {
          this.pageNo = this.totalPages;
          this.preparePaginationList();
      }
  
      preparePaginationList() {
          this.isLoading = true;
          this.displayList = [];
          let begin = (this.pageNo - 1) * parseInt(this.recordsPerPage);
          let end = parseInt(begin) + parseInt(this.recordsPerPage);
          this.recordsToDisplay = this.recordList.slice(begin, end);
          this.startRecord = begin + parseInt(1);
      
          this.displayList = this.recordsToDisplay;
  
          this.hideNext = this.pageNo != this.totalPages ? false : true;
          this.hideLast = this.pageNo < this.totalPages ? false : true;
          this.hidePrevious = this.pageNo > 1 ? false : true;
          this.hideFirst = this.pageNo > 1 ? false : true;
      }
  
      filterSelectedFromList(list) {
          const filteredList = list.filter(
              checked = true
          );
          return filteredList
      }
  
      selectRow(event) {        
          const selected = event.target.checked;
          const target = event.target.name;
          const iteration=parseInt(target.substring(3,target.length));
  
          if (!this.multiselectEnabled) { 
              this.recordList.forEach((item, i) => {
                  this.recordList[i].checked = false;
              });         
          }
          this.recordList[iteration].checked = selected;
          this.preparePaginationList()
      }
  
      getRows() {
          let data = [];
          let filtered = [];
   
          data = this.recordList;
          filtered = data.filter(function(item){
              return item.checked == true;
          });
          return filtered;
      }
  
      handleSelection(event) {
          this.selectRow(event);
          this.omniUpdateDataJson(this.getRows());
      }
  }
  