/*
{  
   resource=   {  
      generation=1542710544659782,
      metageneration=1,
      kind=storage#object,
      cacheControl=no-cache,
      selfLink=https://www.googleapis.com/storage/v1/b/BUCKETNAME-CS/o/20180425_1325_0080.flac,
      mediaLink=https://www.googleapis.com/download/storage/v1/b/BUCKETNAME-CS/o/20180425_1325_0080.flac?generation=1542710544659782&alt=media,
      bucket=BUCKETNAME-CS,
      storageClass=REGIONAL,
      size=16864699,
      md5Hash=iAAgccQ6bsnjSxMF7C9HYA==,
      crc32c=/dXzAQ==,
      timeStorageClassUpdated=2018-11-20T10:42:24.659      Z,
      name=20180425_1325_0080.flac,
      contentDisposition=attachment; filename="20180425_1325_0080.flac",
      timeCreated=2018-11-20T10:42:24.659      Z,
      etag=CMbqhdDk4t4CEAE=,
      id=BUCKETNAME-CS/20180425_1325_0080.flac/1542710544659782,
      contentType=audio/flac,
      updated=2018-11-20T10:42:24.659      Z
   },
   kind=storage#rewriteResponse,
   objectSize=16864699,
   totalBytesRewritten=16864699,
   done=true
}

*/

/*
{  
   generation=1542626966220983,
   metageneration=1,
   kind=storage#object,
   cacheControl=no-cache,
   selfLink=https://www.googleapis.com/storage/v1/b/BUCKETNAME-CS/o/www14.OC.com%2Fdl%2Fweb2%2Fdownload-file%2F6cac2715-14c7-430d-abeb-18b6b2c99930%2F20180425_1325_0080.flac,
   mediaLink=https://www.googleapis.com/download/storage/v1/b/BUCKETNAME-CS/o/www14.OC.com%2Fdl%2Fweb2%2Fdownload-file%2F6cac2715-14c7-430d-abeb-18b6b2c99930%2F20180425_1325_0080.flac?generation=1542626966220983&alt=media,
   bucket=BUCKETNAME-CS,
   storageClass=REGIONAL,
   size=16864699,
   md5Hash=iAAgccQ6bsnjSxMF7C9HYA==,
   crc32c=/dXzAQ==,
   timeStorageClassUpdated=2018-11-19T11:29:26.220   Z,
   name=www14.OC.com/dl/web2/download-file/6cac2715-14c7-430d-abeb-18b6b2c99930/20180425_1325_0080.flac,
   contentDisposition=attachment; filename="20180425_1325_0080.flac",
   timeCreated=2018-11-19T11:29:26.220   Z,
   etag=CLfh3qKt4N4CEAE=,
   id=BUCKETNAME-CS/www14.OC.com/dl/web2/download-file/6cac2715-14c7-430d-abeb-18b6b2c99930/20180425_1325_0080.flac/1542626966220983,
   contentType=audio/flac,
   updated=2018-11-19T11:29:26.220   Z
}
*/

/*
{  
   generation=1542709040541528,
   metageneration=1,
   kind=storage#object,
   selfLink=https://www.googleapis.com/storage/v1/b/BUCKETNAME-CS/o/20180425_1920_0059.flac,
   mediaLink=https://www.googleapis.com/download/storage/v1/b/BUCKETNAME-CS/o/20180425_1920_0059.flac?generation=1542709040541528&alt=media,
   bucket=BUCKETNAME-CS,
   storageClass=REGIONAL,
   size=7768840,
   md5Hash=W9lSQkZCXsFtzjQc2m010g==,
   crc32c=0UrROA==,
   timeStorageClassUpdated=2018-11-20T10:17:20.541   Z,
   name=20180425_1920_0059.flac,
   timeCreated=2018-11-20T10:17:20.541   Z,
   etag=CNje6YLf4t4CEAE=,
   id=BUCKETNAME-CS/20180425_1920_0059.flac/1542709040541528,
   contentType=audio/flac,
   updated=2018-11-20T10:17:20.541   Z
}


*/

