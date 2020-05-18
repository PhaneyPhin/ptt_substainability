import { Component, OnInit , ViewChild } from "@angular/core";
import { Http, Headers } from "@angular/http";
import { GlobalVar } from "../../global-var";
import swal from "sweetalert2";
import * as moment from "moment";
import { TranslateService } from "ng2-translate";

//openlayer import
import { map } from "rxjs/operator/map";
import OlMap from "ol/map";
import OlTileWMS from "ol/source/TileWMS";
import VectorLayer from "ol/layer/vector";
import OlView from "ol/view";
import OlProj from "ol/proj";
import OlMapEvent from "ol/";
import Feature from "ol/Feature";
import Point from "ol/geom/point";
import Icon from "ol/style/icon";
import Style from "ol/style/style";
import VectorSource from "ol/source/vector";
import OlTileLayer from "ol/layer/tile";
import LineString from "ol/geom/LineString";
import Overlay from "ol/Overlay";
import { style } from "openlayers";
declare var $: any;
@Component({
  selector: "app-realtime",
  templateUrl: "./realtime.component.html",
  styleUrls: ["./realtime.component.css"]
})
export class RealtimeComponent implements OnInit {
  @ViewChild("popup") container;
  @ViewChild("popup-content") content;
  @ViewChild("popup-closer") closer;
  map: OlMap;
  source: OlTileWMS;
  layer;
  view: OlView;
  styles: Style;
  markerSource: VectorSource;
  province_arr = [];
  amphur_arr = [];
  key_item;
  all_data = []
  select_prov = []
  select_tambon = []
  select_amphur = []
  public data: any = [];
  public rowsOnPage: number = 10;
  public filterQuery: string = "";
  public sortBy: string = "";
  public sortOrder: string = "desc";
  public pageIndex: number = 1;
  dropdownSettings = {};
  dropdownSettings2 = {};
  dropdownSettings3 = {};
  show_data = {};
  tambon_arr = [];
  show_tambon_arr = []
  translate;
  loading = false
  constructor(
    private _g: GlobalVar,
    private _http: Http,
    translate: TranslateService
  ) {
    this.get_realtime();
    this.get_province();
    translate.addLangs(["en", "th"]);
    translate.setDefaultLang("en");
    this.translate = translate;
  }

  ngOnInit() {
    this.source = new OlTileWMS({
      url:
        "https://www.deemap.com/DeeMap/gwc/service/wms?customer_key=PJbjq6ybS9UwbCZo&app_id=U3dyTW9uaXRvcl9Fdm9sdXRpb24=",
      params: {
        LAYERS: "DeeMap2_THA_Map",
        FORMAT: "image/png8",
        VERSION: "1.1.1",
        SRS: "EPSG:4326",
        TILES: true
      }
    });
    this.layer = new OlTileLayer({
      source: this.source
    });

    this.markerSource = new VectorSource({
      features: []
    });

    var vectorLayer = new VectorLayer({
      source: this.markerSource
    });

    this.layer = new OlTileLayer({
      source: this.source
    });
    var latlon = ol.proj.transform(
      [100.6037284, 13.6768896],
      "EPSG:4326",
      "EPSG:900913"
    );
    this.view = new OlView({
      center: latlon, // lon lat
      zoom: 10,
      projection: "EPSG:900913",
      minZoom: 5,
      maxZoom: 20
    });

    this.map = new OlMap({
      target: "map",
      layers: [this.layer, vectorLayer],
      view: this.view
    });

    const popup = new Overlay({
      position: ol.proj.transform(
        [100.6037284, 13.6768896],
        "EPSG:4326",
        "EPSG:900913"
      ),
      element: document.getElementById("popup"),
      stopEvent: true,
      autoPan: true
    });
    this.map.addOverlay(popup);

    var element = popup.getElement();
  
    
    this.map.on("pointermove", (evt: any) => {
      console.log( $(element));
      $(element).popover("dispose");
     
      this.map.forEachFeatureAtPixel(evt.pixel, (x: Feature) => {
        var marker_data = x.getProperties();
        // var coordinate = ol.proj.transform(evt['coordinate'], 'EPSG:900913', 'EPSG:4326')
        var geo = x.getGeometry();

        popup.setPosition(geo["flatCoordinates"]);
        $(element).popover({
          container: "#map",
          placement: "top",
          animation: true,
          html: true,
          content: "<p>Blackbox ID : " +
                marker_data.blackboxid +
                "</p>" +
                "<p>Time inserver : " +
                marker_data.time_inserver +
                "</p>" 

        });

        $(element).popover("show");
      });
    });

    this.map.render();
    this.dropdownSettings = {
      singleSelection: true,
      text: this.translate.instant("select_province"),
      enableSearchFilter: true
    };
    this.dropdownSettings2 = {
      singleSelection: true,
      text: "select_amphur",
      enableSearchFilter: true
    };
    this.dropdownSettings3 = {
      singleSelection: true,
      text: "select_tambon",
      enableSearchFilter: true
    };
  }

