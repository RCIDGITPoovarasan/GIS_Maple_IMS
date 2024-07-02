var configdata = configdataroot;
var MainCSV;
var MeadianLHSCSV;
var MeadianRHSCSV;
var map;
var MainCSVArr = [];
var MeadianRHSArr = [];
var MeadianLHSArr = [];
var MeadianAssetsArr = [];
var LHSAssetsArr = [];
var RHSAssetsArr = [];
var BHSAssetsArr = [];
var currentZoomLevel;
var RemoveAssetMarker = [];
var DashedLineRemove = [];
var RemoveStreetLight = [];
var RemoveHighMast =[];
var RemoveSolarBlinker = [];
var RemoveKmStone = [];
var RemoveSignBoard = [];
//******************* LHS - OffsetLine 1 **********************/
var OffsetLHSLine1CSV;
var OffsetLHSLine1Arr = [];
//********************LHS - OffsetLine 2************************ */
var OffsetLHSLine2CSV;
var OffsetLHSLine2Arr = [];
//********************LHS - OffsetLine 11************************ */
var OffsetLHSLine11CSV;
var OffsetLHSLine11Arr = [];
//********************LHS - OffsetLine 12************************ */
var OffsetLHSLine12CSV;
var OffsetLHSLine12Arr = [];
//******************* RHS - OffsetLine 1 **********************/
var OffsetRHSLine1CSV;
var OffsetRHSLine1Arr = [];
//********************RHS - OffsetLine 2************************ */
var OffsetRHSLine2CSV;
var OffsetRHSLine2Arr = [];
//********************RHS - OffsetLine 11************************ */
var OffsetRHSLine11CSV;
var OffsetRHSLine11Arr = [];
//********************RHS - OffsetLine 12************************ */
var OffsetRHSLine12CSV;
var OffsetRHSLine12Arr = [];
//********************RHS - OffsetLine 3************************ */
var OffsetRHSLine3CSV;
var OffsetRHSLine3Arr = [];
//********************LHS - OffsetLine 2************************ */
var OffsetLHSLine3CSV;
var OffsetLHSLine3Arr = [];

//********************Bridge Masters ************************ */
var recordArrBridgeMaster;

//********************Service Masters ************************ */
var recordArrServiceRoadMaster;

//********************Bridge Masters ************************ */
var BridgeFileCSV;
var BridgeFileArr = [];

//********************Project Assets ************************ */
var recordArrProjectAssets = [];
//********************Service Road ************************ */
var ServiceRoadFileCSV;
var ServiceRoadFileArr = [];
//********************  Fetching Defetc  ************************ */
var recordArrIncidents = [];
var TotalIncidentCount;
var recordArrIncidentsImage;


var FinalIncident = [];
var Incidentmarker = [];

//********************** Work zone ************************* */
var recordArrWorkzoneCSV;
var WorkzoneArr = [];
var WorkzoneMarker = [];


//Assets image
var recordArrAssetsImage;

//OnclickChainage
var currentOverlay = null;
var nearestPoint;

//Encroachment
var recordArrEncroachment =[];
var FinalEncroachment =[];
var  Encroachmentmarker = [] ;


 initializeMap();



 function showLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'block';
}

