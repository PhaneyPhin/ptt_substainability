import { Component, OnInit, Input, OnChanges, SimpleChange, Output, EventEmitter, ChangeDetectorRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonService } from 'src/app/service/common.service';
import { Subject } from 'rxjs';

declare var $: any;    /// declare jQuery
declare var moment: any;  //// declare momentjs

@Component({
  selector: 'filter-box',
  templateUrl: './filter-box.component.html',
  styleUrls: ['./filter-box.component.css']
})
export class FilterBoxComponent implements OnInit {

  private _data = [];
  private data = [];
  
  public static yourString: Subject<String> = new Subject<string>();


  private selected = {
    categoryIDs: [],
    fromDate: null,
    toDate: null
  };

  private loading = false;
  private category = [];

  private dateFormat = "YYYY-MM-DDTHH:mm:ss.000";

  @Input()
  private searching = false;   /// or searching = false;  

  @Input()
  private emptyCategory = false;  /// or  emptyCategory = false;

  @Output("searchCallback")
  searchCallBack: EventEmitter<any> = new EventEmitter();
  isLoading=false;
  constructor(
    private router: Router
    , private route: ActivatedRoute
    , private commonService: CommonService,
    private cdr: ChangeDetectorRef) { 
      FilterBoxComponent.yourString.subscribe(res => {
        // reset the component
        if (res && res == 'refresh') {
          this.isLoading=true;
          if(!this.cdr['destroyed']){
            this.cdr.detectChanges();
          }
          this.isLoading=false;
          if(!this.cdr['destroyed']){
            this.cdr.detectChanges();
          }
          this.doRefresh('12232');
        }
    });
    }

  ngOnInit() {
    this.doRefresh('111');

  }

  refreshSearch() {
    //$('.selectpicker').selectpicker('refresh');
  }

  search() {
    if (this.searchCallBack) {
      //console.log('selecled '+JSON.stringify(this.selected));
      this.searchCallBack.emit(this.selected);
      $('.tg').click();   // layout filter toggle;
    }
  }

  formatDate(date) {
    return date.utc().format(this.dateFormat) + "Z";
  }

  doRefresh(res){

    setInterval(()=>{
      var $menu = $('#navbarNavDropdown');
      var $menu1 = $('.datepicker');
      
    $(document).mouseup(function (e) {
      if (!$menu.is(e.target) && $menu.has(e.target).length === 0 && $menu1.has(e.target).length===0) 
      {
        $menu.removeClass('show');
      }
      else{
        $menu.addClass('show');
      }
    });
  },1000)

    this.loading = true;
    let categoryID = parseInt(this.route.snapshot.params['id']);
    this.commonService.getCategory().subscribe(d => {
      if (!this.emptyCategory) {
        if (categoryID) {
          this.category = d.filter(c => c.id === categoryID);
          setTimeout(()=>{  
              $('.selectpicker').val(categoryID);
              let subLen;
              try{
                subLen = this.category[0].downloadSubCategorys.length;
              }
              catch(ex){
                 subLen = this.category[0].downloadSubCategorys || 0;
              }
              if(subLen == 0 ){
                $('.selectpicker').removeAttr('disabled');
                $('.selectpicker').attr('disabled', 'disabled');
              }    
          },500)
          
          this.selected.categoryIDs.push(categoryID);
        } else {
          if (window.location.href.indexOf("/highlight") >= 0) {
            //this.category = d.filter(c => c.name === 'Activities and Gallery' || c.name === 'Announcement' || c.name === 'Award and Achievement');
            this.category = d.filter(c => c.displayLayout === 'LAYOUT_ACTIVITY' || c.displayLayout === 'LAYOUT_AWARD' || c.displayLayout === 'LAYOUT_ANNOUNCEMENT');
            this.selected.categoryIDs.push(categoryID);
            
          }
          else if (window.location.href.indexOf("/applications") >= 0) {
            this.category = d.filter(c => c.categoryType === 'Applications');
            this.selected.categoryIDs.push(categoryID);
          }
        }
        setTimeout((item)=>{
          $('.selectpicker').SumoSelect(
            { 
            okCancelInMulti: true ,
            triggerChangeCombined: true,
            forceCustomRendering: true	,
            selectAll: true
           });
           $('.select-all').click(()=>{
              var len=$($('.selall').find('ul')).find('li').length;
              var calssSet=$('.selall').find('.select-all').attr('class');
              var list= $($($('.selall').find('ul')).find('li'));
              var i=0;
              select(0,list);
              function select(i,list){
                if(calssSet!='select-all'){
                  if(i<list.length){
                    if($(list[i]).hasClass('selected')){
                      select(i+1,list);
                    }else{
                      list[i].click(select(i+1,list));
                    }
                  }
                }else{
                  if(i<list.length){
                    if(!$(list[i]).hasClass('selected')){
                      select(i+1,list);
                    }else{
                      list[i].click(select(i+1,list));
                    }
                  }
                }             
              }
           })
        },500)
      } else {
        this.category = [];
      } 
      $('.Filters').datepicker({
        format:'dd-mm-yyyy',
        autoclose: true,
        //endDate: new Date()
      }).datepicker( 'setDate', new Date()).on('changeDate',  (ev) => {  
        this.selected.fromDate=moment(ev.date).format();
      }).datepicker( 'setEndDate', new Date()).on('changeDate',  (ev) => {  
        this.selected.fromDate=moment(ev.date).format();
      }).change(()=>{
        this.selected.fromDate=moment($('.Filters').val().split('-').reverse().join('-')).format();
        $( ".Filters1" ).datepicker("setStartDate", new Date(this.selected.fromDate));
      });
     
      $('.Filters1').datepicker({
        format:'dd-mm-yyyy',
        autoclose: true,
        startDate: new Date()
      }).datepicker( 'setDate', new Date()).on('changeDate',  (ev) => {
        this.selected.toDate=moment(ev.date).format();
      }).change(()=>{
        this.selected.toDate=moment($('.Filters1').val().split('-').reverse().join('-')).format();
        //console.log(this.selected.toDate,moment($('.Filters1').val().split('-').reverse().join('-')));
      
        $( ".Filters" ).datepicker("setEndDate",new Date(this.selected.toDate));
     
      });
      this.selected.fromDate = this.selected.fromDate || moment().format()
      this.selected.toDate = this.selected.toDate  || moment().format()  
      $('.selectpicker').on('change', (e) => {
        this.selected.categoryIDs = [];
        var select=$('.selectpicker').children(':selected');
        for(var i=0;i<select.length;i++){
          this.selected.categoryIDs.push(select[i].value);
        }
      });
      this.loading = false;
    });
  }

}
