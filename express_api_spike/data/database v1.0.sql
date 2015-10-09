-- MySQL dump 10.13  Distrib 5.5.44, for debian-linux-gnu (x86_64)
--
-- Host: localhost    Database: Bad
-- ------------------------------------------------------
-- Server version	5.5.44-0ubuntu0.14.04.1

/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;
/*!40103 SET @OLD_TIME_ZONE=@@TIME_ZONE */;
/*!40103 SET TIME_ZONE='+00:00' */;
/*!40014 SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0 */;
/*!40014 SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0 */;
/*!40101 SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='NO_AUTO_VALUE_ON_ZERO' */;
/*!40111 SET @OLD_SQL_NOTES=@@SQL_NOTES, SQL_NOTES=0 */;

--
-- Current Database: `Bad`
--

CREATE DATABASE /*!32312 IF NOT EXISTS*/ `Bad` /*!40100 DEFAULT CHARACTER SET latin1 */;

USE `Bad`;

--
-- Table structure for table `Centres`
--

DROP TABLE IF EXISTS `Centres`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Centres` (
  `centre_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` varchar(75) NOT NULL,
  `full_capacity` int(10) unsigned zerofill NOT NULL,
  `male_capacity` int(10) unsigned zerofill NOT NULL,
  `female_capacity` int(10) unsigned zerofill NOT NULL,
  `current_male_beds` int(10) unsigned zerofill NOT NULL,
  `current_female_beds` int(10) unsigned zerofill NOT NULL,
  `ooc_male_beds` int(10) unsigned zerofill NOT NULL,
  `ooc_female_beds` int(10) unsigned zerofill NOT NULL,
  `daily_cap` int(10) unsigned zerofill NOT NULL,
  `unisex` tinyint(1) DEFAULT NULL,
  `reservable` tinyint(1) DEFAULT NULL,
  `fast_track` tinyint(1) DEFAULT NULL,
  PRIMARY KEY (`centre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Centres`
--

LOCK TABLES `Centres` WRITE;
/*!40000 ALTER TABLE `Centres` DISABLE KEYS */;
INSERT INTO `Centres` VALUES (1,'Heathrow',0000000300,0000000180,0000000120,0000000040,0000000035,0000000004,0000000003,0000000025,1,0,1),(2,'Colnbrook',0000000155,0000000100,0000000055,0000000020,0000000040,0000000006,0000000007,0000000025,1,0,1),(3,'Harmondsworth',0000000300,0000000180,0000000120,0000000040,0000000035,0000000001,0000000006,0000000025,1,0,1);
/*!40000 ALTER TABLE `Centres` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Metadata`
--

DROP TABLE IF EXISTS `Metadata`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Metadata` (
  `meta_data_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Centres_centre_id` int(10) unsigned NOT NULL,
  `operation` tinyint(3) unsigned DEFAULT NULL,
  `JSON` blob,
  `status_code` int(10) unsigned DEFAULT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  PRIMARY KEY (`meta_data_id`),
  KEY `Metadata_FKIndex1` (`Centres_centre_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Metadata`
--

LOCK TABLES `Metadata` WRITE;
/*!40000 ALTER TABLE `Metadata` DISABLE KEYS */;
/*!40000 ALTER TABLE `Metadata` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Nationalities`
--