// Hide loading spinner
function hideLoadingSpinner() {
  document.getElementById('loadingSpinner').style.display = 'none';
}
showLoadingSpinner();
// Simulate loading data (e.g., with setTimeout)
setTimeout(function() {
  hideLoadingSpinner();
}, 35000);
 fetchDataAndProcess();
 function initializeMap()
  {
    const myLatLng = { lat: 20.71135, lng: 86.13553 };
     map = new google.maps.Map(document.getElementById("map"), {
      zoom: 10,
      maxZoom: 18,
      center: myLatLng,
      styles: [
        {
            featureType: 'poi',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }],
        },
        {
            featureType: 'administrative',
            elementType: 'labels',
            stylers: [{ visibility: 'on' }],
        },
        {
            featureType: 'road',
            elementType: 'labels',
            stylers: [{ visibility: 'off' }],
        },
        {
          featureType: 'all',
          elementType: 'labels.text',
          stylers: [{ visibility: 'off' }],
      },
      {
          featureType: 'all',
          elementType: 'labels.icon',
          stylers: [{ visibility: 'off' }],
      }
    ],
    });
    // new google.maps.Marker({
    //     position: 
    //     {lat: 20.53782804, lng: 85.96088145},
    //     map,
    //     title: "GIS",
    //   });
      
  }


  function fetchDataAndProcess()
  {
    ZOHO.CREATOR.init().then(function () {
      //***********Get Latest Record ID*******************/
      var configLatestRecord = { 
        
        reportName : "All_Gis_chainage_Files", 
        appName : "highway-maintenance-system",
      //  criteria : "(Status == \"Open\" && Priority = \"High\")",
        page : 1,
        pageSize : 1
    }
    ZOHO.CREATOR.API.getAllRecords(configLatestRecord).then(function(responseconfigLatestRecord){
      var LatestRecordID = responseconfigLatestRecord.data[0]['ID'];
             //***********Get Latest Record ID for workzone*******************/
             var configLatestRecordWorkzone = { 
               appName : "highway-maintenance-system",
               reportName : "All_Workzone_Masters", 
             //  criteria : "(Status == \"Open\" && Priority = \"High\")",
               page : 1,
               pageSize : 1
           }
           ZOHO.CREATOR.API.getAllRecords(configLatestRecordWorkzone).then(function(responseconfigLatestRecordWorkzone){
             var LatestRecordIDWorkzone = responseconfigLatestRecordWorkzone.data[0]['ID'];

//console.log(recordArrconfigLatestRecord[0]['ID']);
    var MainFile = {
        appName:"highway-maintenance-system",
        reportName: "All_Gis_chainage_Files",
        id: LatestRecordID,
        fieldName : "Main_Median_CSV"
    }
     ZOHO.CREATOR.API.readFile (MainFile).then(function (responseMain) {
        MainCSV = responseMain;  
                              //Fetching assets image from master
                              var Assetsimage = {
                                appName:"highway-maintenance-system",
                                reportName: "Assets_category_and_sub_category_master_Report",
                                page: 1,
                                pageSize: 200
                              }
                              ZOHO.CREATOR.API.getAllRecords(Assetsimage).then(function (responseAssetsimage) {
                                recordArrAssetsImage =responseAssetsimage.data;  
      
        //*************************LHS - Meadian********************/
        var MeadianLHS = {
          appName:"highway-maintenance-system",
          reportName: "All_Gis_chainage_Files",
          id: LatestRecordID,
          fieldName : "MedianLHS"
      }
      ZOHO.CREATOR.API.readFile (MeadianLHS).then(function (responseMeadianLHS) {
          MeadianLHSCSV = responseMeadianLHS; 
          //************************RHS - Meadian*********************** */ 
          var MeadianRHS = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "MedianRHS"
        }
        ZOHO.CREATOR.API.readFile (MeadianRHS).then(function (responseMeadianRHS) {
            MeadianRHSCSV = responseMeadianRHS; 
             //************************OffsetLHSLine1*********************** */ 
          var OffsetLHSLine1 = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "OffsetLHSLine1"
        }
        ZOHO.CREATOR.API.readFile (OffsetLHSLine1).then(function (responseOffsetLHSLine1) {
          OffsetLHSLine1CSV = responseOffsetLHSLine1; 
       
             //************************OffsetLHSLine1*********************** */ 
          var OffsetLHSLine2 = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "OffsetLHSLine2"
        }
        ZOHO.CREATOR.API.readFile (OffsetLHSLine2).then(function (responseOffsetLHSLine2) {
          OffsetLHSLine2CSV = responseOffsetLHSLine2; 
                //************************OffsetLHSLine11*********************** */ 
          var OffsetLHSLine11 = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "OffsetLHSLine11"
        }
        ZOHO.CREATOR.API.readFile (OffsetLHSLine11).then(function (responseOffsetLHSLine11) {
          OffsetLHSLine11CSV = responseOffsetLHSLine11; 
                  //************************OffsetLHSLine12*********************** */ 
          var OffsetLHSLine12 = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "OffsetLHSLine12"
        }
        ZOHO.CREATOR.API.readFile (OffsetLHSLine12).then(function (responseOffsetLHSLine12) {
          OffsetLHSLine12CSV = responseOffsetLHSLine12; 
                    //************************OffsetRHSLine1*********************** */ 
          var OffsetRHSLine1 = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "OffsetRHSLine1"
        }
        ZOHO.CREATOR.API.readFile (OffsetRHSLine1).then(function (responseOffsetRHSLine1) {
          OffsetRHSLine1CSV = responseOffsetRHSLine1; 
                     //************************OffsetRHSLine2*********************** */ 
          var OffsetRHSLine2 = {
            appName:"highway-maintenance-system",
            reportName: "All_Gis_chainage_Files",
            id: LatestRecordID,
            fieldName : "OffsetRHSLine2"
        }
        ZOHO.CREATOR.API.readFile (OffsetRHSLine2).then(function (responseOffsetRHSLine2) {
          OffsetRHSLine2CSV = responseOffsetRHSLine2; 
            //************************OffsetRHSLine11*********************** */ 
            var OffsetRHSLine11 = {
              appName:"highway-maintenance-system",
              reportName: "All_Gis_chainage_Files",
              id: LatestRecordID,
              fieldName : "OffsetRHSLine11"
          }
          ZOHO.CREATOR.API.readFile (OffsetRHSLine11).then(function (responseOffsetRHSLine11) {
            OffsetRHSLine11CSV = responseOffsetRHSLine11; 
              //************************OffsetRHSLine11*********************** */ 
              var OffsetRHSLine12 = {
                appName:"highway-maintenance-system",
                reportName: "All_Gis_chainage_Files",
                id: LatestRecordID,
                fieldName : "OffsetRHSLine12"
            }
            ZOHO.CREATOR.API.readFile (OffsetRHSLine12).then(function (responseOffsetRHSLine12) {
              OffsetRHSLine12CSV = responseOffsetRHSLine12; 
                 //************************OffsetRHSLine3*********************** */ 
                 var OffsetRHSLine3 = {
                  appName:"highway-maintenance-system",
                  reportName: "All_Gis_chainage_Files",
                  id: LatestRecordID,
                  fieldName : "OffsetRHSLine3"
              }
              ZOHO.CREATOR.API.readFile (OffsetRHSLine3).then(function (responseOffsetRHSLine3) {
                OffsetRHSLine3CSV = responseOffsetRHSLine3; 
                    //************************OffsetLHSLine3*********************** */ 
                    var OffsetLHSLine3 = {
                      appName:"highway-maintenance-system",
                      reportName: "All_Gis_chainage_Files",
                      id: LatestRecordID,
                      fieldName : "OffsetLHSLine3"
                  }
                  ZOHO.CREATOR.API.readFile (OffsetLHSLine3).then(function (responseOffsetLHSLine3) {
                    OffsetLHSLine3CSV = responseOffsetLHSLine3; 
                      //************************OffsetLHSLine3*********************** */ 
                      var BridgeFile = {
                        appName:"highway-maintenance-system",
                        reportName: "All_Gis_chainage_Files",
                        id: LatestRecordID,
                        fieldName : "BridgeFile"
                    }
                    ZOHO.CREATOR.API.readFile (BridgeFile).then(function (responseBridgeFile) {
                      BridgeFileCSV = responseBridgeFile; 
  //************************Service Road*********************** */ 
  var ServiceRoadFile = {
    appName:"highway-maintenance-system",
    reportName: "All_Gis_chainage_Files",
    id: LatestRecordID,
    fieldName : "ServiceRoadFiles"
}
ZOHO.CREATOR.API.readFile (ServiceRoadFile).then(function (responseServiceRoadFile) {
  ServiceRoadFileCSV = responseServiceRoadFile; 


                      var AssetsCount = {
                        appName:"highway-maintenance-system",
                        reportName: "All_Gis_Project_Facility_Masters",
                        criteria: "(SPV.Display_Name == \"SJEPL\")",
                       }
                       ZOHO.CREATOR.API.getRecordCount(AssetsCount).then(function (responseAssetsCount){
                       var TotalAssetsCount = parseInt(responseAssetsCount.result['records_count']);

                        if(TotalAssetsCount > 200)
                        {
                         var count  = Math.ceil(TotalAssetsCount/200);
                         for(var i = 1 ; i <= count ; i++)
                         {
                           var configAssets = {
                            appName:"highway-maintenance-system",
                            reportName: "All_Gis_Project_Facility_Masters",
                            criteria: "(SPV.Display_Name == \"SJEPL\")",
                             page: i,
                             pageSize: 200
                         }
                         ZOHO.CREATOR.API.getAllRecords(configAssets).then(function (responseAssets) {
                             recordArrProjectAssets.push(responseAssets.data);        
                            
                         });
                         }
                         
                        }
                        else{
                                     //Getting Project Assets data
                      var configProjectAssets = {
                        appName:"highway-maintenance-system",
                        reportName: "All_Gis_Project_Facility_Masters",
                        criteria: "(SPV.Display_Name == \"SJEPL\")",
                        page: 1,
                        pageSize: 200
                    }
                    ZOHO.CREATOR.API.getAllRecords(configProjectAssets).then(function (responseProjectAssets) {
                        recordArrProjectAssets.push(responseProjectAssets.data);  
                        
                    });
                        }
                        
                //***************** Encroachment Count **************** */  
                var EncroachmentCount = {
                  appName:"incident-management-system",
                  criteria: "(SPV.Spv_Name == \"SJEPL\")",
                  reportName : "Encroachment_Summary1",
                 }
                 ZOHO.CREATOR.API.getRecordCount(EncroachmentCount).then(function (responseEncroachmentCount){
                 var TotalEncroachmentCount = parseInt(responseEncroachmentCount.result['records_count']);
                         
                   //*************** Fetching Encroachment data******** */
                  console.log(TotalEncroachmentCount);
                   if(TotalEncroachmentCount > 200)
                   {
                    var count  = Math.ceil(TotalEncroachmentCount/200);
                    for(var i = 1 ; i <= count ; i++)
                    {
                      var configEncroachment = {
                        appName:"incident-management-system",
                        reportName: "Encroachment_Summary1",
                        criteria: "(SPV.Spv_Name == \"SJEPL\")",
                        page: i,
                        pageSize: 200
                    }
                    ZOHO.CREATOR.API.getAllRecords(configEncroachment).then(function (responseEncroachment) {
                      console.log(responseEncroachment)
                        recordArrEncroachment.push(responseEncroachment.data);        
                      
                    });
                    }
                   }
                   else{
                    var configEncroachment = {
                      appName:"incident-management-system",
                      reportName: "Encroachment_Summary1",
                      criteria: "(SPV.Spv_Name == \"SJEPL\")",
                      page: 1,
                      pageSize: 200
                  }
                  ZOHO.CREATOR.API.getAllRecords(configEncroachment).then(function (responseEncroachment) {
                    console.log(responseEncroachment)
                      recordArrEncroachment = responseEncroachment.data;    
                   
                      
                  });
                   }
         //***************** Incidents Count **************** */  
               var IncidentCount = {
                appName:"incident-management-system",
                criteria: "(SPV.Spv_Name == \"SJEPL\")",
                reportName : "Admin_Incident",
               }
               ZOHO.CREATOR.API.getRecordCount(IncidentCount).then(function (responseIncidentCount){
                TotalIncidentCount = parseInt(responseIncidentCount.result['records_count']);
                       
                 //*************** Fetching Incidents data******** */
                console.log(TotalIncidentCount);
                 if(TotalIncidentCount > 200)
                 {
                  var count  = Math.ceil(TotalIncidentCount/200);
                  for(var i = 1 ; i <= count ; i++)
                  {
                    var configIncident = {
                      appName:"incident-management-system",
                      reportName: "Admin_Incident",
                      criteria: "(SPV.Spv_Name == \"SJEPL\")",
                      page: i,
                      pageSize: 200
                  }
                  ZOHO.CREATOR.API.getAllRecords(configIncident).then(function (responseIncident) {
                    console.log(responseIncident)
                      recordArrIncidents.push(responseIncident.data);        
                      CSVtoGeoJson();
                  });
                  }
                 }
                 else{
                  var configIncident = {
                    appName:"incident-management-system",
                    reportName: "Admin_Incident",
                    criteria: "(SPV.Spv_Name == \"SJEPL\")",
                    page: 1,
                    pageSize: 200
                }
                ZOHO.CREATOR.API.getAllRecords(configIncident).then(function (responseIncident) {
                  console.log(responseIncident)
                    recordArrIncidents = responseIncident.data;    
                    CSVtoGeoJson(); 
                    
                });
                 }
                 var IncidentImage = {
                  appName:"incident-management-system",
                  reportName: "Photos_Comments_SF_Report",
                  page: 1,
                  pageSize: 200
              }
              ZOHO.CREATOR.API.getAllRecords(IncidentImage).then(function (responseIncidentImage) {
                console.log(responseIncidentImage)
                  recordArrIncidentsImage = responseIncidentImage.data;  

              });
                                        //************ Workzone master ***************/
                                        var Workzone = {
                                          appName:"highway-maintenance-system",
                                          reportName: "All_Workzone_Masters",
                                          id: LatestRecordIDWorkzone,
                                          fieldName : "work_zone_file"
                                        }
                                        ZOHO.CREATOR.API.readFile(Workzone).then(function (responseWorkzone) {
                                          recordArrWorkzoneCSV =responseWorkzone; 
                                        });
                                      });
                                    });
                   });
                  });
                  });
                    });
                      });
                    });
                  });
              });
            });
          });
        });
        });
        });
        });
        });
        });
          });
        });
        });
    });
  }
  function CSVtoGeoJson()
  { 
  var CSVSplitMeadianRHS = MeadianRHSCSV.split('\n');
  for (var i = 0; i < CSVSplitMeadianRHS.length; i++) {
  const columns = CSVSplitMeadianRHS[i].split(',');
  const lat = parseFloat(columns[0]);
  const lng = parseFloat(columns[1]);
  const Chainage = parseFloat(columns[2]);
  if(!isNaN(lat) && !isNaN(lng))
  {
    var temp = {
      lat : lat,
      lng : lng,
      chainage : Chainage 
    }
    MeadianRHSArr.push(temp);
  } 
 }
 

  //*********************Converting LHS Meadian *********************/
 var CSVSplitMeadianLHS = MeadianLHSCSV.split('\n');
 for (var i = 0; i < CSVSplitMeadianLHS.length; i++) {
 const columns = CSVSplitMeadianLHS[i].split(',');
 const lat = parseFloat(columns[0]);
 const lng = parseFloat(columns[1]);
 const Chainage = parseFloat(columns[2]);
 if(!isNaN(lat) && !isNaN(lng))
 {
   var temp = {
     lat : lat,
     lng : lng,
     chainage : Chainage 
   }
   MeadianLHSArr.push(temp);
 } 
}

  //*********************Converting Offset LHSLine1 *********************/
  var CSVSplitOffsetLHS1 = OffsetLHSLine1CSV.split('\n');
  for (var i = 0; i < CSVSplitOffsetLHS1.length; i++) {
  const columns = CSVSplitOffsetLHS1[i].split(',');
  const lat = parseFloat(columns[0]);
  const lng = parseFloat(columns[1]);
  const Chainage = parseFloat(columns[2]);
  if(!isNaN(lat) && !isNaN(lng))
  {
    var temp = {
      lat : lat,
      lng : lng,
      chainage : Chainage 
    }
    OffsetLHSLine1Arr.push(temp);
  } 
 }

   //*********************Converting Offset LHSLine2 *********************/
   var CSVSplitOffsetLHS2 = OffsetLHSLine2CSV.split('\n');
   for (var i = 0; i < CSVSplitOffsetLHS2.length; i++) {
   const columns = CSVSplitOffsetLHS2[i].split(',');
   const lat = parseFloat(columns[0]);
   const lng = parseFloat(columns[1]);
   const Chainage = parseFloat(columns[2]);
   if(!isNaN(lat) && !isNaN(lng))
   {
     var temp = {
       lat : lat,
       lng : lng,
       chainage : Chainage 
     }
     OffsetLHSLine2Arr.push(temp);
   } 
  }
    //*********************Converting Offset LHSLine11 *********************/
    var CSVSplitOffsetLHS11 = OffsetLHSLine11CSV.split('\n');
    for (var i = 0; i < CSVSplitOffsetLHS11.length; i++) {
    const columns = CSVSplitOffsetLHS11[i].split(',');
    const lat = parseFloat(columns[0]);
    const lng = parseFloat(columns[1]);
    const Chainage = parseFloat(columns[2]);
    if(!isNaN(lat) && !isNaN(lng))
    {
      var temp = {
        lat : lat,
        lng : lng,
        chainage : Chainage 
      }
      OffsetLHSLine11Arr.push(temp);
    } 
   }
    //*********************Converting Offset LHSLine12 *********************/
    var CSVSplitOffsetLHS12 = OffsetLHSLine12CSV.split('\n');
    for (var i = 0; i < CSVSplitOffsetLHS12.length; i++) {
    const columns = CSVSplitOffsetLHS12[i].split(',');
    const lat = parseFloat(columns[0]);
    const lng = parseFloat(columns[1]);
    const Chainage = parseFloat(columns[2]);
    if(!isNaN(lat) && !isNaN(lng))
    {
      var temp = {
        lat : lat,
        lng : lng,
        chainage : Chainage 
      }
      OffsetLHSLine12Arr.push(temp);
    } 
   }
      //*********************Converting Offset RHSLine1 *********************/
      var CSVSplitOffsetRHS1 = OffsetRHSLine1CSV.split('\n');
      for (var i = 0; i < CSVSplitOffsetRHS1.length; i++) {
      const columns = CSVSplitOffsetRHS1[i].split(',');
      const lat = parseFloat(columns[0]);
      const lng = parseFloat(columns[1]);
      const Chainage = parseFloat(columns[2]);
      if(!isNaN(lat) && !isNaN(lng))
      {
        var temp = {
          lat : lat,
          lng : lng,
          chainage : Chainage 
        }
        OffsetRHSLine1Arr.push(temp);
      } 
     }
           //*********************Converting Offset RHSLine2 *********************/
           var CSVSplitOffsetRHS2 = OffsetRHSLine2CSV.split('\n');
           for (var i = 0; i < CSVSplitOffsetRHS2.length; i++) {
           const columns = CSVSplitOffsetRHS2[i].split(',');
           const lat = parseFloat(columns[0]);
           const lng = parseFloat(columns[1]);
           const Chainage = parseFloat(columns[2]);
           if(!isNaN(lat) && !isNaN(lng))
           {
             var temp = {
               lat : lat,
               lng : lng,
               chainage : Chainage 
             }
             OffsetRHSLine2Arr.push(temp);
           } 
          }
              //*********************Converting Offset RHSLine11 *********************/
    var CSVSplitOffsetRHS11 = OffsetRHSLine11CSV.split('\n');
    for (var i = 0; i < CSVSplitOffsetRHS11.length; i++) {
    const columns = CSVSplitOffsetRHS11[i].split(',');
    const lat = parseFloat(columns[0]);
    const lng = parseFloat(columns[1]);
    const Chainage = parseFloat(columns[2]);
    if(!isNaN(lat) && !isNaN(lng))
    {
      var temp = {
        lat : lat,
        lng : lng,
        chainage : Chainage 
      }
      OffsetRHSLine11Arr.push(temp);
    } 
   }
                 //*********************Converting Offset RHSLine11 *********************/
                 var CSVSplitOffsetRHS12 = OffsetRHSLine12CSV.split('\n');
                 for (var i = 0; i < CSVSplitOffsetRHS12.length; i++) {
                 const columns = CSVSplitOffsetRHS12[i].split(',');
                 const lat = parseFloat(columns[0]);
                 const lng = parseFloat(columns[1]);
                 const Chainage = parseFloat(columns[2]);
                 if(!isNaN(lat) && !isNaN(lng))
                 {
                   var temp = {
                     lat : lat,
                     lng : lng,
                     chainage : Chainage 
                   }
                   OffsetRHSLine12Arr.push(temp);
                 } 
                }
        //*********************Converting Offset RHSLine3 *********************/
        var CSVSplitOffsetRHS3 = OffsetRHSLine3CSV.split('\n');
        for (var i = 0; i < CSVSplitOffsetRHS3.length; i++) {
        const columns = CSVSplitOffsetRHS3[i].split(',');
        const lat = parseFloat(columns[0]);
        const lng = parseFloat(columns[1]);
        const Chainage = parseFloat(columns[2]);
        if(!isNaN(lat) && !isNaN(lng))
        {
          var temp = {
            lat : lat,
            lng : lng,
            chainage : Chainage 
          }
          OffsetRHSLine3Arr.push(temp);
        } 
       }   
               //*********************Converting Offset LHSLine3 *********************/
               var CSVSplitOffsetLHS3 = OffsetLHSLine3CSV.split('\n');
               for (var i = 0; i < CSVSplitOffsetLHS3.length; i++) {
               const columns = CSVSplitOffsetLHS3[i].split(',');
               const lat = parseFloat(columns[0]);
               const lng = parseFloat(columns[1]);
               const Chainage = parseFloat(columns[2]);
               if(!isNaN(lat) && !isNaN(lng))
               {
                 var temp = {
                   lat : lat,
                   lng : lng,
                   chainage : Chainage 
                 }
                 OffsetLHSLine3Arr.push(temp);
               } 
              }        
              
//Initiating all functions
plottingMeadianRHS()
plottingMeadianLHS()
plottingOffsetLHSLine1()
plottingOffsetLHSLine2()
fillAreaBetweenLines()
fillAreaBetweenOffsetLHSLine1()
fillAreaBetweenOffsetLHSLine2()



plottingOffsetLine(OffsetRHSLine1Arr)
plottingOffsetLine(OffsetRHSLine2Arr)

fillAreaBetweenOffsetRHSLine1()
fillAreaBetweenOffsetRHSLine2()


plottingOffsetLine(OffsetRHSLine3Arr)
plottingOffsetLine(OffsetLHSLine3Arr)

fillAreaBetweenOffsetRHSLine3()
fillAreaBetweenOffsetLHSLine3()



ServiceRoadPlotting()
BridgePlotting()
plottingOffsetDashedLine(OffsetLHSLine11Arr);
plottingOffsetDashedLine(OffsetLHSLine12Arr);
plottingOffsetDashedLine(OffsetRHSLine11Arr);
plottingOffsetDashedLine(OffsetRHSLine12Arr);
 var executedAtZoom17 = false; // Flag to track if functions have been executed at zoom level 17
//var executedAtZoom17 = false; // Flag to track if functions have been executed at zoom level 17

// google.maps.event.addListener(map, 'zoom_changed', function () {
//     var currentZoomLevel = map.getZoom();
    
//     if (currentZoomLevel >= 17 && !executedAtZoom17) {
//         // EarthworksAndMainTrack(CenterLineArr);
//         // plottingOffsetDashedLine(OffsetLHSLine11Arr);
//         // plottingOffsetDashedLine(OffsetLHSLine12Arr);
//         // plottingOffsetDashedLine(OffsetRHSLine11Arr);
//         // plottingOffsetDashedLine(OffsetRHSLine12Arr);
//         //Plotting Assets
//         PlottingAssetsMarkers();
//         executedAtZoom17 = true; // Set the flag to true
//     } else if (currentZoomLevel < 17 && executedAtZoom17) {
//       //Removing Assets
//       RemovePlottingAssetsMarker();
//       //Remove Dashed line
//      // RemoveDashedLine();
//         executedAtZoom17 = false; // Reset the flag when zoom level goes below 17
//     }
// });
}

