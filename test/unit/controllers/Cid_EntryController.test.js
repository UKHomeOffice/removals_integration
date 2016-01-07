"use strict";
var jhg = require('../../helpers/JsonHelperGenerator');
var ValidationError = require('../../../api/lib/exceptions/ValidationError');
var controller = require('../../../api/controllers/Irc_EntryController');

var validdummydata = {
  "cDataSet": [{
    "Location": "Becket House Enforcement Office",
    "MO In/MO Out": "Out",
    "MO Ref": "1439034",
    "MO Date": "05/01/2016 09:20:00",
    "CID Person ID": 10382810,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Becket House Enforcement Office",
    "MO In/MO Out": "Out",
    "MO Ref": "1439007",
    "MO Date": "05/01/2016 07:08:00",
    "CID Person ID": 2059806,
    "Current RFO": "CCT"
  }, {
    "Location": "Birmingham Magistrates Court",
    "MO In/MO Out": "In",
    "MO Ref": "1429687",
    "MO Date": "05/01/2016 09:00:00",
    "CID Person ID": 4900011,
    "Current RFO": "CCT"
  }, {
    "Location": "Birmingham Magistrates Court",
    "MO In/MO Out": "In",
    "MO Ref": "1432285",
    "MO Date": "05/01/2016 09:00:00",
    "CID Person ID": 5855906,
    "Current RFO": "CCT"
  }, {
    "Location": "Birmingham Magistrates Court",
    "MO In/MO Out": "Out",
    "MO Ref": "1429688",
    "MO Date": "05/01/2016 09:01:00",
    "CID Person ID": 4900011,
    "Current RFO": "CCT"
  }, {
    "Location": "Birmingham Magistrates Court",
    "MO In/MO Out": "Out",
    "MO Ref": "1432286",
    "MO Date": "05/01/2016 09:01:00",
    "CID Person ID": 5855906,
    "Current RFO": "CCT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437206",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11136336,
    "Current RFO": "TCU"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438087",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8769958,
    "Current RFO": "OPTER"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437308",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 2534592,
    "Current RFO": "CCT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439038",
    "MO Date": "05/01/2016 09:26:00",
    "CID Person ID": 11461498,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438944",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11147337,
    "Current RFO": "CCT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438905",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11455319,
    "Current RFO": "FT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1436304",
    "MO Date": "05/01/2016 07:55:00",
    "CID Person ID": 10631087,
    "Current RFO": ""
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1436728",
    "MO Date": "05/01/2016 11:35:00",
    "CID Person ID": 11132839,
    "Current RFO": "TCU"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1421560",
    "MO Date": "05/01/2016 08:55:00",
    "CID Person ID": 9407828,
    "Current RFO": "CCT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1435521",
    "MO Date": "05/01/2016 11:05:00",
    "CID Person ID": 10516035,
    "Current RFO": "CCT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1436415",
    "MO Date": "05/01/2016 11:35:00",
    "CID Person ID": 11165866,
    "Current RFO": "TCU"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438067",
    "MO Date": "05/01/2016 20:50:00",
    "CID Person ID": 2715928,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438952",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11454432,
    "Current RFO": "FT"
  }, {
    "Location": "Brook House IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1434975",
    "MO Date": "05/01/2016 10:35:00",
    "CID Person ID": 11287447,
    "Current RFO": "CCT"
  }, {
    "Location": "Campsfield IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439032",
    "MO Date": "05/01/2016 08:36:00",
    "CID Person ID": 11461481,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Campsfield IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437845",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 9471612,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Campsfield IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438854",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11437440,
    "Current RFO": "FT"
  }, {
    "Location": "Campsfield IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438933",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 9622294,
    "Current RFO": "FT"
  }, {
    "Location": "Campsfield IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438925",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11454472,
    "Current RFO": "FT"
  }, {
    "Location": "Canterbury Combined Courts",
    "MO In/MO Out": "In",
    "MO Ref": "1438182",
    "MO Date": "05/01/2016 14:00:00",
    "CID Person ID": 10504834,
    "Current RFO": "CCT"
  }, {
    "Location": "Canterbury Combined Courts",
    "MO In/MO Out": "Out",
    "MO Ref": "1438183",
    "MO Date": "05/01/2016 14:01:00",
    "CID Person ID": 10504834,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438894",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 9771935,
    "Current RFO": "FT"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "In",
    "MO Ref": "1435233",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8922106,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "In",
    "MO Ref": "1438354",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 2853183,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "In",
    "MO Ref": "1438814",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11447625,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1439017",
    "MO Date": "05/01/2016 08:31:00",
    "CID Person ID": 11459873,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1438996",
    "MO Date": "05/01/2016 18:00:00",
    "CID Person ID": 11460866,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1439014",
    "MO Date": "05/01/2016 08:22:00",
    "CID Person ID": 11459829,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1439015",
    "MO Date": "05/01/2016 08:26:00",
    "CID Person ID": 11459266,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Colnbrook (Female Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1439016",
    "MO Date": "05/01/2016 08:28:00",
    "CID Person ID": 11459874,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437053",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11093360,
    "Current RFO": "TCU"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437460",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 450465,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439024",
    "MO Date": "05/01/2016 08:44:00",
    "CID Person ID": 11461469,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437226",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 10976012,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1435560",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11132308,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438871",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 649166,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438966",
    "MO Date": "05/01/2016 09:01:00",
    "CID Person ID": 11054376,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439013",
    "MO Date": "05/01/2016 08:21:00",
    "CID Person ID": 7027076,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1436691",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8978777,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1435225",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11099143,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438669",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 9038626,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438998",
    "MO Date": "05/01/2016 15:00:00",
    "CID Person ID": 10342931,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1431023",
    "MO Date": "05/01/2016 06:30:00",
    "CID Person ID": 6343542,
    "Current RFO": ""
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438894",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 9771935,
    "Current RFO": "FT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1439000",
    "MO Date": "05/01/2016 15:00:00",
    "CID Person ID": 11460524,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437156",
    "MO Date": "05/01/2016 10:30:00",
    "CID Person ID": 11171726,
    "Current RFO": "BC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1432340",
    "MO Date": "05/01/2016 17:40:00",
    "CID Person ID": 2066293,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438030",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 10030321,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438429",
    "MO Date": "05/01/2016 22:35:00",
    "CID Person ID": 9993577,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1435095",
    "MO Date": "05/01/2016 19:00:00",
    "CID Person ID": 9252944,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1433267",
    "MO Date": "05/01/2016 22:35:00",
    "CID Person ID": 9008621,
    "Current RFO": "RCCNCFNO"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1435746",
    "MO Date": "05/01/2016 08:15:00",
    "CID Person ID": 10889887,
    "Current RFO": ""
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438965",
    "MO Date": "05/01/2016 09:00:00",
    "CID Person ID": 11054376,
    "Current RFO": "CCT"
  }, {
    "Location": "Colnbrook IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437787",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 11415406,
    "Current RFO": "CCT"
  }, {
    "Location": "Doncaster & Bassetlaw Hospitals Nhs Foundation Tru",
    "MO In/MO Out": "In",
    "MO Ref": "1439040",
    "MO Date": "05/01/2016 09:27:00",
    "CID Person ID": 10520308,
    "Current RFO": "CCT"
  }, {
    "Location": "Dungavel IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437828",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 10155939,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Dungavel IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1439009",
    "MO Date": "05/01/2016 07:31:00",
    "CID Person ID": 343398,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Dungavel IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437090",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 600510,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Eaton House Immigration Service",
    "MO In/MO Out": "Out",
    "MO Ref": "1439024",
    "MO Date": "05/01/2016 08:44:00",
    "CID Person ID": 11461469,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Eaton House Immigration Service",
    "MO In/MO Out": "Out",
    "MO Ref": "1439032",
    "MO Date": "05/01/2016 08:36:00",
    "CID Person ID": 11461481,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Eaton House Immigration Service",
    "MO In/MO Out": "Out",
    "MO Ref": "1439013",
    "MO Date": "05/01/2016 08:21:00",
    "CID Person ID": 7027076,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Gatwick North",
    "MO In/MO Out": "In",
    "MO Ref": "1436304",
    "MO Date": "05/01/2016 07:55:00",
    "CID Person ID": 10631087,
    "Current RFO": ""
  }, {
    "Location": "Gatwick South",
    "MO In/MO Out": "In",
    "MO Ref": "1438996",
    "MO Date": "05/01/2016 18:00:00",
    "CID Person ID": 11460866,
    "Current RFO": "BC"
  }, {
    "Location": "Gatwick South",
    "MO In/MO Out": "In",
    "MO Ref": "1436728",
    "MO Date": "05/01/2016 11:35:00",
    "CID Person ID": 11132839,
    "Current RFO": "TCU"
  }, {
    "Location": "Gatwick South",
    "MO In/MO Out": "In",
    "MO Ref": "1421560",
    "MO Date": "05/01/2016 08:55:00",
    "CID Person ID": 9407828,
    "Current RFO": "CCT"
  }, {
    "Location": "Gatwick South",
    "MO In/MO Out": "In",
    "MO Ref": "1435521",
    "MO Date": "05/01/2016 11:05:00",
    "CID Person ID": 10516035,
    "Current RFO": "CCT"
  }, {
    "Location": "Gatwick South",
    "MO In/MO Out": "In",
    "MO Ref": "1436415",
    "MO Date": "05/01/2016 11:35:00",
    "CID Person ID": 11165866,
    "Current RFO": "TCU"
  }, {
    "Location": "HMP Aylesbury",
    "MO In/MO Out": "Out",
    "MO Ref": "1437308",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 2534592,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Channings Wood",
    "MO In/MO Out": "Out",
    "MO Ref": "1435225",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11099143,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Doncaster",
    "MO In/MO Out": "In",
    "MO Ref": "1438755",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 5071051,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Glen Parva",
    "MO In/MO Out": "In",
    "MO Ref": "1429688",
    "MO Date": "05/01/2016 09:01:00",
    "CID Person ID": 4900011,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Glen Parva",
    "MO In/MO Out": "Out",
    "MO Ref": "1429687",
    "MO Date": "05/01/2016 09:00:00",
    "CID Person ID": 4900011,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Highpoint North",
    "MO In/MO Out": "Out",
    "MO Ref": "1438871",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 649166,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Holloway",
    "MO In/MO Out": "Out",
    "MO Ref": "1437569",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11047984,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Huntercombe and Finnamore",
    "MO In/MO Out": "In",
    "MO Ref": "1432286",
    "MO Date": "05/01/2016 09:01:00",
    "CID Person ID": 5855906,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Huntercombe and Finnamore",
    "MO In/MO Out": "Out",
    "MO Ref": "1432285",
    "MO Date": "05/01/2016 09:00:00",
    "CID Person ID": 5855906,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Huntercombe and Finnamore",
    "MO In/MO Out": "Out",
    "MO Ref": "1438212",
    "MO Date": "05/01/2016 20:50:00",
    "CID Person ID": 10943806,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Huntercombe and Finnamore",
    "MO In/MO Out": "Out",
    "MO Ref": "1436691",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8978777,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Huntercombe and Finnamore",
    "MO In/MO Out": "Out",
    "MO Ref": "1438755",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 5071051,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Leicester",
    "MO In/MO Out": "Out",
    "MO Ref": "1434772",
    "MO Date": "05/01/2016 15:30:00",
    "CID Person ID": 10936191,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Lincoln",
    "MO In/MO Out": "In",
    "MO Ref": "1438862",
    "MO Date": "05/01/2016 08:31:00",
    "CID Person ID": 11214279,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Lincoln",
    "MO In/MO Out": "Out",
    "MO Ref": "1438861",
    "MO Date": "05/01/2016 08:30:00",
    "CID Person ID": 11214279,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Moorland",
    "MO In/MO Out": "Out",
    "MO Ref": "1439040",
    "MO Date": "05/01/2016 09:27:00",
    "CID Person ID": 10520308,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Moorland",
    "MO In/MO Out": "Out",
    "MO Ref": "1435734",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 5461197,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Peterborough",
    "MO In/MO Out": "Out",
    "MO Ref": "1435233",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8922106,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Peterborough",
    "MO In/MO Out": "Out",
    "MO Ref": "1438354",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 2853183,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Risley",
    "MO In/MO Out": "In",
    "MO Ref": "1438669",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 9038626,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Risley",
    "MO In/MO Out": "Out",
    "MO Ref": "1437460",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 450465,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Thameside",
    "MO In/MO Out": "Out",
    "MO Ref": "1438832",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 7859303,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Thameside",
    "MO In/MO Out": "Out",
    "MO Ref": "1437036",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8999320,
    "Current RFO": "CCT"
  }, {
    "Location": "HMP Wandsworth",
    "MO In/MO Out": "Out",
    "MO Ref": "1436050",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 7820503,
    "Current RFO": "CCT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438770",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8855347,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438905",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11455319,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438854",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11437440,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438933",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 9622294,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438639",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 3407723,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438925",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11454472,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "In",
    "MO Ref": "1438952",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11454432,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth (Fast Track)",
    "MO In/MO Out": "Out",
    "MO Ref": "1437876",
    "MO Date": "05/01/2016 21:25:00",
    "CID Person ID": 11277799,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438773",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11447593,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439007",
    "MO Date": "05/01/2016 07:08:00",
    "CID Person ID": 2059806,
    "Current RFO": "CCT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438832",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 7859303,
    "Current RFO": "CCT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1434102",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 10499530,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437036",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8999320,
    "Current RFO": "CCT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1438106",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 4867037,
    "Current RFO": "FT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1436050",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 7820503,
    "Current RFO": "CCT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1434974",
    "MO Date": "05/01/2016 22:35:00",
    "CID Person ID": 3496160,
    "Current RFO": "CCT"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "*",
    "MO Ref": "*",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 6250152,
    "Current RFO": "*"
  }, {
    "Location": "Harmondsworth IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1436093",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 10774388,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN2",
    "MO In/MO Out": "In",
    "MO Ref": "1431023",
    "MO Date": "05/01/2016 06:30:00",
    "CID Person ID": 6343542,
    "Current RFO": ""
  }, {
    "Location": "Heathrow TN2",
    "MO In/MO Out": "In",
    "MO Ref": "1437156",
    "MO Date": "05/01/2016 10:30:00",
    "CID Person ID": 11171726,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN2",
    "MO In/MO Out": "In",
    "MO Ref": "1432340",
    "MO Date": "05/01/2016 17:40:00",
    "CID Person ID": 2066293,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN2",
    "MO In/MO Out": "In",
    "MO Ref": "1435746",
    "MO Date": "05/01/2016 08:15:00",
    "CID Person ID": 10889887,
    "Current RFO": ""
  }, {
    "Location": "Heathrow TN2",
    "MO In/MO Out": "In",
    "MO Ref": "1434975",
    "MO Date": "05/01/2016 10:35:00",
    "CID Person ID": 11287447,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN3",
    "MO In/MO Out": "In",
    "MO Ref": "1434974",
    "MO Date": "05/01/2016 22:35:00",
    "CID Person ID": 3496160,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN3",
    "MO In/MO Out": "In",
    "MO Ref": "1438956",
    "MO Date": "05/01/2016 13:00:00",
    "CID Person ID": 11446926,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN3",
    "MO In/MO Out": "In",
    "MO Ref": "1438429",
    "MO Date": "05/01/2016 22:35:00",
    "CID Person ID": 9993577,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN3",
    "MO In/MO Out": "In",
    "MO Ref": "1433267",
    "MO Date": "05/01/2016 22:35:00",
    "CID Person ID": 9008621,
    "Current RFO": "RCCNCFNO"
  }, {
    "Location": "Heathrow TN3",
    "MO In/MO Out": "In",
    "MO Ref": "1438671",
    "MO Date": "05/01/2016 20:16:00",
    "CID Person ID": 11444261,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN3",
    "MO In/MO Out": "Out",
    "MO Ref": "1438957",
    "MO Date": "05/01/2016 13:01:00",
    "CID Person ID": 11446926,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1437845",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 9471612,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438998",
    "MO Date": "05/01/2016 15:00:00",
    "CID Person ID": 10342931,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1437876",
    "MO Date": "05/01/2016 21:25:00",
    "CID Person ID": 11277799,
    "Current RFO": "FT"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1439000",
    "MO Date": "05/01/2016 15:00:00",
    "CID Person ID": 11460524,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438783",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 11452791,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438030",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 10030321,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1435095",
    "MO Date": "05/01/2016 19:00:00",
    "CID Person ID": 9252944,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1436093",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 10774388,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438781",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 11452790,
    "Current RFO": "BC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438067",
    "MO Date": "05/01/2016 20:50:00",
    "CID Person ID": 2715928,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438212",
    "MO Date": "05/01/2016 20:50:00",
    "CID Person ID": 10943806,
    "Current RFO": "CCT"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438112",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 10994426,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1438114",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 11044514,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Heathrow TN4",
    "MO In/MO Out": "In",
    "MO Ref": "1437787",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 11415406,
    "Current RFO": "CCT"
  }, {
    "Location": "IAC Taylor House",
    "MO In/MO Out": "In",
    "MO Ref": "1438965",
    "MO Date": "05/01/2016 09:00:00",
    "CID Person ID": 11054376,
    "Current RFO": "CCT"
  }, {
    "Location": "IAC Taylor House",
    "MO In/MO Out": "Out",
    "MO Ref": "1438966",
    "MO Date": "05/01/2016 09:01:00",
    "CID Person ID": 11054376,
    "Current RFO": "CCT"
  }, {
    "Location": "LSE LIT 2",
    "MO In/MO Out": "Out",
    "MO Ref": "1439038",
    "MO Date": "05/01/2016 09:26:00",
    "CID Person ID": 11461498,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Lincolnshire County Council",
    "MO In/MO Out": "In",
    "MO Ref": "1438861",
    "MO Date": "05/01/2016 08:30:00",
    "CID Person ID": 11214279,
    "Current RFO": "CCT"
  }, {
    "Location": "Lincolnshire County Council",
    "MO In/MO Out": "Out",
    "MO Ref": "1438862",
    "MO Date": "05/01/2016 08:31:00",
    "CID Person ID": 11214279,
    "Current RFO": "CCT"
  }, {
    "Location": "Luton Airport",
    "MO In/MO Out": "In",
    "MO Ref": "1436462",
    "MO Date": "05/01/2016 23:15:00",
    "CID Person ID": 10101585,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Luton Airport",
    "MO In/MO Out": "In",
    "MO Ref": "1434772",
    "MO Date": "05/01/2016 15:30:00",
    "CID Person ID": 10936191,
    "Current RFO": "CCT"
  }, {
    "Location": "Manchester TN3",
    "MO In/MO Out": "Out",
    "MO Ref": "1439003",
    "MO Date": "05/01/2016 02:26:00",
    "CID Person ID": 11461450,
    "Current RFO": "BC"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1437828",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 10155939,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439022",
    "MO Date": "05/01/2016 08:40:00",
    "CID Person ID": 11153700,
    "Current RFO": "TCU"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1435734",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 5461197,
    "Current RFO": "CCT"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437206",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11136336,
    "Current RFO": "TCU"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437053",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11093360,
    "Current RFO": "TCU"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1436462",
    "MO Date": "05/01/2016 23:15:00",
    "CID Person ID": 10101585,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1434102",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 10499530,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1437226",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 10976012,
    "Current RFO": "CCT"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438944",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11147337,
    "Current RFO": "CCT"
  }, {
    "Location": "Morton Hall IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1435560",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11132308,
    "Current RFO": "CCT"
  }, {
    "Location": "Pennine House",
    "MO In/MO Out": "In",
    "MO Ref": "1437090",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 600510,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Pennine House",
    "MO In/MO Out": "In",
    "MO Ref": "1439003",
    "MO Date": "05/01/2016 02:26:00",
    "CID Person ID": 11461450,
    "Current RFO": "BC"
  }, {
    "Location": "Pennine House",
    "MO In/MO Out": "Out",
    "MO Ref": "1438773",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11447593,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Pennine House",
    "MO In/MO Out": "Out",
    "MO Ref": "1438814",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11447625,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Pennine House",
    "MO In/MO Out": "Out",
    "MO Ref": "1438639",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 3407723,
    "Current RFO": "FT"
  }, {
    "Location": "Stoke - Northern Area Custody Suite",
    "MO In/MO Out": "Out",
    "MO Ref": "1439022",
    "MO Date": "05/01/2016 08:40:00",
    "CID Person ID": 11153700,
    "Current RFO": "TCU"
  }, {
    "Location": "The Verne IRC",
    "MO In/MO Out": "In",
    "MO Ref": "1439034",
    "MO Date": "05/01/2016 09:20:00",
    "CID Person ID": 10382810,
    "Current RFO": "NATREMC"
  }, {
    "Location": "The Verne IRC",
    "MO In/MO Out": "*",
    "MO Ref": "*",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 6250152,
    "Current RFO": "*"
  }, {
    "Location": "The Verne IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438770",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8855347,
    "Current RFO": "FT"
  }, {
    "Location": "The Verne IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438087",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 8769958,
    "Current RFO": "OPTER"
  }, {
    "Location": "The Verne IRC",
    "MO In/MO Out": "Out",
    "MO Ref": "1438106",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 4867037,
    "Current RFO": "FT"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1439017",
    "MO Date": "05/01/2016 08:31:00",
    "CID Person ID": 11459873,
    "Current RFO": "BC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1437569",
    "MO Date": "05/01/2016 00:01:00",
    "CID Person ID": 11047984,
    "Current RFO": "CCT"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1439009",
    "MO Date": "05/01/2016 07:31:00",
    "CID Person ID": 343398,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1439014",
    "MO Date": "05/01/2016 08:22:00",
    "CID Person ID": 11459829,
    "Current RFO": "BC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1438957",
    "MO Date": "05/01/2016 13:01:00",
    "CID Person ID": 11446926,
    "Current RFO": "BC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1438183",
    "MO Date": "05/01/2016 14:01:00",
    "CID Person ID": 10504834,
    "Current RFO": "CCT"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1439030",
    "MO Date": "05/01/2016 08:55:00",
    "CID Person ID": 8884221,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1439015",
    "MO Date": "05/01/2016 08:26:00",
    "CID Person ID": 11459266,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "In",
    "MO Ref": "1439016",
    "MO Date": "05/01/2016 08:28:00",
    "CID Person ID": 11459874,
    "Current RFO": "BC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "Out",
    "MO Ref": "1438956",
    "MO Date": "05/01/2016 13:00:00",
    "CID Person ID": 11446926,
    "Current RFO": "BC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "Out",
    "MO Ref": "1438182",
    "MO Date": "05/01/2016 14:00:00",
    "CID Person ID": 10504834,
    "Current RFO": "CCT"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "Out",
    "MO Ref": "1438112",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 10994426,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "Out",
    "MO Ref": "1438114",
    "MO Date": "05/01/2016 14:50:00",
    "CID Person ID": 11044514,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood",
    "MO In/MO Out": "Out",
    "MO Ref": "1438671",
    "MO Date": "05/01/2016 20:16:00",
    "CID Person ID": 11444261,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood (Family Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1438783",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 11452791,
    "Current RFO": "BC"
  }, {
    "Location": "Yarl's Wood (Family Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1439030",
    "MO Date": "05/01/2016 08:55:00",
    "CID Person ID": 8884221,
    "Current RFO": "NATREMC"
  }, {
    "Location": "Yarl's Wood (Family Unit)",
    "MO In/MO Out": "Out",
    "MO Ref": "1438781",
    "MO Date": "05/01/2016 21:30:00",
    "CID Person ID": 11452790,
    "Current RFO": "BC"
  }, {
    "Location": " ",
    "MO In/MO Out": "",
    "MO Ref": "",
    "MO Date": "",
    "CID Person ID": null,
    "Current RFO": ""
  }]
};

describe.only('INTEGRATION Cid_EntryController', () => {

  describe('Movement', () => {
    it('should accept a valid payload', () =>
        request_auth(sails.hooks.http.app)
          .post('/cid_entry/movement')
          .send(validdummydata)
          .expect(200)
    );
    describe('isolated verbose log level', () => {
      beforeEach(() => {
        sinon.stub(global.sails.log, 'verbose');
      });
      afterEach(() =>
          global.sails.log.verbose.restore()
      );
      it('should reject an invalid payload', () =>
          request_auth(sails.hooks.http.app)
            .post('/cid_entry/movement')
            .send('invalid data')
            .expect(400)
      );
    });
    it('should create new active movements found in the payload');
    it('should mark existing all movements in the payload as active');
    it('should mark existing all movements not in the payload as inactive');
  });


  describe('UNIT Cid_EntryController', () => {
    it('should return the schema for an options request', () =>
        request(sails.hooks.http.app)
          .options('/cid_entry/movement')
          .expect(200)
          .expect((res) => expect(res.body.data).to.eql(CidEntryMovementValidatorService.schema))
    );
    it('should return the movement schema');
    it('should validate movement posts');

  });
});