DROP TABLE IF EXISTS `Nationalities`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Nationalities` (
  `nationality_id` varchar(3) NOT NULL,
  `name` varchar(75) DEFAULT NULL,
  `valid_from` date DEFAULT NULL,
  `valid_to` date DEFAULT NULL,
  `replaced_by` varchar(3) DEFAULT NULL,
  `also_included` varchar(50) DEFAULT NULL,
  `notes` varchar(255) DEFAULT NULL,
  PRIMARY KEY (`nationality_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Nationalities`
--

LOCK TABLES `Nationalities` WRITE;
/*!40000 ALTER TABLE `Nationalities` DISABLE KEYS */;
INSERT INTO `Nationalities` VALUES ('AFG','Afghanistan',NULL,NULL,'','',''),('AFI',' French Afar and Issas',NULL,'0000-00-00',' DJ',' ',' '),('AGO',' Angola',NULL,NULL,' ',' ',' '),('AIA',' Anguilla','0000-00-00',NULL,' ',' ',' '),('ALB',' Albania',NULL,NULL,' ',' ',' '),('AND',' Andorra',NULL,NULL,' ',' ',' '),('ANT',' Netherlands Antilles',NULL,'0000-00-00',' NE',' ',' '),('ARE',' United Arab Emirates',NULL,NULL,' ',' ',' '),('ARG',' Argentina',NULL,NULL,' ',' ',' '),('ARM',' Armenia','0000-00-00',NULL,' ',' ',' '),('ATF',' French Southern Territories','0000-00-00',NULL,' ',' ',' '),('ATG',' Antigua and Barbuda',NULL,NULL,' ',' ',' '),('AUS',' Australia',NULL,NULL,' ','Christmas Island, Cocos (Keeling) Islands, Norfolk',' '),('AUT',' Austria',NULL,NULL,' ',' ',' '),('AZE',' Azerbaijan','0000-00-00',NULL,' ',' ',' '),('BDI',' Burundi',NULL,NULL,' ',' ',' '),('BEL',' Belgium',NULL,NULL,' ',' ',' '),('BEN',' Benin','0000-00-00',NULL,' ',' ',' '),('BFA',' Burkina Faso','0000-00-00',NULL,' ',' ',' '),('BGD',' Bangladesh',NULL,NULL,' ',' ',' '),('BGR',' Bulgaria',NULL,NULL,' ',' ',' '),('BHR',' Bahrain',NULL,NULL,' ',' ',' '),('BHS',' Bahamas',NULL,NULL,' ',' ',' '),('BIH',' Bosnia and Herzegovina','0000-00-00',NULL,' ',' ',' '),('BLR',' Belarus','0000-00-00',NULL,' ',' ',' '),('BLZ',' Belize',NULL,NULL,' ',' ',' '),('BMU',' Bermuda',NULL,NULL,' ',' ',' '),('BOL',' Bolivia',NULL,NULL,' ',' ',' '),('BRA',' Brazil',NULL,NULL,' ',' ',' '),('BRB',' Barbados',NULL,NULL,' ',' ',' '),('BRN',' Brunei Darussalam',NULL,NULL,' ',' ',' '),('BTN',' Bhutan',NULL,NULL,' ',' ',' '),('BUR',' Burma',NULL,'0000-00-00',' MM',' ',' '),('BWA',' Botswana',NULL,NULL,' ',' ',' '),('BYS',' Byelorussian SSR',NULL,'0000-00-00',' BL',' ',' '),('CAF',' Central African Republic',NULL,NULL,' ',' ',' '),('CAN',' Canada',NULL,NULL,' ',' ',' '),('CHE',' Switzerland',NULL,NULL,' ',' ',' '),('CHL',' Chile',NULL,NULL,' ',' ',' '),('CHN',' China',NULL,NULL,' ',' ',' '),('CMR',' Cameroon',NULL,NULL,' ',' ',' '),('COD',' Congo, Democratic Republic of the','0000-00-00',NULL,' ',' ',' '),('COG',' Congo',NULL,NULL,' ',' ',' '),('COL',' Colombia',NULL,NULL,' ',' ',' '),('COM',' Comoros',NULL,NULL,' ',' ',' '),('CPV',' Cape Verde',NULL,NULL,' ',' ',' '),('CRI',' Costa Rica',NULL,NULL,' ',' ',' '),('CSK',' Czechoslovakia',NULL,'0000-00-00',' CZ',' ',' '),('CTE',' Canton and Enderbury Islands',NULL,'0000-00-00',' KI',' ',' '),('CUB',' Cuba',NULL,NULL,' ',' ',' '),('CYM',' Cayman Islands',NULL,NULL,' ',' ',' '),('CYP',' Cyprus',NULL,NULL,' ',' ',' '),('CZE',' Czech Republic','0000-00-00',NULL,' ',' ',' '),('DDR',' German Democratic Republic',NULL,'0000-00-00',' DE',' ',' '),('DEU',' Germany',NULL,NULL,' ',' ',' '),('DHY',' Dahomey',NULL,'0000-00-00',' BE',' ',' '),('DJI',' Djibouti','0000-00-00',NULL,' ',' ',' '),('DMA',' Dominica',NULL,NULL,' ',' ',' '),('DNK',' Denmark',NULL,NULL,' ','Faroe Islands,   Greenland ',' '),('DOM',' Dominican Republic',NULL,NULL,' ',' ',' '),('DZA',' Algeria',NULL,NULL,' ',' ',' '),('ECU',' Ecuador',NULL,NULL,' ',' ',' '),('EGY',' Egypt',NULL,NULL,' ',' ',' '),('ERI',' Eritrea','0000-00-00',NULL,' ',' ',' '),('ESH',' Western Sahara',NULL,NULL,' ',' ',' '),('ESP',' Spain',NULL,NULL,' ',' ',' '),('EST',' Estonia','0000-00-00',NULL,' ',' ',' '),('ETH',' Ethiopia',NULL,NULL,' ',' ',' '),('FIN',' Finland',NULL,NULL,' ','Aland Islands ',' '),('FJI',' Fiji',NULL,NULL,' ',' ',' '),('FRA',' France',NULL,NULL,' ','France Metropolitan,  French Guiana,   French Poly',' '),('FSM',' Micronesia (Federated States of)','0000-00-00',NULL,' ',' ',' '),('FXX',' France, Metropolitan','0000-00-00','0000-00-00',' FR',' ',' '),('GAB',' Gabon',NULL,NULL,' ',' ',' '),('GBD',' British Overseas Territories Citizenship (BOTC)',NULL,NULL,' ',' ',' '),('GBN',' British National (Overseas)',NULL,NULL,' ','Anguilla,  Bermuda,  Falkland Islands, Montserrat,',' '),('GBO',' British Overseas Citizen',NULL,NULL,' ',' ',' '),('GBP',' British Protected Person',NULL,NULL,' ',' ',' '),('GBR',' British Citizen',NULL,NULL,' ',' ',' '),('GBS',' British Subject',NULL,NULL,' ',' ',' '),('GEL',' Gilbert and Ellice Islands',NULL,'0000-00-00',' KI',' ',' '),('GEO',' Georgia','0000-00-00',NULL,' ',' ',' '),('GHA',' Ghana',NULL,NULL,' ',' ',' '),('GIB',' Gibraltar',NULL,NULL,' ',' ',' '),('GIN',' Guinea',NULL,NULL,' ',' ',' '),('GMB',' Gambia',NULL,NULL,' ',' ',' '),('GNB',' Guinea-Bissau',NULL,NULL,' ',' ',' '),('GNQ',' Equatorial Guinea',NULL,NULL,' ',' ',' '),('GRC',' Greece',NULL,NULL,' ',' ',' '),('GRD',' Grenada',NULL,NULL,' ',' ',' '),('GRL',' Greenland',NULL,NULL,' ',' ',' '),('GTM',' Guatemala',NULL,NULL,' ',' ',' '),('GUF',' French Guiana',NULL,NULL,' ',' ',' '),('GUY',' Guyana',NULL,NULL,' ',' ',' '),('HKG',' Hong Kong Special Administrative Region of China',NULL,NULL,' ',' ',' '),('HND',' Honduras',NULL,NULL,' ',' ',' '),('HRV',' Croatia','0000-00-00',NULL,' ',' ',' '),('HTI',' Haiti',NULL,NULL,' ',' ',' '),('HUN',' Hungary',NULL,NULL,' ',' ',' '),('HVO',' Upper Volta',NULL,'0000-00-00',' BF',' ',' '),('IDN',' Indonesia',NULL,NULL,' ',' ',' '),('IND',' India',NULL,NULL,' ',' ',' '),('IRL',' Ireland',NULL,NULL,' ',' ',' '),('IRN',' Iran',NULL,NULL,' ',' ',' Changed description to Iran (16/9/2014) removing \", Islamic Republic of\" to align with FCO policy'),('IRQ',' Iraq',NULL,NULL,' ',' ',' '),('ISL',' Iceland',NULL,NULL,' ',' ',' '),('ISR',' Israel',NULL,NULL,' ',' ',' '),('ITA',' Italy',NULL,NULL,' ',' ',' '),('JAM',' Jamaica','0000-00-00',NULL,' ',' ',' '),('JOR',' Jordan',NULL,NULL,' ',' ',' '),('JPN',' Japan',NULL,NULL,' ',' ',' '),('KAZ',' Kazakhstan','0000-00-00',NULL,' ',' ',' '),('KEN',' Kenya',NULL,NULL,' ',' ',' '),('KGZ',' Kyrgyzstan','0000-00-00',NULL,' ',' ',' '),('KHM',' Cambodia',NULL,NULL,' ',' ',' '),('KIR',' Kiribati','0000-00-00',NULL,' ',' ',' '),('KNA',' Saint Kitts and Nevis',NULL,NULL,' ',' ',' '),('KOR',' Korea, South (Republic of Korea)',NULL,NULL,' ',' ',' '),('KWT',' Kuwait',NULL,NULL,' ',' ',' '),('LAO',' Laos',NULL,NULL,' ',' ',' Updated Lao People Democratic Republic to Laos to align with FCO policy'),('LBN',' Lebanon',NULL,NULL,' ',' ',' '),('LBR',' Liberia',NULL,NULL,' ',' ',' '),('LBY',' Libya',NULL,NULL,' ',' ',' '),('LCA',' Saint Lucia',NULL,NULL,' ',' ',' '),('LIE',' Liechtenstein',NULL,NULL,' ',' ',' '),('LKA',' Sri Lanka',NULL,NULL,' ',' ',' '),('LSO',' Lesotho',NULL,NULL,' ',' ',' '),('LTU',' Lithuania','0000-00-00',NULL,' ',' ',' '),('LUX',' Luxembourg',NULL,NULL,' ',' ',' '),('LVA',' Latvia','0000-00-00',NULL,' ',' ',' '),('MAC',' Macao',NULL,NULL,' ',' ',' '),('MAR',' Morocco',NULL,NULL,' ',' ',' '),('MCO',' Monaco',NULL,NULL,' ',' ',' '),('MDA',' Moldova, Republic of','0000-00-00',NULL,' ',' ',' '),('MDG',' Madagascar',NULL,NULL,' ',' ',' '),('MDV',' Maldives',NULL,NULL,' ',' ',' '),('MEX',' Mexico',NULL,NULL,' ',' ',' '),('MHL',' Marshall Islands','0000-00-00',NULL,' ',' ',' '),('MKD',' Macedonia, The Former Yugoslav Republic Of','0000-00-00',NULL,' ',' ',' '),('MLI',' Mali',NULL,NULL,' ',' ',' '),('MLT',' Malta',NULL,NULL,' ',' ',' '),('MMR',' Burma(Myanmar)','0000-00-00',NULL,' ',' ',' Burma (Myanmar)'),('MNE',' Montenegro','0000-00-00',NULL,' ',' ',' '),('MNG',' Mongolia',NULL,NULL,' ',' ',' '),('MOZ',' Mozambique',NULL,NULL,' ',' ',' '),('MRT',' Mauritania',NULL,NULL,' ',' ',' '),('MSR',' Montserrat',NULL,NULL,' ',' ',' '),('MUS',' Mauritius',NULL,NULL,' ',' ',' '),('MWI',' Malawi',NULL,NULL,' ',' ',' '),('MYS',' Malaysia',NULL,NULL,' ',' ',' '),('NAM',' Namibia',NULL,NULL,' ',' ',' '),('NER',' Niger',NULL,NULL,' ',' ',' '),('NGA',' Nigeria',NULL,NULL,' ',' ',' '),('NHB',' New Hebrides',NULL,'0000-00-00',' VU',' ',' '),('NIC',' Nicaragua',NULL,NULL,' ',' ',' '),('NIU',' Niue',NULL,NULL,' ',' ',' '),('NLD',' Netherlands',NULL,NULL,' ','Aruba,   Bonaire, Sint Eustatius and Saba,  Sint M',' '),('NOR',' Norway',NULL,NULL,' ','Svalbard and Jan Mayen Islands ',' '),('NPL',' Nepal',NULL,NULL,' ',' ',' '),('NRU',' Nauru',NULL,NULL,' ',' ',' '),('NTZ',' Neutral Zone',NULL,'0000-00-00',' SA',' ',' '),('NZL',' New Zealand',NULL,NULL,' ','Cook Islands,  Niue,   Tokelau ',' '),('OMN',' Oman',NULL,NULL,' ',' ',' '),('PAK',' Pakistan',NULL,NULL,' ',' ',' '),('PAN',' Panama',NULL,NULL,' ',' ',' '),('PCI',' Pacific Islands, Trust Territory of the',NULL,'0000-00-00',' FS',' ',' '),('PCN',' Pitcairn',NULL,NULL,' ',' ',' '),('PCZ',' Panama Canal Zone',NULL,'0000-00-00',' PA',' ',' '),('PER',' Peru',NULL,NULL,' ',' ',' '),('PHL',' Philippines',NULL,NULL,' ',' ',' '),('PLW',' Palau','0000-00-00',NULL,' ',' ',' '),('PNG',' Papua New Guinea',NULL,NULL,' ',' ',' '),('POL',' Poland',NULL,NULL,' ',' ',' '),('PRK',' Korea, North (Democratic Korea)',NULL,NULL,' ',' ',' '),('PRT',' Portugal',NULL,NULL,' ',' ',' '),('PRY',' Paraguay',NULL,NULL,' ',' ',' '),('PSE',' Palestinian Territory Occupied','0000-00-00',NULL,' ',' ',' '),('PUS',' U.S. Miscellaneous Pacific Islands',NULL,'0000-00-00',' UM',' ',' '),('QAT',' Qatar',NULL,NULL,' ',' ',' '),('RHO',' Southern Rhodesia',NULL,'0000-00-00',' ZW',' ',' '),('ROU',' Romania',NULL,NULL,' ',' ',' '),('RUS',' Russian Federation','0000-00-00',NULL,' ',' ',' '),('RWA',' Rwanda',NULL,NULL,' ',' ',' '),('SAU',' Saudi Arabia',NULL,NULL,' ',' ',' '),('SCG',' Serbia and Montenegro','0000-00-00','0000-00-00',' SR',' ',' '),('SDN',' Sudan',NULL,NULL,' ',' ',' '),('SEN',' Senegal',NULL,NULL,' ',' ',' '),('SGP',' Singapore',NULL,NULL,' ',' ',' '),('SKM',' Sikkim',NULL,'0000-00-00',' IN',' ',' '),('SLB',' Solomon Islands',NULL,NULL,' ',' ',' '),('SLE',' Sierra Leone',NULL,NULL,' ',' ',' '),('SLV',' El Salvador',NULL,NULL,' ',' ',' '),('SMR',' San Marino',NULL,NULL,' ',' ',' '),('SOM',' Somalia',NULL,NULL,' ',' ',' '),('SRB',' Serbia','0000-00-00',NULL,' ',' ',' '),('SSD',' South Sudan','0000-00-00',NULL,' ',' ',' '),('STP',' Sao Tome and Principe',NULL,NULL,' ',' ',' '),('SUN',' USSR','0000-00-00','0000-00-00',' RU',' ',' '),('SUR',' Suriname',NULL,NULL,' ',' ',' '),('SVK',' Slovakia','0000-00-00',NULL,' ',' ',' '),('SVN',' Slovenia','0000-00-00',NULL,' ',' ',' '),('SWE',' Sweden',NULL,NULL,' ',' ',' '),('SWZ',' Swaziland',NULL,NULL,' ',' ',' '),('SYC',' Seychelles',NULL,NULL,' ',' ',' '),('SYR',' Syria',NULL,NULL,' ',' ',' Updated \"Syria Arab Republic\" to \"Syria\" to align with FCO policy'),('TCA',' Turks and Caicos Islands',NULL,NULL,' ',' ',' '),('TCD',' Chad',NULL,NULL,' ',' ',' '),('TGO',' Togo',NULL,NULL,' ',' ',' '),('THA',' Thailand',NULL,NULL,' ',' ',' '),('TJK',' Tajikistan','0000-00-00',NULL,' ',' ',' '),('TKM',' Turkmenistan','0000-00-00',NULL,' ',' ',' '),('TLS',' Timor-Leste','0000-00-00',NULL,' ','East Timor ',' East Timor (Timor-Leste)'),('TMP',' East Timor',NULL,'0000-00-00',' TL',' ',' '),('TON',' Tonga',NULL,NULL,' ',' ',' '),('TTO',' Trinidad and Tobago',NULL,NULL,' ',' ',' '),('TUN',' Tunisia',NULL,NULL,' ',' ',' '),('TUR',' Turkey',NULL,NULL,' ',' ',' '),('TUV',' Tuvalu','0000-00-00',NULL,' ',' ',' '),('TWN',' Taiwan',NULL,NULL,' ',' ',' '),('TZA',' Tanzania',NULL,NULL,' ',' ',' Updated \"Tanzania, United Republic of\" to \"Tanzania\" to align with FCO policy'),('UGA',' Uganda',NULL,NULL,' ',' ',' '),('UKR',' Ukraine',NULL,NULL,' ',' ',' '),('UNA',' United Nations Agency',NULL,NULL,' ',' ',' '),('UNK',' Kosovo (UN travel document)',NULL,'0000-00-00',' XX',' ',' '),('UNO',' United Nations',NULL,NULL,' ',' ',' '),('URY',' Uruguay',NULL,NULL,' ',' ',' '),('USA',' United States of America',NULL,NULL,' ','American Samoa, Guam,   Virgin Islands, U.S.,   Un',' '),('UZB',' Uzbekistan','0000-00-00',NULL,' ',' ',' '),('VAT',' Holy See (Vatican City State)',NULL,NULL,' ',' ',' '),('VCT',' Saint Vincent and the Grenadines',NULL,NULL,' ',' ',' '),('VDR',' Viet-Nam, Democratic Republic of',NULL,'0000-00-00',' VN',' ',' '),('VEN',' Venezuela',NULL,NULL,' ',' ',' '),('VNM',' Vietnam',NULL,NULL,' ',' ',' '),('VUT',' Vanuatu','0000-00-00',NULL,' ',' ',' '),('WSM',' Samoa',NULL,NULL,' ',' ',' '),('XXA',' Stateless Person (Article 1 of 1954 Convention)',NULL,NULL,' ',' ',' '),('XXB',' Refugee - Article 1 of the 1951 Convention',NULL,NULL,' ',' ',' '),('XXC',' Refugee - Other',NULL,NULL,' ',' ',' '),('XXK',' Kosovo',NULL,NULL,' ',' ',' '),('XXT',' Cyprus, northern',NULL,NULL,' ',' ',' '),('XXX',' Unspecified Nationality',NULL,NULL,' ',' ',' Same as ZZZ'),('XYZ',' Officially Stateless',NULL,NULL,' ',' ',' Not ICAO compliant'),('YEM',' Yemen',NULL,NULL,' ',' ',' '),('YMD',' Yemen, Democratic',NULL,'0000-00-00',' YE',' ',' '),('YUG',' Yugoslavia',NULL,'0000-00-00',' SC',' ',' '),('ZAF',' South Africa',NULL,NULL,' ',' ',' '),('ZAR',' Zaire',NULL,'0000-00-00',' CO',' ',' '),('ZMB',' Zambia',NULL,NULL,' ',' ',' '),('ZWE',' Zimbabwe','0000-00-00',NULL,' ',' ',' '),('ZZZ',' Nationality Currently Unknown',NULL,NULL,' ',' ',' Same as XXX');
/*!40000 ALTER TABLE `Nationalities` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Out_of_Commissions`
--