/**
 * Service road plotting
 */
function ServiceRoadPlotting()
{

  var CSVSplitServiceRoadFile = ServiceRoadFileCSV.split('\n');
  var coordinatesString;
 // console.log(CSVSplitServiceRoadFile)
                 for (var i = 1; i < CSVSplitServiceRoadFile.length; i++) {
                 const columns = CSVSplitServiceRoadFile[i].split('|,');
                 const ServiceRoad_No = (columns[0]);
                 const Side = (columns[1]);
                 const From = (columns[2]);
                 const To = (columns[3]);
                 const Length = (columns[4]);
                 const Width = (columns[5]);
                 const Coordinate = (columns[6]);

               //  console.log(Coordinate);
                 if (Coordinate) {
                   coordinatesString = Coordinate.slice(1, -3);
                   
                //  console.log("After Trim - > "+coordinatesString);
              } else {
                 // console.log("coordinatesString is undefined or empty");
              }
                 if(ServiceRoad_No != '')
                 {
                   var temp = {
                      ServiceRoad_No : ServiceRoad_No,
                      Side : Side,
                      To : To ,
                      From : From,
                      Length:Length,
                      Width :Width,
                      Coordinate : coordinatesString
                   }
                   ServiceRoadFileArr.push(temp);
                 } 
                } 
                //console.log(ServiceRoadFileArr)
                
                //let formattedOutput = [JSON.parse(ServiceRoadFileArr[1]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               // console.log((JSON.parse(formattedOutput)))
              // Format the output
              for(var i = 0 ; i < ServiceRoadFileArr.length ; i++)
              {
                let formattedOutput = [JSON.parse(ServiceRoadFileArr[i]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               console.log(ServiceRoadFileArr[i]['From'])
                var geojson1 = {
                  "type": "FeatureCollection",
                  "features": [
                  { "type": "Feature", "properties": { 
                    "ServiceRoadNo": ServiceRoadFileArr[i]['ServiceRoad_No'],
                    "From": ServiceRoadFileArr[i]['From'],
                    "To": ServiceRoadFileArr[i]['To'],
                    "Length": ServiceRoadFileArr[i]['Length'],
                    "Width": ServiceRoadFileArr[i]['Width'],
                  },
                   "geometry": { "type": "Polygon", 
                  "coordinates": [((JSON.parse(formattedOutput)))]
                },
                }
                  ]
              };
              var infoWindow = new google.maps.InfoWindow();
              map.data.addListener('mouseover', function (event) {
                if (event.feature.getProperty('ServiceRoadNo')) {

                    infoWindow.setContent(
                    "<strong>ServiceRoad No : " + event.feature.getProperty('ServiceRoadNo')
                    + "<br></strong>From : " + event.feature.getProperty('From')
                    + "<br></strong>To : " + event.feature.getProperty('To')
                    + "<br></strong>Length : " + event.feature.getProperty('Length')
                    + "<br></strong>Width : " + event.feature.getProperty('Width')
                    )
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                }
            });
            
            map.data.addListener('mouseout', function () {
                infoWindow.close();
            });
            var feature1 = map.data.addGeoJson(geojson1, {});
              map.data.overrideStyle(feature1[0], {
                  strokeColor: 'Black',
                  strokeWeight: 2,
                  fillOpacity : 0.8,
                 // fillColor : Black
              }); 
              }

}


function plottingMeadianRHS() {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": MeadianRHSArr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});
  map.data.overrideStyle(feature[0], {
      strokeColor: 'white',
      strokeWeight: 3
  });
}

function plottingMeadianLHS() {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": MeadianLHSArr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  }; 
  var feature = map.data.addGeoJson(geojson, {});
  map.data.overrideStyle(feature[0], {
      strokeColor: 'white',
      strokeWeight: 2
  });
}

function plottingOffsetLHSLine1() {
    // Convert the array of coordinates into a GeoJSON format
    var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": OffsetLHSLine1Arr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});
  map.data.overrideStyle(feature[0], {
      strokeColor: 'white',
      strokeWeight: 2
  });
}


function plottingOffsetLHSLine2() {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": OffsetLHSLine2Arr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});
  map.data.overrideStyle(feature[0], {
      strokeColor: 'white',
      strokeWeight: 2
  });
}

function plottingOffsetLine(arr) {
  // Convert the array of coordinates into a GeoJSON format
  var geojson = {
      "type": "FeatureCollection",
      "features": [{
          "type": "Feature",
          "geometry": {
              "type": "LineString",
              "coordinates": arr.map(function(coord) {
                  return [coord.lng, coord.lat];
              })
          },
          "properties": {}
      }]
  };
  var feature = map.data.addGeoJson(geojson, {});
  map.data.overrideStyle(feature[0], {
      strokeColor: 'white',
      strokeWeight: 2
  });
}
function fillAreaBetweenLines() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  for (var i = 0; i < MeadianRHSArr.length; i++) {
      polygonCoords.push({ lat: MeadianRHSArr[i].lat, lng: MeadianRHSArr[i].lng });
  }
  for (var i = MeadianLHSArr.length - 1; i >= 0; i--) {
      polygonCoords.push({ lat: MeadianLHSArr[i].lat, lng: MeadianLHSArr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'green',
    fillOpacity: 1
});
polygon.setMap(map);
}
//***************************Offset LHSLine 1 Colour Fill******************* */
function fillAreaBetweenOffsetLHSLine1() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  for (var i = 0; i < OffsetLHSLine1Arr.length; i++) {
      polygonCoords.push({ lat: OffsetLHSLine1Arr[i].lat, lng: OffsetLHSLine1Arr[i].lng });
  }
  for (var i = MeadianLHSArr.length - 1; i >= 0; i--) {
      polygonCoords.push({ lat: MeadianLHSArr[i].lat, lng: MeadianLHSArr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'black',
    fillOpacity: 1
});
polygon.setMap(map);
}

//***************************Offset LHSLine 2 Colour Fill******************* */

function fillAreaBetweenOffsetLHSLine2() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  var pointsWithChainage = []; // Array to store points with their chainage

  for (var i = 0; i < OffsetLHSLine1Arr.length; i++) {
      var point = { lat: OffsetLHSLine1Arr[i].lat, lng: OffsetLHSLine1Arr[i].lng, chainage: OffsetLHSLine1Arr[i].chainage };
      polygonCoords.push({ lat: point.lat, lng: point.lng });
      pointsWithChainage.push(point);
  }
  for (var i = OffsetLHSLine2Arr.length - 1; i >= 0; i--) {
      var point = { lat: OffsetLHSLine2Arr[i].lat, lng: OffsetLHSLine2Arr[i].lng, chainage: OffsetLHSLine2Arr[i].chainage };
      polygonCoords.push({ lat: point.lat, lng: point.lng });
      pointsWithChainage.push(point);
  }

  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
      paths: polygonCoords,
      strokeColor: 'white',
      strokeOpacity: 0.8,
      strokeWeight: 2,
      fillColor: 'black',
      fillOpacity: 1
  });
  polygon.setMap(map);

  // Add a click event listener to the polygon

  google.maps.event.addListener(polygon, 'click', function(event) {
      var clickedLatLng = event.latLng;
       nearestPoint = findNearestPoint(clickedLatLng, pointsWithChainage);
      if (nearestPoint) {

        showInfoWindow(clickedLatLng, 'Chainage: ' + nearestPoint.chainage);

      }
  });
}