/* polling_gst_work() success
{  
   operations=   [  
      {  
         metadata=         {  
            counters=            {  
               objectsFoundFromSource=2,
               bytesCopiedToSink=3683988,
               bytesFoundFromSource=3683988,
               objectsCopiedToSink=2
            },
            @type=type.googleapis.com/google.storagetransfer.v1.TransferOperation,
            name=transferOperations/transferJobs-12680207015371489254-1542632027802415,
            transferSpec=            {  
               gcsDataSink=               {  
                  bucketName=BUCKETNAME-CS
               },
               objectConditions=               {  
                  minTimeElapsedSinceLastModification=0s,
                  maxTimeElapsedSinceLastModification=604800s
               },
               httpDataSource=               {  
                  listUrl=gs://BUCKETNAME-CS/tsv.txt
               },
               transferOptions=               {  
                  overwriteObjectsAlreadyExistingInSink=true
               }
            },
            startTime=2018-11-19T12:54:00.138296955            Z,
            endTime=2018-11-19T12:54:21.986677883            Z,
            projectId=project-id-8464513615628612722,
            transferJobName=transferJobs/12680207015371489254,
            status=SUCCESS
         },
         response=         {  
            @type=type.googleapis.com/google.protobuf.Empty
         },
         name=transferOperations/transferJobs-12680207015371489254-1542632027802415,
         done=true
      }
   ]
}


*/

/* polling_gst_work() failed
{
  "operations": [
    {
      "name": "transferOperations/transferJobs-7571803056877923151-1542630598202431",
      "metadata": {
        "@type": "type.googleapis.com/google.storagetransfer.v1.TransferOperation",
        "name": "transferOperations/transferJobs-7571803056877923151-1542630598202431",
        "projectId": "project-id-8464513615628612722",
        "transferSpec": {
          "httpDataSource": {
            "listUrl": "gs://BUCKETNAME-CS/tsv.txt"
          },
          "gcsDataSink": {
            "bucketName": "BUCKETNAME-CS"
          },
          "objectConditions": {
            "minTimeElapsedSinceLastModification": "0s",
            "maxTimeElapsedSinceLastModification": "604800s"
          },
          "transferOptions": {
            "overwriteObjectsAlreadyExistingInSink": true
          }
        },
        "startTime": "2018-11-19T12:30:00.137253075Z",
        "endTime": "2018-11-19T12:30:21.712774025Z",
        "status": "FAILED",
        "counters": {
          "objectsFoundFromSource": "2",
          "bytesFoundFromSource": "17976274",
          "objectsCopiedToSink": "1",
          "bytesCopiedToSink": "1111575",
          "objectsFromSourceFailed": "1",
          "bytesFromSourceFailed": "16864699"
        },
        "errorBreakdowns": [
          {
            "errorCode": "NOT_FOUND",
            "errorCount": "1",
            "errorLogEntries": [
              {
                "url": "https://www14.OC.com/dl/web2/download-file/6cac2715-14c7-430d-abeb-18b6b2c99930/20180425_1325_0080.flac",
                "errorDetails": [
                  "[TRANSIENT FAILURE]: Server unable to initialize object upload.; Request headers: [GET /dl/web2/download-file/6cac2715-14c7-430d-abeb-18b6b2c99930/20180425_1325_0080.flac HTTP/1.1\r\nHost: www14.OC.com\r\nUser-Agent: Google CM\r\nRange: bytes=0-2097151\r\n\r\n].  Response headers: [HTTP/1.1 410 Gone\r\nServer: nginx\r\nContent-Type: application/json\r\nTransfer-Encoding: chunked\r\nConnection: keep-alive\r\nX-Powered-By: PHP/7.1.23\r\nCache-Control: no-cache, private\r\nX-Robots-Tag: noindex, nofollow, nosnippet, noarchive\r\nAccess-Control-Allow-Origin: *\r\nAccess-Control-Expose-Headers: Cache-Control, Content-Encoding, Content-Range\r\nDate: Mon, 19 Nov 2018 12:30:16 GMT\r\n\r\n].  Response body: [{\"error_code\":107,\"message\":\"The file download has been disabled\"}]."
                ]
              }
            ]
          }
        ],
        "transferJobName": "transferJobs/7571803056877923151"
      },
      "done": true,
      "response": {
        "@type": "type.googleapis.com/google.protobuf.Empty"
      }
    }
  ]
}
*/

/* send_gst_works()
 {
  "name": "transferJobs/7571803056877923151",
  "description": "20:29:57",
  "projectId": "project-id-8464513615628612722",
  "transferSpec": {
    "httpDataSource": {
      "listUrl": "gs://BUCKETNAME-CS/tsv.txt"
    },
    "gcsDataSink": {
      "bucketName": "BUCKETNAME-CS"
    },
    "objectConditions": {
      "minTimeElapsedSinceLastModification": "0s",
      "maxTimeElapsedSinceLastModification": "604800s"
    },
    "transferOptions": {
      "overwriteObjectsAlreadyExistingInSink": true
    }
  },
  "schedule": {
    "scheduleStartDate": {
      "year": 2018,
      "month": 11,
      "day": 19
    },
    "scheduleEndDate": {
      "year": 2018,
      "month": 11,
      "day": 19
    },
    "startTimeOfDay": {
      "hours": 12,
      "minutes": 30
    }
  },
  "status": "ENABLED",
  "creationTime": "2018-11-19T12:29:58.183421896Z",
  "lastModificationTime": "2018-11-19T12:29:58.183421896Z"
}
*/