DROP TABLE IF EXISTS `Out_of_Commissions`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Out_of_Commissions` (
  `ooc_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Centres_centre_id` int(10) unsigned NOT NULL,
  `time` time DEFAULT NULL,
  `date` date DEFAULT NULL,
  `ref` int(11) DEFAULT NULL,
  `gender` tinyint(3) unsigned DEFAULT NULL,
  `operation` tinyint(3) unsigned DEFAULT NULL,
  `reason` varchar(75) DEFAULT NULL,
  PRIMARY KEY (`ooc_id`),
  KEY `Out_of_Commissions_FKIndex1` (`Centres_centre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=4 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Out_of_Commissions`
--

LOCK TABLES `Out_of_Commissions` WRITE;
/*!40000 ALTER TABLE `Out_of_Commissions` DISABLE KEYS */;
INSERT INTO `Out_of_Commissions` VALUES (1,1,'15:33:49','2015-09-15',0,1,3,'Bed Bugs'),(2,3,'15:34:35','2015-09-15',0,2,3,'Broken'),(3,2,'15:35:16','2015-09-15',0,1,3,'Fire');
/*!40000 ALTER TABLE `Out_of_Commissions` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Persons`
--

DROP TABLE IF EXISTS `Persons`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Persons` (
  `cid_id` bigint(20) NOT NULL,
  `Nationalities_nationality_id` varchar(3) NOT NULL,
  `Centres_centre_id` int(10) unsigned NOT NULL,
  `gender` tinyint(3) unsigned DEFAULT NULL,
  PRIMARY KEY (`cid_id`),
  KEY `Persons_FKIndex1` (`Centres_centre_id`),
  KEY `Persons_FKIndex2` (`Nationalities_nationality_id`)
) ENGINE=InnoDB DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Persons`
--

