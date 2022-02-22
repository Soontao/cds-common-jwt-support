namespace bookshop;

using {
  Country,
  managed,
  cuid
} from '@sap/cds/common';


type MetricReponse {

  service : String;
  name    : String;

}


@requires : 'authenticated-user'
@impl     : './impl/IndexService.js'
service IndexService {

  // POST /index/metric HTTP/1.1
  // Host: localhost:4004
  // Content-Type: application/json

  // {
  // }
  action metric(name : String) returns MetricReponse;
  action metricV2(name : String) returns MetricReponse;
  action metricV3(name : String) returns MetricReponse;
  // GET, parameter in URI
  function metric2(name : String) returns MetricReponse;
  action freeAction001() returns MetricReponse;
  action freeAction002() returns MetricReponse;

  function userInfo() returns {
    id  : String;
    roles : array of String;
  }

}