// Function to find the nearest point with chainage
function findNearestPoint(clickedLatLng, pointsWithChainage) {
  var minDist = Number.MAX_VALUE;
  var nearestPoint = null;

  pointsWithChainage.forEach(function(point) {
      var pointLatLng = new google.maps.LatLng(point.lat, point.lng);
      var dist = google.maps.geometry.spherical.computeDistanceBetween(clickedLatLng, pointLatLng);
      if (dist < minDist) {
          minDist = dist;
          nearestPoint = point;
      }
  });

  return nearestPoint;
}

function showInfoWindow(latLng, content) {
  console.log(nearestPoint.chainage)
  // Remove the current overlay if it exists
  if (currentOverlay) {
      currentOverlay.setMap(null);
  }

  var infoWindowDiv = document.createElement('div');
  infoWindowDiv.className = 'chainage-info-window';
  var createIncidentURL = 'https://creatorapp.zoho.in/rcidmaplehwmis/incident-management-system/#Form:Create_Incident?Chainage=' + nearestPoint.chainage;
  var createEncroachmentURL = 'https://creatorapp.zoho.in/rcidmaplehwmis/incident-management-system/#Form:Encroachment_Management?Chainage=' + nearestPoint.chainage;
  
  infoWindowDiv.innerHTML = `
    <button class="close-button">&times;</button>
    ${content}
    <div class="dropdown">
        <div class="dropdown-menu" style="display: block; margin-top: 10px;">
            <a href="${createIncidentURL}" target="_blank">Create Incident</a>
            <a href="${createEncroachmentURL}" target="_blank">Create Encroachment</a>
        </div>
    </div>
  `;
  
  // Assuming you have some method to add the info window to the map
  addInfoWindowToMap(infoWindowDiv, nearestPoint);
  
  function addInfoWindowToMap(infoWindowDiv, nearestPoint) {
    // Your logic to add the infoWindowDiv to the map at the position of nearestPoint
    var infoWindow = new google.maps.InfoWindow({
      content: infoWindowDiv
    });
  
    infoWindow.setPosition({
      lat: nearestPoint.latitude,
      lng: nearestPoint.longitude
    });
  
    infoWindow.open(map);
  }
  

  var overlay = new google.maps.OverlayView();
  overlay.onAdd = function() {
      var layer = this.getPanes().floatPane;
      layer.appendChild(infoWindowDiv);
  };

  // Add event listener for the close button
  var closeButton = infoWindowDiv.querySelector('.close-button');
  closeButton.addEventListener('click', function() {
      if (currentOverlay) {
          currentOverlay.setMap(null);
          currentOverlay = null;
      }
  });

  overlay.draw = function() {
      var projection = this.getProjection();
      var position = projection.fromLatLngToDivPixel(latLng);
      infoWindowDiv.style.left = position.x + 'px';
      infoWindowDiv.style.top = position.y + 'px';
  };
  overlay.onRemove = function() {
      infoWindowDiv.parentNode.removeChild(infoWindowDiv);
      overlay = null;
  };
  overlay.setMap(map);

  // Update the current overlay reference
  currentOverlay = overlay;
}



//***************************Offset RHSLine 1 Colour Fill******************* */
function fillAreaBetweenOffsetRHSLine1() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  for (var i = 0; i < OffsetRHSLine1Arr.length; i++) {
      polygonCoords.push({ lat: OffsetRHSLine1Arr[i].lat, lng: OffsetRHSLine1Arr[i].lng });
  }
  for (var i = MeadianRHSArr.length - 1; i >= 0; i--) {
      polygonCoords.push({ lat: MeadianRHSArr[i].lat, lng: MeadianRHSArr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'black',
    fillOpacity: 1
});
polygon.setMap(map);
}
//***************************Offset RHSLine 2 Colour Fill******************* */
function fillAreaBetweenOffsetRHSLine2() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  var pointsWithChainage = []; 
  for (var i = 0; i < OffsetRHSLine1Arr.length; i++) {
    var point = { lat: OffsetRHSLine1Arr[i].lat, lng: OffsetRHSLine1Arr[i].lng, chainage: OffsetRHSLine1Arr[i].chainage };
      polygonCoords.push({ lat: point.lat, lng: point.lng });
      pointsWithChainage.push(point);
  }
  for (var i = OffsetRHSLine2Arr.length - 1; i >= 0; i--) {
    var point = { lat: OffsetRHSLine2Arr[i].lat, lng: OffsetRHSLine2Arr[i].lng, chainage: OffsetRHSLine2Arr[i].chainage };
    polygonCoords.push({ lat: point.lat, lng: point.lng });
    pointsWithChainage.push(point);
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 0.8,
    strokeWeight: 2,
    fillColor: 'black',
    fillOpacity: 1
});
polygon.setMap(map);

  // Add a click event listener to the polygon

  google.maps.event.addListener(polygon, 'click', function(event) {
    var clickedLatLng = event.latLng;
     nearestPoint = findNearestPoint(clickedLatLng, pointsWithChainage);
    if (nearestPoint) {

      showInfoWindow(clickedLatLng, 'Chainage: ' + nearestPoint.chainage);

    }
});
}
function fillAreaBetweenOffsetRHSLine3() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  // Push coordinates from OffsetRHSLine2Arr
  for (var i = 0; i < OffsetRHSLine3Arr.length; i++) {
    polygonCoords.push({ lat: OffsetRHSLine3Arr[i].lat, lng: OffsetRHSLine3Arr[i].lng });
  }
  // Push coordinates from OffsetRHSLine3Arr in reverse order
  for (var i = OffsetRHSLine2Arr.length - 1; i >= 0; i--) {
    polygonCoords.push({ lat: OffsetRHSLine2Arr[i].lat, lng: OffsetRHSLine2Arr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'brown',
    fillOpacity: 1
  });
  polygon.setMap(map);
}
function fillAreaBetweenOffsetLHSLine3() {
  // Create an array of coordinates for the polygon
  var polygonCoords = [];
  // Push coordinates from OffsetRHSLine2Arr
  for (var i = 0; i < OffsetLHSLine3Arr.length; i++) {
    polygonCoords.push({ lat: OffsetLHSLine3Arr[i].lat, lng: OffsetLHSLine3Arr[i].lng });
  }
  // Push coordinates from OffsetRHSLine3Arr in reverse order
  for (var i = OffsetLHSLine2Arr.length - 1; i >= 0; i--) {
    polygonCoords.push({ lat: OffsetLHSLine2Arr[i].lat, lng: OffsetLHSLine2Arr[i].lng });
  }
  // Convert the array of coordinates into a GeoJSON format
  var polygon = new google.maps.Polygon({
    paths: polygonCoords,
    strokeColor: 'white',
    strokeOpacity: 1,
    strokeWeight: 2,
    fillColor: 'brown',
    fillOpacity: 1
  });
  polygon.setMap(map);
}


function plottingOffsetDashedLine(arr) {
  // Remove this line that adds the full line
  // var feature = map.data.addGeoJson(geojson, {});

  // Create a Polyline with dashed line style
 
  var path = arr.map(function(coord) {
      return { lat: coord.lat, lng: coord.lng };
  });
  const lineSymbol = {
    path: "M 0,-1 0,1",
    strokeOpacity: 1,
    scale: 4,
  };
  // const line = new google.maps.Polyline({
  //   path: path,
  //   strokeOpacity: 0,
  //   icons: [
  //     {
  //       icon: lineSymbol,
  //       offset: "0",
  //       repeat: "20px",
  //     },
  //   ],
  //   map: map,
  // });
  var polyline = new google.maps.Polyline({
      path: path,
      strokeColor: 'white',
      strokeWeight: 0,
      map: map,
      icons: [{
          icon: {
              path: 'M 0,-1 0,1',
              strokeOpacity: 0.95,
              scale: 4
          },
          offset: '0',
          repeat: '20px'
      }]
  });
  DashedLineRemove.push(polyline);
 
   
    
}