LOCK TABLES `Persons` WRITE;
/*!40000 ALTER TABLE `Persons` DISABLE KEYS */;
INSERT INTO `Persons` VALUES (123456,'AFG',1,1),(234562,'XYZ',3,2),(789101,'US',2,1),(2834221,'XXX',1,2),(2898765,'ENG',2,1);
/*!40000 ALTER TABLE `Persons` ENABLE KEYS */;
UNLOCK TABLES;

--
-- Table structure for table `Transfers`
--

DROP TABLE IF EXISTS `Transfers`;
/*!40101 SET @saved_cs_client     = @@character_set_client */;
/*!40101 SET character_set_client = utf8 */;
CREATE TABLE `Transfers` (
  `transfer_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `Centres_centre_id` int(10) unsigned NOT NULL,
  `Persons_cid_id` bigint(20) NOT NULL,
  `date` date DEFAULT NULL,
  `time` time DEFAULT NULL,
  `operation` tinyint(3) unsigned NOT NULL,
  PRIMARY KEY (`transfer_id`),
  KEY `Transfers_FKIndex1` (`Persons_cid_id`),
  KEY `Transfers_FKIndex2` (`Centres_centre_id`)
) ENGINE=InnoDB AUTO_INCREMENT=5 DEFAULT CHARSET=latin1;
/*!40101 SET character_set_client = @saved_cs_client */;

--
-- Dumping data for table `Transfers`
--

LOCK TABLES `Transfers` WRITE;
/*!40000 ALTER TABLE `Transfers` DISABLE KEYS */;
INSERT INTO `Transfers` VALUES (1,1,123456,'2015-09-15','15:24:40',2),(2,2,123456,'2015-09-15','15:25:25',1),(3,2,2898765,'2015-09-15','15:26:49',2),(4,3,2898765,'2015-09-15','15:28:21',1);
/*!40000 ALTER TABLE `Transfers` ENABLE KEYS */;
UNLOCK TABLES;
/*!40103 SET TIME_ZONE=@OLD_TIME_ZONE */;

/*!40101 SET SQL_MODE=@OLD_SQL_MODE */;
/*!40014 SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS */;
/*!40014 SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS */;
/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
/*!40111 SET SQL_NOTES=@OLD_SQL_NOTES */;

-- Dump completed on 2015-09-16  9:28:21
