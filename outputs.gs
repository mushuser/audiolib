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
   "server":"https://www14.online-convert.com/dl/web2",
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
         "uri":"https://www7.online-convert.com/dl/web2/download-file/eea9c56a-77c7-4b4c-a305-299401c906e7/20181111_0830_0594.flac",
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
         "uri":"https://www7.online-convert.com/dl/web2/download-file/c32708dc-a205-4ba2-a4fd-43a7f2b2f9da/20181111_0848_0597.flac",
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
         "uri":"https://www7.online-convert.com/dl/web2/download-file/c8e6b30b-a94f-4d16-ad95-901c4e1ef303/20181111_0830_0594.mp3",
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
         "uri":"https://www7.online-convert.com/dl/web2/download-file/5d7af7d6-7930-486e-9327-dbadff5e01bc/20181111_0848_0597.mp3",
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
   "server":"https://www7.online-convert.com/dl/web2",
   "spent":2,
   "created_at":"2018-11-12T01:52:46",
   "modified_at":"2018-11-12T01:52:48"
}
*/