function RemoveDashedLine()
{
//  console.log(DashedLineRemove);
  for (let i = 0; i < DashedLineRemove.length; i++) {
    DashedLineRemove[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  DashedLineRemove = []; 

}
 /**
  * Bridge Plotting 
  */
function BridgePlotting() {
   
  var CSVSplitBridgeFile = BridgeFileCSV.split('\n');
  var coordinatesString;
 // console.log(CSVSplitBridgeFile)
                 for (var i = 1; i < CSVSplitBridgeFile.length; i++) {
                 const columns = CSVSplitBridgeFile[i].split('|,');
                 const BridgeType = (columns[0]);
                 const Bridge_No = (columns[1]);
                 const Chainage = (columns[2]);
                 const Side = (columns[3]);
                 const Proposed_treatment = (columns[4]);
                 const Coordinate = (columns[5]);
               //  console.log(Coordinate);
                 if (Coordinate) {
                   coordinatesString = Coordinate.slice(1, -3);
                //  console.log("After Trim - > "+coordinatesString);
              } else {
                 // console.log("coordinatesString is undefined or empty");
              }
                 if(Bridge_No != '' && Chainage != undefined)
                 {
                   var temp = {
                     BridgeType : BridgeType,
                      Bridge_No : Bridge_No,
                      Side : Side,
                     chainage : Chainage ,
                     Proposed_treatment : Proposed_treatment,
                     Coordinate : coordinatesString
                   }
                   BridgeFileArr.push(temp);
                 } 
                } 
                //console.log(BridgeFileArr)
                
                let formattedOutput = [JSON.parse(BridgeFileArr[1]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               // console.log((JSON.parse(formattedOutput)))
              // Format the output
              for(var i = 0 ; i < BridgeFileArr.length ; i++)
              {
                let formattedOutput = [JSON.parse(BridgeFileArr[i]['Coordinate'])].map(coord => '[[' + coord.join('],[ ') + ']]').join(',\n');
               // console.log((JSON.parse(formattedOutput)))
                var geojson1 = {
                  "type": "FeatureCollection",
                  "features": [{
                      "type": "Feature",
                      "geometry": {
                          "type": "LineString",
                          "coordinates": ((JSON.parse(formattedOutput)))
                          
                      },
                      "properties": {
                        "bridgeNo": BridgeFileArr[i]['Bridge_No'],
                        "bridgeType": BridgeFileArr[i]['BridgeType'],
                        "chainage": BridgeFileArr[i]['chainage'],
                      }
                  }]
              };
              var infoWindow = new google.maps.InfoWindow();
              map.data.addListener('mouseover', function (event) {
                if (event.feature.getProperty('bridgeNo')) {
                    infoWindow.setContent("<strong>Bridge No : " + event.feature.getProperty('bridgeNo')
                    + "<br></strong>Bridge Type : " + event.feature.getProperty('bridgeType')
                    + "<br></strong>Bridge Chainage : " + event.feature.getProperty('chainage')
                    )
                    infoWindow.setPosition(event.latLng);
                    infoWindow.open(map);
                }
            });
            
            map.data.addListener('mouseout', function () {
                infoWindow.close();
            });
            //   var BridgePolyline = new google.maps.Polyline({
            //     //path: ((JSON.parse(formattedOutput))),
            //     geodesic: true,
            //   //  strokeColor: color,
            //     strokeOpacity: 1.0,
            //     strokeWeight: 2,
            //     structure: "Bridge",
            //     structureNo: BridgeFileArr[i]['Bridge_No'],
            // });
      
            // BridgePolyline.addListener('mouseover', function (event) {
            //   BridgeInfoBox(BridgeFileArr, event);
            // });
      
            // BridgePolyline.addListener('mouseout', function () {
            //     infoWindow.close();
            // });
            //   // BridgeFileArr.addListener('mouseover', function () {
            //   //   BridgeInfoBox(BridgeFileArr);
            //   // });
            var feature1 = map.data.addGeoJson(geojson1, {});
              map.data.overrideStyle(feature1[0], {
                  strokeColor: 'red',
                  strokeWeight: 5
              }); 
              }

              PlottingProjectAssets();
            
  }
  function PlottingProjectAssets()
  {
    
    OffsetLHSLine3Arr //--> LHS Unpaved Line
    OffsetRHSLine3Arr //--> RHS Unpaved Line
    MainCSV //--> Main Still in CSv
    
    //*********************Converting Meadian *********************/
   var CSVSplitMeadian = MainCSV.split('\n');
   for (var i = 0; i < CSVSplitMeadian.length; i++) {
   const columns = CSVSplitMeadian[i].split(',');
   const lat = parseFloat(columns[0]);
   const lng = parseFloat(columns[1]);
   const Chainage = parseFloat(columns[2]);
   if(!isNaN(lat) && !isNaN(lng))
   {
     var temp = {
       lat : lat,
       lng : lng,
       chainage : Chainage 
     }
     MainCSVArr.push(temp);
   } 
  }
  console.log(recordArrProjectAssets)
  for(var k = 0 ; k < recordArrProjectAssets.length;k++){
  
  for(var i = 0 ; i < recordArrProjectAssets[k].length ; i++)
  {
     if(recordArrProjectAssets[k][i]['Level1_Master']['display_value'] == 'Median')
     {
       var lat,lng;
         for(var j = 0 ; j < MainCSVArr.length ; j++ )
         {
          if( MainCSVArr[j]['chainage'] == recordArrProjectAssets[k][i]['Static_Chainage'])
          {         
            lat = MainCSVArr[j]['lat'];
            lng = MainCSVArr[j]['lng']
          }
         }
          var temp = {
          Asset : recordArrProjectAssets[k][i]['AssetCategory']['display_value'],
          AssetSubCategory:recordArrProjectAssets[k][i]['Asset_Sub_Category']['display_value'],
          Chainage : recordArrProjectAssets[k][i]['Static_Chainage'],
          side : recordArrProjectAssets[k][i]['Level1_Master']['display_value'],
          Latlng : {lat,lng},
          map: map,
        }   
        MeadianAssetsArr.push(temp);
     }
     if(recordArrProjectAssets[k][i]['Level1_Master']['display_value'] == 'LHS')
     {
      var lat,lng;
      for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++ )
      {
       if( OffsetLHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k][i]['Static_Chainage'])
       {         
         lat = OffsetLHSLine3Arr[j]['lat'];
         lng = OffsetLHSLine3Arr[j]['lng']
       }
      }
      var temp = {
        Asset : recordArrProjectAssets[k][i]['AssetCategory']['display_value'],
        AssetSubCategory:recordArrProjectAssets[k][i]['Asset_Sub_Category']['display_value'],
        Chainage : recordArrProjectAssets[k][i]['Static_Chainage'],
        side : recordArrProjectAssets[k][i]['Level1_Master']['display_value'],
        Latlng : {lat,lng}
      }   
      LHSAssetsArr.push(temp);
     }
     if(recordArrProjectAssets[k][i]['Level1_Master']['display_value'] == 'RHS')
     {
      var lat,lng;
      for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++ )
      {
       if( OffsetRHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k][i]['Static_Chainage'])
       {         
         lat = OffsetRHSLine3Arr[j]['lat'];
         lng = OffsetRHSLine3Arr[j]['lng']
       }
      }
      var temp = {
        Asset : recordArrProjectAssets[k][i]['AssetCategory']['display_value'],
        AssetSubCategory:recordArrProjectAssets[k][i]['Asset_Sub_Category']['display_value'],
        Chainage : recordArrProjectAssets[k][i]['Static_Chainage'],
        side : recordArrProjectAssets[k][i]['Level1_Master']['display_value'],
        Latlng : {lat,lng},
      } 
      RHSAssetsArr.push(temp);
     }
     if(recordArrProjectAssets[k][i]['Level1_Master']['display_value'] == 'BHS')
     {
      var lat1,lng1,lat2,lng2;
      for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++ )
      {
        if(OffsetRHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k][i]['Static_Chainage'])
        {         
          lat1 = OffsetRHSLine3Arr[j]['lat'];
          lng1 = OffsetRHSLine3Arr[j]['lng']
        }
      }
      for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++ )
      {
        if(OffsetLHSLine3Arr[j]['chainage'] == recordArrProjectAssets[k][i]['Static_Chainage'])
        {         
          lat2 = OffsetLHSLine3Arr[j]['lat'];
          lng2 = OffsetLHSLine3Arr[j]['lng']
        }
      }
      var temp1 = {
        Asset : recordArrProjectAssets[k][i]['AssetCategory']['display_value'],
        AssetSubCategory:recordArrProjectAssets[k][i]['Asset_Sub_Category']['display_value'],
        Chainage : recordArrProjectAssets[k][i]['Static_Chainage'],
        Latlng : {lat: lat1, lng: lng1},
        side : 'RHS',
      } 
      var temp2 = {
        Asset : recordArrProjectAssets[k][i]['AssetCategory']['display_value'],
        AssetSubCategory:recordArrProjectAssets[k][i]['Asset_Sub_Category']['display_value'],
        Chainage : recordArrProjectAssets[k][i]['Static_Chainage'],
        Latlng : {lat: lat2, lng: lng2},
        side : 'LHS',
      } 
      BHSAssetsArr.push(temp1);
      BHSAssetsArr.push(temp2);
     }
    }
  
  
  }
  
  }



  // Array to keep track of all markers
var markers = [];

function handleToggle(category, side, isChecked, subCategory) {
  console.log(`Category: ${category}, Side: ${side}, Checked: ${isChecked}, SubCategory: ${subCategory}`);
  var arrays = [LHSAssetsArr, RHSAssetsArr, MeadianAssetsArr, BHSAssetsArr]; // Add your additional arrays here

  // If the checkbox is untoggled, remove the markers for the specified category and side
  if (!isChecked) {
    removeMarkers(category, side, subCategory);
    return;
  }

  for (var j = 0; j < arrays.length; j++) {
    var currentArray = arrays[j];
    console.log(currentArray);

    for (var i = 0; i < currentArray.length; i++) {
      var anchorX = 35; // Default anchor X
      var anchorY = 35; // Default anchor Y
      if (currentArray[i]['side'] === 'RHS') { // Correct property name
        anchorX = 20; // Adjust anchor X for RHS
        anchorY = 20; // Adjust anchor Y for RHS
      }

      let downloadUrl = '';
      let matchedAsset = false;

      // Check for Asset and AssetSubCategory being defined
      if (currentArray[i]['Asset'] !== '' && currentArray[i]['AssetSubCategory'] !== undefined) {
        console.log(currentArray[i]['AssetSubCategory'] + " - " + subCategory + " / " + currentArray[i]['Asset'] + " - " + category);
        for (var k = 0; k < recordArrAssetsImage.length; k++) {
          if (currentArray[i]['Asset'] === category && currentArray[i]['AssetSubCategory'] === subCategory) {
            if (recordArrAssetsImage[k]['Asset_Category']['display_value'] === category && recordArrAssetsImage[k]['Level1']['display_value'] === side && currentArray[i]['side'] === side) {
              console.log(recordArrAssetsImage[k]);
              var apiAssetImage = recordArrAssetsImage[k]['Image'];
              var parts = apiAssetImage.split('/');
              var partsFilepath = apiAssetImage.split('?filepath=');
              downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/' + parts[7] + '/Image/image-download?filepath=/' + partsFilepath[1];
              matchedAsset = true;
            }
          }
        }
        if (matchedAsset) {
          createMarker(currentArray[i], downloadUrl, category, side, subCategory, isChecked);
        }
      }

      // Combined Check for Asset with undefined AssetSubCategory
      if (currentArray[i]['Asset'] !== '' && currentArray[i]['AssetSubCategory'] === undefined && currentArray[i]['Asset'] === category) {
        for (var k = 0; k < recordArrAssetsImage.length; k++) {
          if (recordArrAssetsImage[k]['Asset_Category']['display_value'] === category) {
            if (recordArrAssetsImage[k]['Level1']['display_value'] === side && currentArray[i]['side'] === side || recordArrAssetsImage[k]['Level1']['display_value'] === undefined) {
              console.log(recordArrAssetsImage[k]);
              var apiAssetImage = recordArrAssetsImage[k]['Image'];
              var parts = apiAssetImage.split('/');
              var partsFilepath = apiAssetImage.split('?filepath=');
              downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/' + parts[7] + '/Image/image-download?filepath=/' + partsFilepath[1];
              createMarker(currentArray[i], downloadUrl, category, side, subCategory, isChecked);
            }
          }
        }
      }
    }
  }
}

function createMarker(assetData, downloadUrl, category, side, subCategory, isChecked) {
  var infowindowContent = 'Asset: ' + assetData['Asset'] + '<br>' +
    'Chainage: ' + assetData['Chainage'];

  var infowindow = new google.maps.InfoWindow({
    content: infowindowContent,
  });

  var iconDesign = {
    url: downloadUrl,
    scaledSize: new google.maps.Size(30, 30),
  };

  var AssetMarker = new google.maps.Marker({
    icon: iconDesign,
    animation: google.maps.Animation.DROP,
    position: assetData['Latlng'],
    map: map,
  });

  // Use a closure to capture the correct infowindow for each marker
  google.maps.event.addListener(AssetMarker, 'mouseover', (function (infowindow, AssetMarker) {
    return function () {
      infowindow.open(map, AssetMarker);
    };
  })(infowindow, AssetMarker));

  google.maps.event.addListener(AssetMarker, 'mouseout', (function (infowindow, AssetMarker) {
    return function () {
      infowindow.close();
    };
  })(infowindow, AssetMarker));

  markers.push({ marker: AssetMarker, category: category, side: side, subCategory: subCategory });

  if (!isChecked) {
    AssetMarker.setMap(null);
  } else {
    AssetMarker.setMap(map);
  }
}

function removeMarkers(category, side, subCategory) {
  for (var i = 0; i < markers.length; i++) {
    if (markers[i].category === category && markers[i].side === side && markers[i].subCategory === subCategory) {
      markers[i].marker.setMap(null);
    }
  }
  // Remove markers from the array that are not on the map anymore
  markers = markers.filter(markerObj => markerObj.category !== category || markerObj.side !== side || markerObj.subCategory !== subCategory);
}