  get_realtime() {
    this._http
      .get(this._g.hosts + "v2_get_realtime")
      .map(data => data.json())
      .subscribe(data => {
        if (data.code) {
          swal({
            title: "Error",
            type: "error",
            text: data.message
          });
        } else {
          this.all_data = data.data;
        }
      });
  }

  get_province() {
    this._http
      .get(this._g.hosts + "get_provincev2")
      .map(data => data.json())
      .subscribe(data => {
        this.province_arr = data.map((x, i) => {
          return {
            id: parseInt(i) + 1,
            itemName: x.th_prov + "|" + x.en_prov,
            th_prov: x.th_prov,
            en_prov: x.en_prov
          };
        });
      });
  }

  onchangeprovince(province) {
    this._http
      .get(this._g.hosts + "get_locationv2?province=" + province.th_prov)
      .map(data => data.json())
      .subscribe(data => {
        this.select_amphur = []
        this.select_tambon = []
        let temp = data.map((x, i) => {
          return {
            id: parseInt(i) + 1,
            itemName: x.th_amphur + "|" + x.en_amphur,
            th_amphur: x.th_amphur,
            en_amphur: x.en_amphur
          };
        });
        this.amphur_arr =  temp.filter((thing, index, self) =>
        index === self.findIndex((t) => (
          t.th_amphur === thing.th_amphur && t.name === thing.name
        ))
      )
        this.tambon_arr = data.map((x, i) => {
          return {
            id: parseInt(i) + 1,
            itemName: x.th_tambon + "|" + x.en_tambon,
            th_amphur: x.th_amphur,
            en_amphur: x.en_amphur,
            th_tambon: x.th_tambon,
            en_tambon: x.en_tambon
          };
        });
      });
  }

  onchangeamphur(value){
    this.select_tambon = []
    let temp = JSON.parse(JSON.stringify(this.tambon_arr))
    this.show_tambon_arr = temp.filter(x => x.en_amphur == value.en_amphur || x.th_amphur == value.th_amphur)
  }