/* get_key_status()
[  
   {  
      "created_at":"2018-11-15 01:00:00",
      "input_traffic":"399852",
      "output_traffic":"7055329",
      "job_counter":"1",
      "conversion_minutes":"2",
      "completed_jobs":"1",
      "failed_jobs":"0"
   },
   {  
      "created_at":"2018-11-15 02:00:00",
      "input_traffic":"767092",
      "output_traffic":"4640129",
      "job_counter":"1",
      "conversion_minutes":"2",
      "completed_jobs":"1",
      "failed_jobs":"0"
   },
   {  
      "created_at":"2018-11-15 03:00:00",
      "input_traffic":"331632",
      "output_traffic":"6128479",
      "job_counter":"1",
      "conversion_minutes":"2",
      "completed_jobs":"1",
      "failed_jobs":"0"
   }
]
*/

/* send_occ_work()
{
   "id":"3f5596bc-f746-40ae-8ba1-1e6c048784d0",
   "token":"301cef909f0a3f43bb9ae3ddc289c7c7",
   "type":"job",
   "status":{
      "code":"downloading",
      "info":"The file is currently downloading from the source URL."
   },
   "errors":[

   ],
   "warnings":[

   ],
   "process":true,
   "fail_on_input_error":true,
   "fail_on_conversion_error":true,
   "conversion":[
      {
         "id":"6541a120-4ebb-4900-93ea-9547d0955cde",
         "target":"flac",
         "category":"audio",
         "options":{
            "channels":"mono",
            "allow_multiple_outputs":true,
            "download_password":null,
            "preset":null,
            "normalize":false,
            "frequency":null,
            "audio_bitdepth":null,
            "start":null,
            "end":null
         },
         "metadata":{

         },
         "output_target":[

         ]
      },
      {
         "id":"ddf0c7eb-d068-40b6-a2dc-9ac476d07c6a",
         "target":"mp3",
         "category":"audio",
         "options":{
            "channels":"mono",
            "allow_multiple_outputs":true,
            "frequency":null,
            "audio_bitrate":null,
            "audio_vbr":null,
            "download_password":null,
            "preset":null,
            "normalize":false,
            "start":null,
            "end":null
         },
         "metadata":{

         },
         "output_target":[

         ]
      }
   ],
   "input":[
      {
         "id":"277c809e-cc27-47e3-a3d6-28b820bbb44e",
         "type":"remote",
         "source":"https://drive.google.com/uc?export=download&id=2je",
         "filename":"",
         "size":0,
         "hash":"",
         "checksum":"",
         "content_type":"",
         "created_at":"2018-11-12T01:56:52",
         "modified_at":"2018-11-12T01:56:52",
         "parameters":[

         ],
         "metadata":{

         }
      },
      {
         "id":"2630d26f-9373-4e94-8cb4-59b1be22a8ce",
         "type":"remote",
         "source":"https://drive.google.com/uc?export=download&id=Cy2",
         "filename":"",
         "size":0,
         "hash":"",
         "checksum":"",
         "content_type":"",
         "created_at":"2018-11-12T01:56:52",
         "modified_at":"2018-11-12T01:56:52",
         "parameters":[

         ],
         "metadata":{

         }
      }
   ],
   "output":[

   ],
   "callback":"",
   "notify_status":false,
   "server":"https://www14.OC.com/dl/web2",
   "spent":0,
   "created_at":"2018-11-12T01:56:52",
   "modified_at":"2018-11-12T01:56:52"
}
*/