window.handleToggle = handleToggle;


  function PlottingAssetsMarkers() {
    console.log(recordArrAssetsImage);
    var arrays = [LHSAssetsArr, RHSAssetsArr, MeadianAssetsArr, BHSAssetsArr]; // Add your additional arrays here
    for (var j = 0; j < arrays.length; j++) {
      var currentArray = arrays[j];
  
      for (var i = 0; i < currentArray.length; i++) {
        var anchorX = 35; // Default anchor X
        var anchorY = 35; // Default anchor Y
        if (currentArray[i]['Side'] == 'RHS') {
          anchorX = 20; // Adjust anchor X for BHS
          anchorY = 20; // Adjust anchor Y for BHS
        }
        ;
        if(currentArray[i]['Asset'] != '' && currentArray[i]['AssetSubCategory'] != '' && currentArray[i]['AssetSubCategory'] != undefined)
        {     
          for(var k = 0 ; k < recordArrAssetsImage.length ; k++){
           // console.log(recordArrAssetsImage[k]['Asset_Category']['display_value']+" / "+ currentArray[i]['Asset'] +" -> "+currentArray[i]['AssetSubCategory'] +" / "+recordArrAssetsImage[k]['Asset_Sub_Category']['display_value']);
            if(currentArray[i]['Asset'] == recordArrAssetsImage[k]['Asset_Category']['display_value'] && 
            currentArray[i]['AssetSubCategory'] == recordArrAssetsImage[k]['Asset_Sub_Category']['display_value']){
              var apiAssetImage = recordArrAssetsImage[k]['Image'];
                // Split the URL to get the filepath
                var parts = apiAssetImage.split('/');
                var partsFilepath = apiAssetImage.split('?filepath=');
                  var downloadUrl = 'https://creatorapp.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/'+ parts[7] +'/Image/image-download?filepath=/'+partsFilepath[1];   
            }
          }
        }
        if(currentArray[i]['Asset'] != '' && currentArray[i]['AssetSubCategory'] == undefined)
        {     
          for(var k = 0 ; k < recordArrAssetsImage.length ; k++){
            if(currentArray[i]['Asset'] == recordArrAssetsImage[k]['Asset_Category']['display_value']){
              var apiAssetImage = recordArrAssetsImage[k]['Image'];
              // Split the URL to get the filepath
              var parts = apiAssetImage.split('/');
              var partsFilepath = apiAssetImage.split('?filepath=');
                // Construct the new image download URL
                var downloadUrl = 'https://creatorapp.zoho.in/file/rcidmaplehwmis/highway-maintenance-system/Assets_category_and_sub_category_master_Report/'+ parts[7] +'/Image/image-download?filepath=/'+partsFilepath[1]; 
                  console.log(downloadUrl)
                var currentUrl = window.location.href;
                  
            }
          }
        }
  
        var infowindowContent = 'Asset: ' + currentArray[i]['Asset'] + '<br>' +
        'Chainage: ' + currentArray[i]['Chainage'];
  
          var infowindow = new google.maps.InfoWindow({
          content: infowindowContent,
          });
         
          if (currentArray[i]['Asset'] == 'Street Light' ) { 
            
            var imageUrl;
            if(currentArray[i]['side'] == 'LHS' && currentArray[i]['AssetSubCategory'] == 'Single Arm')
              {
                imageUrl = './Assets/Icons/StreetLightLHS.png';
              }
              else if(currentArray[i]['side'] == 'RHS'&& currentArray[i]['AssetSubCategory'] == 'Single Arm')
                {
                  imageUrl = './Assets/Icons/StreetLightRHS.png';
                }
                else{
                  currentArray[i]['AssetSubCategory']
                  imageUrl = downloadUrl;
                }
          var iconDesign = {
          url: imageUrl,
          scaledSize: new google.maps.Size(30, 30),
         // anchor: new google.maps.Point(anchorX, anchorY),x
          };
          var AssetMarker = new google.maps.Marker({
            icon: iconDesign,
            animation: google.maps.Animation.DROP,
            position: currentArray[i]['Latlng'],
            map: map,
            });
        }else{
          
          var iconDesign = {
            url: downloadUrl,
            scaledSize: new google.maps.Size(30, 30),
           // anchor: new google.maps.Point(25, 25),
          };
          var AssetMarker = new google.maps.Marker({
            icon: iconDesign,
            animation: google.maps.Animation.DROP,
            position: currentArray[i]['Latlng'],
            map: map,
            });
        }
          
  
          // Use a closure to capture the correct infowindow for each marker
          (function(infowindow, AssetMarker) {
          // Add event listener for mouseover to open the InfoWindow
          google.maps.event.addListener(AssetMarker, 'mouseover', function() {
          infowindow.open(map, AssetMarker);
          });
  
          // Add event listener for mouseout to close the InfoWindow
          google.maps.event.addListener(AssetMarker, 'mouseout', function() {
          infowindow.close();
          });
          })(infowindow, AssetMarker);
  
                  RemoveAssetMarker.push(AssetMarker);
                
        
      }
    }
  }



function RemovePlottingAssetsMarker() {
//  PrecastBoxCulvertPolyline.setMap(null); 
for (let i = 0; i < RemoveAssetMarker.length; i++) {
  RemoveAssetMarker[i].setMap(null); // Set the map property to null to remove the circle from the map
}
RemoveAssetMarker = []; // Clear the array
}



let IncidentsID = document.getElementById("bt-clear");
IncidentsID.addEventListener('click', function () {
  removePlottingIncident();
  removePlottingEncroachment();
  
  // Reset select elements
  document.getElementById('category-select').selectedIndex = 0;
  document.getElementById('type-select').selectedIndex = 0;
  document.getElementById('nature-select').selectedIndex = 0;
  document.getElementById('duration').selectedIndex = 0;

  // Reset checkbox
  document.getElementById('enable-calendar').checked = false;
  toggleDateFields(); // Ensure date fields are disabled

  // Reset date inputs
  document.getElementById('start-date').value = '';
  document.getElementById('end-date').value = '';

  // Optionally, if you need to reset the dropdowns completely, you can clear and re-add the 'Select' option
  var TypeSelect = document.getElementById('type-select');


  TypeSelect.innerHTML = ''; // Clear existing options


  var defaultOptionGroup = document.createElement('option');
  defaultOptionGroup.value = '';
  defaultOptionGroup.innerHTML = 'Select';
  TypeSelect.appendChild(defaultOptionGroup);

  var defaultOptionCategory = document.createElement('option');
  defaultOptionCategory.value = '';
  defaultOptionCategory.innerHTML = 'Select';


  // Reset asset group and category select elements to 'Select'
  TypeSelect.selectedIndex = 0;

});

function toggleDateFields() {
  var isChecked = document.getElementById('enable-calendar').checked;
  document.getElementById('start-date').disabled = !isChecked;
  document.getElementById('end-date').disabled = !isChecked;
}




let ElementID = document.getElementById("workzone");
ElementID.addEventListener('change', function () {
  PlottingWorkzone()
});

// let encroachmentID = document.getElementById("encroachment");
// encroachmentID.addEventListener('change', function () {
//   removeMarkers()
// });

        // Function to parse custom date format (e.g., "11-Jun-2024")
        function parseDate(dateStr) {
          const [day, month, year] = dateStr.split('-');
          const months = {
              'Jan': 0, 'Feb': 1, 'Mar': 2, 'Apr': 3, 'May': 4, 'Jun': 5,
              'Jul': 6, 'Aug': 7, 'Sep': 8, 'Oct': 9, 'Nov': 10, 'Dec': 11
          };
          const parsedDate = new Date(year, months[month], day);

          // Format the date as dd-mm-yyyy
          const formattedDate = [
              String(parsedDate.getDate()).padStart(2, '0'),
              String(parsedDate.getMonth() + 1).padStart(2, '0'),  // Months are 0-based
              parsedDate.getFullYear()
          ].join('-');

          return formattedDate;
        }

function defectcallbackFunctionIncident(category, type, nature,selectedStartDate,selectedEndDate)
{
  console.log(type+" / "+nature+" / "+selectedStartDate+" / "+selectedEndDate)
  
  removePlottingIncident();
  // // Remove previously added circles if checkbox is unchecked
  // if (!IncidentsID.checked) {
  //   removePlottingIncident();
  //   return;
  // }
console.log(recordArrIncidents);
 FinalIncident = [];
   for(var i = 0 ; i < recordArrIncidents.length ; i++)
  {
    if(recordArrIncidents[i]['Chainage'] != '')
    {
      var StaticChainage = parseFloat(recordArrIncidents[i]['Chainage']);
      if( !isNaN(StaticChainage))
      {
        var IncidentImage = [];
        for(var k = 0 ; k < recordArrIncidentsImage.length ; k++)
        {
         
          if(recordArrIncidentsImage[k]['Incident_No']['display_value'] == recordArrIncidents[i]['Incident_No'])
          {
            console.log(recordArrIncidentsImage[k]['Attach_Photo']); 
            var apiImage = recordArrIncidentsImage[k]['Attach_Photo'];
            var downloadUrl;
             // Split the URL to get the filepath
             var parts = apiImage.split('/');
             var partsFilepath = apiImage.split('?filepath=');
               // Construct the new image download URL
                downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/incident-management-system/Photos_Comments_SF_Report/'+ parts[7] +'/Attach_Photo/image-download?filepath=/'+partsFilepath[1]; 
                IncidentImage.push(downloadUrl);    
          }         
        }
        // Creating Temp Array
        var temp = {
           Incident_No: recordArrIncidents[i]['Incident_No'],
           StaticChainage: recordArrIncidents[i]['Chainage'],
           Side : recordArrIncidents[i]['Direction'],
           Incident_date_time : recordArrIncidents[i]['Incident_date_time'],
           Incident_nature : recordArrIncidents[i]['Incident_nature'],
           Incident_type : recordArrIncidents[i]['Incident_type1']['display_value'],
           Road_Section:recordArrIncidents[i]['Road_Section']['display_value'],
           Status : recordArrIncidents[i]['Status'],
          
           IncidentImage : IncidentImage,
           Latlng : [],
           Added_Time : recordArrIncidents[i]['Added_Time']
        }
        FinalIncident.push(temp);
      }     
    }
  }

  for(var i = 0 ; i < FinalIncident.length ; i++)
  {
    if(FinalIncident[i]['Side'] != '')
    {
      if(FinalIncident[i]['Side'] == 'LHS')
      {
        for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++)
        {
          if(FinalIncident[i]['StaticChainage'] == OffsetLHSLine3Arr[j]['chainage'])
          {              
            var lat = OffsetLHSLine3Arr[j]['lat'];
            var lng = OffsetLHSLine3Arr[j]['lng']
            FinalIncident[i]['Latlng'] = {lat,lng};
            break;
          }
        }
      }
      else if(FinalIncident[i]['Side'] == "BHS")
      {
        for(var j = 0 ; j < MainCSVArr.length ; j++)
        {
            if(FinalIncident[i]['StaticChainage'] == MainCSVArr[j]['chainage'])
            {
              
              var lat = MainCSVArr[j]['lat'];
              var lng = MainCSVArr[j]['lng']
              FinalIncident[i]['Latlng'] = {lat,lng};
              break;
            }
        }
      }
      else{    
        for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++)
        {   
          if(FinalIncident[i]['StaticChainage'] == OffsetRHSLine3Arr[j]['chainage'])
          {
            var lat = OffsetRHSLine3Arr[j]['lat'];
            var lng = OffsetRHSLine3Arr[j]['lng'];
            FinalIncident[i]['Latlng'] = {lat,lng};
            break;
          }
        }        
      }
    }
  }


  //Marking Defects to Gmap
  // Keep track of the currently open info window
var currentInfoWindow = null;

function createMarkerIcon(number, baseIconUrl, callback) {
  const canvas = document.createElement('canvas');
  const size = 40; // Size of the marker icon
  const numberHeight = 20; // Height to accommodate the number above the marker
  canvas.width = size;
  canvas.height = size + numberHeight; // Increase the height to accommodate the number
  const context = canvas.getContext('2d');

  // Load the base icon
  const baseImage = new Image();
  baseImage.src = baseIconUrl;
  baseImage.onload = function () {
    // Draw the base icon
    context.drawImage(baseImage, 0, numberHeight, size, size);

    // Draw the number above the marker
    context.font = '20px Arial';
    context.fillStyle = '#000000'; // Text color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, size / 2, numberHeight / 2);

    // Return the marker icon URL
    callback(canvas.toDataURL());
  };
}