  showmarker_onmap(prov,amp,tam) {
    this.loading = true
    let temp  =  JSON.parse(JSON.stringify(this.all_data))
    this.data = temp.filter(x => {
      if(tam){
        debugger
        return x.tmen == tam[0].en_tambon || x.tmth == tam[0].th_tambon
      }else if(amp){
        debugger
        return x.amen == amp[0].en_amphur || x.amth == amp[0].th_amphur
      }else{
        debugger
        return x.pven == prov[0].en_prov || x.pvth == prov[0].th_prov
      }
    })
    this.rowsOnPage =
            this.data.length < this.rowsOnPage ? this.data.length : 10;
    if(this.data.length == 0){
      swal({
        title:"No data",
        type:'warning'
      })
    }else {
      let features_array = [];
      for (let i in this.data) {
        var iconStyle = new Style({
          image: new Icon({
            anchor: [0.5, 0.5],
            scale: 0.25,
            src: "/assets/img/marker.png",
            crossOrigin: "Anonymous"
          })
        });
        var iconFeature = new Feature({
          type: "icon",
          geometry: new Point(
            ol.proj.transform(
              [this.data[i].ln, this.data[i].lt],
              "EPSG:4326",
              "EPSG:900913"
            )
          ),
          blackboxid:this.data[i].bl,
          time_inserver:this.data[i].lst
        });
        iconFeature.setStyle(iconStyle);
        features_array.push(iconFeature);
      }
      let centerlocation = ol.proj.transform(
        [this.data[0].ln, this.data[0].lt],
        "EPSG:4326",
        "EPSG:900913"
      );
      this.map.getView().setCenter(centerlocation);
      this.map.getView().setZoom(13);
      var feature = this.markerSource.getFeatures();
      for (let i in feature) {
        this.markerSource.removeFeature(feature[i]);
      }
      this.markerSource.addFeatures(features_array);
    }
    this.loading = false
  }

  show_detail(item) {
    let show_detail = {
      serial_sim: item.sr,
      buffer: item.bf,
      r_time: item.rt,
      r_status: item.rst,
      r_value: item.rva,
      r_spacial_value: item.rspe,
      lattitude: item.lt,
      lontitude: item.ln,
      header: item.hedp,
      heading: item.hed,
      gps_speed: item.rsp,
      gsm_csq: item.cq,
      gps_hdop: item.hod,
      gps_sattellite: item.snu,
      gps_active: item.ga,
      gps_distance: item.dis,
      gps_battery_backup_voltage: item.bab,
      car_voltage: item.cab,
      ch_io_bit: item.io,
      adc_01: item.ac1,
      adc_02: item.ac2,
      temp_01: item.te1,
      temp_02: item.te2,
      gx: item.gx,
      gy: item.gy,
      gz: item.gz,
      configuration_id: item.cfix,
      geofence_file_ver: item.gev,
      log_byte: item.lgb,
      hardware_version: item.hwv,
      firmware_version: item.fwv,
      rpm: item.rm,
      driver_license_perfix: item.drfix,
      driver_license_name: item.drna,
      driver_license_surname: item.drsn,
      driver_license_id: item.drd,
      driver_license_personal_card: item.drpsn,
      driver_license_expire_card: item.drex,
      driver_license_birthday_card: item.drbr,
      driver_license_type: item.drty,
      driver_license_gendor: item.drgn,
      driver_license_no: item.drno,
      driver_license_branch: item.drbrh,
      altitude: item.alt,
      hard_acc_count: item.hac,
      hard_brk_count: item.hak,
      over_speed_count: item.ovc,
      minimum_speed: item.misp,
      maximum_speed: item.mxsp,
      package_num: item.pknu,
      engine_coolant_temperature: item.clte,
      accelerator_pedal_position: item.acpp,
      beaking_pedal_position: item.bkpp,
      ecu_distance: item.edis,
      ecu_speed: item.esp,
      ecu_rpm: item.erm,
      pulse: item.pul,
      total_fuel_consumption: item.tfc,
      camera_sound_version: item.cmsv,
      camera_sdcard1_information: item.cmsd1,
      camera_sdcard2_information: item.cmsd2,
      camera_buzzer_information: item.cmbz,
      camera_harddisk_information: item.cmhd,
      camera_information: item.cmi,
      r_time_decode: item.rtdc,
      th_tambon:item.tmth,
      en_tambon:item.tmen,
      th_amphur:item.amth,
      en_amphur:item.amen,
      th_province:item.pvth,
      en_province:item.pven,
    };
    this.key_item = Object.keys(show_detail);
    this.show_data = show_detail;
  }
}