/* polling_occ_work()
{
   "id":"e9d33e36-42ab-40e7-83f5-0a580acdd4e9",
   "token":"77073fc5d40e26398624a44e5b8ccf97",
   "type":"job",
   "status":{
      "code":"completed",
      "info":"The file has been successfully converted."
   },
   "errors":[

   ],
   "warnings":[

   ],
   "process":true,
   "fail_on_input_error":true,
   "fail_on_conversion_error":true,
   "conversion":[
      {
         "id":"79bff532-94c9-429f-839a-d53c64556657",
         "target":"flac",
         "category":"audio",
         "options":{
            "channels":"mono",
            "allow_multiple_outputs":true,
            "download_password":null,
            "preset":null,
            "normalize":false,
            "frequency":null,
            "audio_bitdepth":null,
            "start":null,
            "end":null
         },
         "metadata":{

         },
         "output_target":[

         ]
      },
      {
         "id":"cbfdecbe-d2c7-4ddb-a7b4-b7693082a298",
         "target":"mp3",
         "category":"audio",
         "options":{
            "channels":"mono",
            "allow_multiple_outputs":true,
            "frequency":null,
            "audio_bitrate":null,
            "audio_vbr":null,
            "download_password":null,
            "preset":null,
            "normalize":false,
            "start":null,
            "end":null
         },
         "metadata":{

         },
         "output_target":[

         ]
      }
   ],
   "input":[
      {
         "id":"21a28ce3-21e8-4339-a857-a4ee87f9c74f",
         "type":"remote",
         "source":"https://drive.google.com/uc?export=download&id=2je",
         "filename":"20181111_0830_0594.WMA",
         "size":15944,
         "hash":"051fa47181063fd1aaab1dbef2c137a4",
         "checksum":"051fa47181063fd1aaab1dbef2c137a4",
         "content_type":"audio/x-ms-wma",
         "created_at":"2018-11-12T01:52:46",
         "modified_at":"2018-11-12T01:52:47",
         "parameters":[

         ],
         "metadata":{

         }
      },
      {
         "id":"91917cb2-d097-4fe5-bc20-ca67d435a9f2",
         "type":"remote",
         "source":"https://drive.google.com/uc?export=download&id=Cy2",
         "filename":"20181111_0848_0597.WMA",
         "size":24436,
         "hash":"2e13475a04e340d0b7dcecc48c25c670",
         "checksum":"2e13475a04e340d0b7dcecc48c25c670",
         "content_type":"audio/x-ms-wma",
         "created_at":"2018-11-12T01:52:46",
         "modified_at":"2018-11-12T01:52:47",
         "parameters":[

         ],
         "metadata":{

         }
      }
   ],
   "output":[
      {
         "id":"eea9c56a-77c7-4b4c-a305-299401c906e7",
         "source":{
            "conversion":"79bff532-94c9-429f-839a-d53c64556657",
            "input":[
               "21a28ce3-21e8-4339-a857-a4ee87f9c74f"
            ]
         },
         "uri":"https://www7.OC.com/dl/web2/download-file/eea9c56a-77c7-4b4c-a305-299401c906e7/20181111_0830_0594.flac",
         "size":279123,
         "status":"enabled",
         "content_type":"audio/flac",
         "downloads_counter":0,
         "checksum":"eec70c1eae60d497e160a28be8939d4a",
         "created_at":"2018-11-12T01:52:48"
      },
      {
         "id":"c32708dc-a205-4ba2-a4fd-43a7f2b2f9da",
         "source":{
            "conversion":"79bff532-94c9-429f-839a-d53c64556657",
            "input":[
               "91917cb2-d097-4fe5-bc20-ca67d435a9f2"
            ]
         },
         "uri":"https://www7.OC.com/dl/web2/download-file/c32708dc-a205-4ba2-a4fd-43a7f2b2f9da/20181111_0848_0597.flac",
         "size":535449,
         "status":"enabled",
         "content_type":"audio/flac",
         "downloads_counter":0,
         "checksum":"5e5e5949fca572a6d6a2b230d942dcf5",
         "created_at":"2018-11-12T01:52:48"
      },
      {
         "id":"c8e6b30b-a94f-4d16-ad95-901c4e1ef303",
         "source":{
            "conversion":"cbfdecbe-d2c7-4ddb-a7b4-b7693082a298",
            "input":[
               "21a28ce3-21e8-4339-a857-a4ee87f9c74f"
            ]
         },
         "uri":"https://www7.OC.com/dl/web2/download-file/c8e6b30b-a94f-4d16-ad95-901c4e1ef303/20181111_0830_0594.mp3",
         "size":21674,
         "status":"enabled",
         "content_type":"audio/mp3",
         "downloads_counter":0,
         "checksum":"343e0e273fbb139b996c245d269a0a9c",
         "created_at":"2018-11-12T01:52:48"
      },
      {
         "id":"5d7af7d6-7930-486e-9327-dbadff5e01bc",
         "source":{
            "conversion":"cbfdecbe-d2c7-4ddb-a7b4-b7693082a298",
            "input":[
               "91917cb2-d097-4fe5-bc20-ca67d435a9f2"
            ]
         },
         "uri":"https://www7.OC.com/dl/web2/download-file/5d7af7d6-7930-486e-9327-dbadff5e01bc/20181111_0848_0597.mp3",
         "size":39542,
         "status":"enabled",
         "content_type":"audio/mp3",
         "downloads_counter":0,
         "checksum":"5145bc0ceae15c9ae4fcf5b36c147df8",
         "created_at":"2018-11-12T01:52:48"
      }
   ],
   "callback":"",
   "notify_status":false,
   "server":"https://www7.OC.com/dl/web2",
   "spent":2,
   "created_at":"2018-11-12T01:52:46",
   "modified_at":"2018-11-12T01:52:48"
}
*/