for (var i = 0; i < FinalIncident.length; i++) {
  if(FinalIncident[i]['Incident_type'] == type && (nature === 'Select' ? true : FinalIncident[i]['Incident_nature'] == nature) && Date(parseDate(FinalIncident[i]['Added_Time'].split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(FinalIncident[i]['Added_Time'].split(" ")[0])) <= Date(selectedEndDate))
  (function (Incident) {

    var lat = Incident.Latlng['lat'];
    var lng = Incident.Latlng['lng'];
    if (!isNaN(lat) && !isNaN(lng)) {
     // console.log(FinalIncident[i]['Incident_No'] + " / " + lat + " / " + lng + " / " + FinalIncident[i]['StaticChainage']);
      var markerIconUrl = './Assets/Icons/incident.png';                      
      // Create the marker icon with the incident number
var markerCount=0;                                                                                                                                                                                                                                                             
      for(var l = 0 ; l < FinalIncident.length ; l ++){

        if(FinalIncident[l]['Incident_type'] == "Accident"){
          if(FinalIncident[l]['Incident_type'] == "Accident" && FinalIncident[l]['Incident_nature'] == nature && FinalIncident[l]['StaticChainage'] == Incident.StaticChainage && FinalIncident[l]['Incident_nature'] == nature && Date(parseDate(FinalIncident[l]['Added_Time'].split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(FinalIncident[l]['Added_Time'].split(" ")[0])) <= Date(selectedEndDate)){
            markerCount = markerCount + 1;
         }
        }
        else if(FinalIncident[l]['Incident_type'] == type && FinalIncident[l]['StaticChainage'] == Incident.StaticChainage && Date(parseDate(FinalIncident[l]['Added_Time'].split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(FinalIncident[l]['Added_Time'].split(" ")[0])) <= Date(selectedEndDate)){
           markerCount = markerCount + 1;
        }
      }
      createMarkerIcon(markerCount, markerIconUrl, function (iconUrl) {
        var marker = new google.maps.Marker({
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(30, 50), // Adjusted size to accommodate number
            // anchor: new google.maps.Point(15, 25), // Adjusted anchor point
          },
          animation: google.maps.Animation.BOUNCE,
          position: { lat, lng },
          map: map,
        });

        Incidentmarker.push(marker);

        marker.addListener('click', function () {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }

          // Fetch chainage value
          var chainage = Incident.StaticChainage;

          // Filter incidents based on the chainage
          var filteredIncidents = FinalIncident.filter(function(incident) {
            if(incident['Incident_type'] == "Accident"){
              return incident.StaticChainage === chainage && incident.Incident_nature == nature && Date(parseDate(incident.Added_Time.split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(incident.Added_Time.split(" ")[0])) <= Date(selectedEndDate);
            }else{
              return incident.StaticChainage === chainage && incident.Incident_type == type && Date(parseDate(incident.Added_Time.split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(incident.Added_Time.split(" ")[0])) <= Date(selectedEndDate);
            }
            
          });

          // Create content for the info window
          var contentString = '<div class="custom-info-window"><h3>Incidents at Chainage ' + chainage + '</h3>';

          filteredIncidents.forEach(function(incident, index) {
            contentString += '<p> <span class="SubmenuStyle"> Incident No   </span>  : ' + '<b class="listStyle">' + incident.Incident_No + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Chainage   </span>  : ' + '<b class="listStyle">' + incident.StaticChainage + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Incident nature    </span>  : ' + '<b class="listStyle">' + incident.Incident_nature + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Incident date & time   </span>  : ' + '<b class="listStyle">' + incident.Incident_date_time + '</b> </p>'+
              '<p> <span class="SubmenuStyle"> Road Section   </span>  : ' + '<b class="listStyle">' + incident.Road_Section + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Side  </span>  : ' + '<b class="listStyle">' + incident.Side + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Incident type   </span>  : ' + '<b class="listStyle">' + incident.Incident_type + '</b> </p>';

            // Loop through the incident images and add <img> tags for each image
            for (var j = 0; j < incident.IncidentImage.length; j++) {
              contentString += '<p> <span class="SubmenuStyle"> Incident Image   </span> : <br><img style="max-width: 100px; max-height: 100px;" src="' + incident.IncidentImage[j] + '"></p>';
            }

            // Add a divider between incidents, but not after the last one
            if (index < filteredIncidents.length - 1) {
              contentString += '<hr>';
            }
          });

          contentString += '</div>';

          // Show info window
          var infowindow = new google.maps.InfoWindow({
            content: contentString,
          });

          infowindow.open(map, marker);
          currentInfoWindow = infowindow;
        });
      });
    }
  })(FinalIncident[i]);

}


}
function removePlottingIncident()
{

  for (let i = 0; i < Incidentmarker.length; i++) {
    Incidentmarker[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  Incidentmarker = []; // Clear the array
}
  window.defectcallbackFunctionIncident = defectcallbackFunctionIncident;


function PlottingWorkzone(){
  if (!ElementID.checked) {
    removeWorkzone();
    return;
  }
  var currentInfoWindow = null;
  var CSVSplitWorkzone = recordArrWorkzoneCSV.split('\n');
  for (var i = 0; i < CSVSplitWorkzone.length; i++) {
    const columns = CSVSplitWorkzone[i].split(',');
    const date = (columns[0]);
    const chainage = parseFloat(columns[1]);
    const workDescription = (columns[2]);
    const vendor = (columns[3]);
    if(!isNaN(chainage) && date != '') {
      var temp = {
        date : date,
        chainage : chainage,
        workDescription : workDescription,
        vendor : vendor 
      }
      WorkzoneArr.push(temp);
    } 
  }

  for(var i = 0 ; i < WorkzoneArr.length ; i++){
    var lat,lng;
    for(var j = 0 ; j < MainCSVArr.length ; j++){
      if(MainCSVArr[j]['chainage'] == WorkzoneArr[i]['chainage']){
        lat = MainCSVArr[j]['lat'];
        lng = MainCSVArr[j]['lng']
      }
    }
    var temp = {
      Date : WorkzoneArr[i]['date'],
      chainage : WorkzoneArr[i]['chainage'],
      workDescription : WorkzoneArr[i]['workDescription'],
      vendor : WorkzoneArr[i]['vendor'],
      latlng : {lat,lng}
    }

    var iconDesign = {
      url: './Assets/Icons/workzone.png',
      scaledSize: new google.maps.Size(30, 30),
      anchor: new google.maps.Point(20, 20),
    };

    var marker = new google.maps.Marker({
      icon: iconDesign,
      animation: google.maps.Animation,
      position: { lat, lng },
      map: map,
    });
    WorkzoneMarker.push(marker);
    var contentString = '<div class="custom-info-window"><h3 class="DefectDetailsHeading">Workzone Details</h3>' +
      '<p> <span class="SubmenuStyle"> Date   </span>  : ' + '<b class="listStyle">'+WorkzoneArr[i]['date'] + '</b> </p>' + 
      '<p> <span class="SubmenuStyle"> Chainage   </span>  : ' + '<b class="listStyle">'+ WorkzoneArr[i]['chainage'] + '</b> </p>' + 
      '<p> <span class="SubmenuStyle"> Description  </span>  : ' + '<b class="listStyle">'+WorkzoneArr[i]['workDescription'] + '</b> </p>' + 
      '<p> <span class="SubmenuStyle"> Vendor  </span>  : ' + '<b class="listStyle">'+WorkzoneArr[i]['vendor'] + '</b> </p>' +
      '</div>';

    var infowindow = new google.maps.InfoWindow({
      content: contentString,
    });

    // Use a closure to capture the correct infowindow for each marker
    (function(infowindow, marker) {
      marker.addListener('click', function () {
        // Close the current info window if one is open
        if (currentInfoWindow) {
          currentInfoWindow.close();
        }
        // Open the clicked marker's info window
        infowindow.open(map, marker);
        // Set the current info window to the newly opened info window
        currentInfoWindow = infowindow;
      });
    })(infowindow, marker);
  }
}
function removeWorkzone()
{

  for (let i = 0; i < WorkzoneMarker.length; i++) {
    WorkzoneMarker[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  WorkzoneMarker = []; // Clear the array
}



//Plotting Encroachments
function defectcallbackFunctionEncroachment(category, type,selectedStartDate,selectedEndDate)
{
  removePlottingEncroachment();
  // //Remove previously added circles if checkbox is unchecked
  // if (!encroachmentID.checked) {
  //   removePlottingEncroachment();
  //   return;
  // }
console.log(recordArrEncroachment);
  FinalEncroachment = [];

   for(var i = 0 ; i < recordArrEncroachment.length ; i++)
  {
    if(recordArrEncroachment[i]['Chainage'] != '')
    {
      var StaticChainage = parseFloat(recordArrEncroachment[i]['Chainage']);
      if( !isNaN(StaticChainage))
      {
        var encroachmentImage = [];
        console.log(recordArrEncroachment[i]['Photos_Comments'][0]);
        if(recordArrEncroachment[i]['Photos_Comments'].length != 0){
          console.log(recordArrEncroachment[i]['Photos_Comments']);
          var apiImage = recordArrEncroachment[i]['Photos_Comments'][0]['display_value'];
        console.log(apiImage)
        var downloadUrl;
         // Split the URL to get the filepath
         var parts = apiImage.split('/');
         console.log(parts[9]);
         var partsFilepath = apiImage.split('?filepath=');
           // Construct the new image download URL
            downloadUrl = 'https://creatorexport.zoho.in/file/rcidmaplehwmis/incident-management-system/Photos_Comments_SF_Report/'+ parts[9] +'/Attach_Photo/image-download?filepath=/'+partsFilepath[1]; 
            encroachmentImage.push(downloadUrl);  
        }
        
        // Creating Temp Array
        var temp = {
          Encroachment_ID: recordArrEncroachment[i]['Encroachment_ID'],
          StaticChainage: recordArrEncroachment[i]['Chainage'],
           Side : recordArrEncroachment[i]['Direction'],
           Encroachment_D_T : recordArrEncroachment[i]['Encroachment_D_T'],
           Encroachment_Category : recordArrEncroachment[i]['Encroachment_Category']['display_value'],
           Action_Taken : recordArrEncroachment[i]['Action_Taken']['display_value'],
           Action_Taken_D_T : recordArrEncroachment[i]['Action_Taken_D_T'],
           Removal_Status1 : recordArrEncroachment[i]['Removal_Status1'],
           encroachmentImage : encroachmentImage,
           Encroachment_Category : recordArrEncroachment[i]['Encroachment_Category']['display_value'],
           End_Chainage : recordArrEncroachment[i]['End_Chainage'],
           Latlng : [],
        }
        FinalEncroachment.push(temp);
      }     
    }
  }
console.log(FinalEncroachment[0]['Side'])
  for(var i = 0 ; i < FinalEncroachment.length ; i++)
  {
    if(FinalEncroachment[i]['Side'] != '')
    {
      if(FinalEncroachment[i]['Side'] == 'LHS')
      {
        for(var j = 0 ; j < OffsetLHSLine3Arr.length ; j++)
        {
          if(FinalEncroachment[i]['StaticChainage'] == OffsetLHSLine3Arr[j]['chainage'])
          {              
            var lat = OffsetLHSLine3Arr[j]['lat'];
            var lng = OffsetLHSLine3Arr[j]['lng']
            FinalEncroachment[i]['Latlng'] = {lat,lng};
            break;
          }
        }
      }
      else if(FinalEncroachment[i]['Side'] == "BHS")
      {
        for(var j = 0 ; j < MainCSVArr.length ; j++)
        {
            if(FinalEncroachment[i]['StaticChainage'] == MainCSVArr[j]['chainage'])
            {
              
              var lat = MainCSVArr[j]['lat'];
              var lng = MainCSVArr[j]['lng']
              FinalEncroachment[i]['Latlng'] = {lat,lng};
              break;
            }
        }
      }
      else{    
        for(var j = 0 ; j < OffsetRHSLine3Arr.length ; j++)
        {   
          if(FinalEncroachment[i]['StaticChainage'] == OffsetRHSLine3Arr[j]['chainage'])
          {
            var lat = OffsetRHSLine3Arr[j]['lat'];
            var lng = OffsetRHSLine3Arr[j]['lng'];
            FinalEncroachment[i]['Latlng'] = {lat,lng};
            break;
          }
        }        
      }
    }
  }


  //Marking Defects to Gmap
  // Keep track of the currently open info window
var currentInfoWindow = null;

function createMarkerIcon(number, baseIconUrl, callback) {
  const canvas = document.createElement('canvas');
  const size = 40; // Size of the marker icon
  const numberHeight = 20; // Height to accommodate the number above the marker
  canvas.width = size;
  canvas.height = size + numberHeight; // Increase the height to accommodate the number
  const context = canvas.getContext('2d');

  // Load the base icon
  const baseImage = new Image();
  baseImage.src = baseIconUrl;
  baseImage.onload = function () {
    // Draw the base icon
    context.drawImage(baseImage, 0, numberHeight, size, size);

    // Draw the number above the marker
    context.font = '20px Arial';
    context.fillStyle = '#000000'; // Text color
    context.textAlign = 'center';
    context.textBaseline = 'middle';
    context.fillText(number, size / 2, numberHeight / 2);

    // Return the marker icon URL
    callback(canvas.toDataURL());
  };
}
console.log(FinalEncroachment);
for (var i = 0; i < FinalEncroachment.length; i++) {
  if(FinalEncroachment[i]['Encroachment_Category'] == type && Date(parseDate(FinalEncroachment[i]['Encroachment_D_T'].split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(FinalEncroachment[i]['Encroachment_D_T'].split(" ")[0])) <= Date(selectedEndDate))
  (function (Encroachment) {
    console.log(Encroachment);
    var lat = Encroachment.Latlng['lat'];
    var lng = Encroachment.Latlng['lng'];
    if (!isNaN(lat) && !isNaN(lng)) {
      var markerIconUrl = './Assets/Icons/Encroachment.png';

      // Create the marker icon with the Encroachment number
      var markerCount=0;
      for(var l = 0 ; l < FinalEncroachment.length ; l ++){
        if(FinalEncroachment[l]['StaticChainage'] == Encroachment.StaticChainage && FinalEncroachment[l]['Encroachment_Category'] == type && Date(parseDate(FinalEncroachment[l]['Encroachment_D_T'].split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(FinalEncroachment[l]['Encroachment_D_T'].split(" ")[0])) <= Date(selectedEndDate)){
           markerCount = markerCount +1 ;
        }
      }
      createMarkerIcon(markerCount, markerIconUrl, function (iconUrl) {
        var marker = new google.maps.Marker({
          icon: {
            url: iconUrl,
            scaledSize: new google.maps.Size(30, 50), // Adjusted size to accommodate number
            // anchor: new google.maps.Point(15, 25), // Adjusted anchor point
          },
          animation: google.maps.Animation.BOUNCE,
          position: { lat, lng },
          map: map,
        });

        Encroachmentmarker.push(marker);

        marker.addListener('click', function () {
          if (currentInfoWindow) {
            currentInfoWindow.close();
          }

          // Fetch chainage value
          var chainage = Encroachment.StaticChainage;

          // Filter incidents based on the chainage
          var filteredencroachments = FinalEncroachment.filter(function(encroachment) {
            return encroachment.StaticChainage === chainage  && encroachment.Encroachment_Category == type && Date(parseDate(encroachment.Encroachment_D_T.split(" ")[0])) >= Date(selectedStartDate) && Date(parseDate(encroachment.Encroachment_D_T.split(" ")[0])) <= Date(selectedEndDate);
          });

          // Create content for the info window
          var contentString = '<div class="custom-info-window"><h3>encroachments at Chainage ' + chainage + '</h3>';

          filteredencroachments.forEach(function(encroachment, index) {
            contentString += '<p> <span class="SubmenuStyle"> Encroachment No   </span>  : ' + '<b class="listStyle">' + encroachment.Encroachment_ID + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Chainage   </span>  : ' + '<b class="listStyle">' + encroachment.StaticChainage + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> End Chainage    </span>  : ' + '<b class="listStyle">' + encroachment.End_Chainage + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Encroachment direction    </span>  : ' + '<b class="listStyle">' + encroachment.Side + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Encroachment date & time   </span>  : ' + '<b class="listStyle">' + encroachment.Encroachment_D_T + '</b> </p>'+
              '<p> <span class="SubmenuStyle"> Encroachment category   </span>  : ' + '<b class="listStyle">' + encroachment.Encroachment_Category + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Action taken    </span>  : ' + '<b class="listStyle">' + encroachment.Action_Taken + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Action date & time    </span>  : ' + '<b class="listStyle">' + encroachment.Action_Taken_D_T + '</b> </p>' +
              '<p> <span class="SubmenuStyle"> Removal status    </span>  : ' + '<b class="listStyle">' + encroachment.Removal_Status1 + '</b> </p>' ;
              contentString += '<p> <span class="SubmenuStyle"> Encroachment Image   </span> : <br><img style="max-width: 100px; max-height: 100px;" src="' + encroachment.encroachmentImage + '"></p>';
            //     // Loop through the incident images and add <img> tags for each image
            // for (var j = 0; j < encroachment.encroachmentImage.length; j++) {
            //   contentString += '<p> <span class="SubmenuStyle"> Encroachment Image   </span> : <br><img style="max-width: 100px; max-height: 100px;" src="' + encroachment.encroachmentImage[j] + '"></p>';
            // }

            // Add a divider between incidents, but not after the last one
            if (index < filteredencroachments.length - 1) {
              contentString += '<hr>';
            }
          });

          contentString += '</div>';

          // Show info window
          var infowindow = new google.maps.InfoWindow({
            content: contentString,
          });

          infowindow.open(map, marker);
          currentInfoWindow = infowindow;
        });
      });
    }
  })(FinalEncroachment[i]);

 
}


}
function removePlottingEncroachment()
{

  for (let i = 0; i < Encroachmentmarker.length; i++) {
    Encroachmentmarker[i].setMap(null); // Set the map property to null to remove the circle from the map
  }
  Encroachmentmarker = []; // Clear the array
}
window.defectcallbackFunctionEncroachment = defectcallbackFunctionEncroachment;









// function plotOffsetLines(arr) {
//   var offsetFeatures = [];
//   for (var i = 0; i < arr.length; i += 5) {
//       var coords = arr.slice(i, i + 5).map(function(coord) {
//           return [coord.lng, coord.lat];
//       });
//       if (coords.length >= 2) {
//           var geojson = {
//               "type": "FeatureCollection",
//               "features": [{
//                   "type": "Feature",
//                   "geometry": {
//                       "type": "LineString",
//                       "coordinates": coords
//                   },
//                   "properties": {}
//               }]
//           };
//           var feature = map.data.addGeoJson(geojson, {});
//           offsetFeatures.push(feature); // Store features in offsetFeatures
//       }
//   }
//   console.log(offsetFeatures); // Log the features to the console

//   // Set style for all offset lines
//   offsetFeatures.forEach(function(feature) {
//       map.data.overrideStyle(feature, {
//           strokeColor: 'white',
//           strokeWeight: 1
//       });
//   });
// }


 // for (var i = 0; i < FinalDefect.length; i++) {
  //   (function (defect, index) {
  //     var lat = defect.Latlng['lat'];
  //     var lng = defect.Latlng['lng'];
  //     if (!isNaN(lat)) {
  //       console.log(defect);
  //       var anchorX = 20; // Default anchor X
  //       var anchorY = 20;
  //       var statusIcon;
  //       if (defect['Ticket_Status'] == "Open") {
  //         statusIcon = './Assets/Icons/locationRed.png';
  //       } else {
  //         statusIcon = './Assets/Icons/locationGreen.png';
  //       }
  
  //       // Function to create a marker icon with a number
  //       function createMarkerIcon(number, baseIconUrl) {
  //         const canvas = document.createElement('canvas');
  //         const size = 40; // Size of the marker icon
  //         const numberHeight = 20; // Height to accommodate the number above the marker
  //         canvas.width = size;
  //         canvas.height = size + numberHeight; // Increase the height to accommodate the number
  //         const context = canvas.getContext('2d');
        
  //         // Load the base icon
  //         const baseImage = new Image();
  //         baseImage.src = baseIconUrl;
  //         baseImage.onload = function () {
  //           // Draw the base icon
  //           context.drawImage(baseImage, 0, numberHeight, size, size);
        
  //           // Draw the number above the marker
  //           context.font = '20px Arial';
  //           context.fillStyle = '#000000'; // Text color
  //           context.textAlign = 'center';
  //           context.textBaseline = 'middle';
  //           context.fillText(number, size / 2, numberHeight / 2);
        
  //           // Set the marker icon after the base image is loaded and number is drawn
  //           var marker = new google.maps.Marker({
  //             icon: {
  //               url: canvas.toDataURL(),
  //               scaledSize: new google.maps.Size(size, size + numberHeight), // Adjusted scaledSize
  //               //anchor: new google.maps.Point(size / 2, size / 2 + numberHeight / 2), // Adjusted anchor point
  //             },
  //             animation: google.maps.Animation.BOUNCE,
  //             position: { lat, lng },
  //             zIndex: 15,
  //             map: map,
  //           });
        
  //           Defectmarker.push(marker);
        
  //           var contentString = '<div class="custom-info-window"><h3 class="DefectDetailsHeading">Defect Details</h3>' +
  //             '<p> <span class="SubmenuStyle"> Ticket No   </span>  : ' + '<b class="listStyle">' + defect.TicketNo + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Static Chainage   </span>  : ' + '<b class="listStyle">' + defect.StaticChainage + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Chainage From   </span>  : ' + '<b class="listStyle">' + defect.ChainageFrom + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Chainage To  </span>  : ' + '<b class="listStyle">' + defect.ChainageTo + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Marker Chainage   </span>  : ' + '<b class="listStyle">' + defect.Midchainage + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Side  </span>  : ' + '<b class="listStyle">' + defect.Side + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Defect  </span>  : ' + '<b class="listStyle">' + defect.Defect + '</b> </p>' +
  //             '<p> <span class="SubmenuStyle"> Defect Description  </span>  : ' + '<b class="listStyle">' + defect.DefectDescription + '</b> </p>';
        
  //           // Loop through the defect images and add <img> tags for each image
  //           for (var j = 0; j < defect.DefectImage.length; j++) {
  //             contentString += '<p> <span class="SubmenuStyle"> Defect Image  </span>: <br><img style="max-width: 100px; max-height: 100px;" src="' + defect.DefectImage[j] + '"></p>';
  //           }
        
  //           var infowindow = new google.maps.InfoWindow({
  //             content: contentString,
  //           });
        
  //           marker.addListener('click', function () {
  //             // Close the current info window if one is open
  //             if (currentInfoWindow) {
  //               currentInfoWindow.close();
  //             }
  //             // Open the clicked marker's info window
  //             infowindow.open(map, marker);
  //             // Set the current info window to the newly opened info window
  //             currentInfoWindow = infowindow;
  //           });
  //         };
  //       }
        
  
  //       // Create the marker icon with the defect index + 1 as the number
  //       createMarkerIcon(index + 1, statusIcon);
  //     }
  //   })(FinalDefect[i], i);
  // }




