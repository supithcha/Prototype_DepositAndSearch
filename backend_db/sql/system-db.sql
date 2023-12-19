--
-- Database: `cashless_train_system`
--
DROP DATABASE IF EXISTS cashless_train_system;
CREATE DATABASE IF NOT EXISTS `cashless_train_system`;
USE `cashless_train_system`;

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `train_schedule` (
    `TRAIN_ID` CHAR(9) PRIMARY KEY,
    `TRAIN_NAME` VARCHAR(40) NOT NULL,
    `DEPART_DATE` varchar(255) NOT NULL,
    `DEPART_TIME` TIME NOT NULL,
    `ARRIVE_TIME` TIME NOT NULL,
    `ORI_STATION` VARCHAR(50) NOT NULL,
    `DEST_STATION` VARCHAR(50) NOT NULL
);

INSERT INTO `train_schedule` (`TRAIN_ID`, `TRAIN_NAME`, `DEPART_DATE`, `DEPART_TIME`, `ARRIVE_TIME`, `ORI_STATION`, `DEST_STATION`) VALUES
    ('TRAIN001', 'Express Train 1', '2023-11-01', '09:00:00', '12:30:00', 'Bangkok', 'Bang Sue'),
    ('TRAIN002', 'Regional Train 5', '2023-11-02', '11:30:00', '15:15:00', 'Bangkok', 'Ban Krut'),
    ('TRAIN003', 'High-Speed Train 3', '2023-11-03', '14:45:00', '19:00:00', 'Bangkok', 'Bang Sapan Yai'),
    ('TRAIN004', 'Local Train 2', '2023-11-04', '08:00:00', '11:45:00', 'Hua Hin', 'Surat Thani'),
    ('TRAIN005', 'Express Train 7', '2023-11-05', '10:15:00', '13:45:00', 'Hua Hin', 'Penang'),
    ('TRAIN006', 'Regional Train 1', '2023-11-06', '13:30:00', '17:00:00', 'Phetchaburi', 'Surat Thani'),
    ('TRAIN007', 'High-Speed Train 2', '2023-11-07', '16:45:00', '21:30:00', 'Surat Thani', 'Koh Samui'),
    ('TRAIN008', 'Local Train 4', '2023-11-08', '07:30:00', '10:45:00', 'Ayutthaya', 'Nong Khai'),
    ('TRAIN009', 'Express Train 5', '2023-11-09', '12:00:00', '16:30:00', 'Bangkok', 'Khon Kaen'),
    ('TRAIN010', 'Regional Train 3', '2023-11-10', '09:45:00', '21:15:00', 'Lop Buri', 'Chiang Mai');
    
-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `user_account` (
    `USER_ID` CHAR(9) PRIMARY KEY,
    `USER_NATIONALID` CHAR(13) NOT NULL,
    `USER_FNAME` VARCHAR(25) NOT NULL,
    `USER_LNAME` VARCHAR(25) NOT NULL,
    `USER_USERNAME` VARCHAR(25) NOT NULL,
    `USER_PW` VARCHAR(10) NOT NULL,
    `USER_EMAIL` VARCHAR(25) NOT NULL,
    `USER_BD` DATE NOT NULL,
    `USER_ADDR` VARCHAR(25) NOT NULL,
    `USER_PHONENUM` CHAR(10) NOT NULL,
    `USER_GENDER` VARCHAR(25) NOT NULL,
    `USER_CREDITCARDNUM` CHAR(16) NOT NULL
);


INSERT INTO `user_account` VALUES
('100000000', '1111111110001', 'Supithcha', 'Jongphoemwatthanaphon', 'pubpub', 'u6488045', 'Pub@gmail.com', '2002-10-03', '111 Suphanburi Thailand', '0886778989', 'FEMALE', '1111222233334444'),
('200000000', '1111111110002', 'Russarin', 'Eaimrittikrai', 'fayfay', 'u6488021', 'Fay@gmail.com', '2001-10-02', '112 Bangkok Thailand', '0886885888', 'FEMALE', '1111222233332222'),
('300000000', '1111111110003', 'Kanita', 'Karunkittikun', 'woonwoon', 'u6488049', 'Woon@gmail.com', '2000-10-03', '113 Chiang Mai Thailand', '0116784564', 'FEMALE', '1111222233333333'),
('400000000', '1111111110004', 'Sasasuang', 'Pattanakitjaroenchai', 'fongfong', 'u6488052', 'Fongnam@gmail.com', '1999-10-04', '114 Chiang Rai Thailand', '0945642134', 'FEMALE', '4444222233334444'),
('500000000', '1111111110005', 'Chaninan', 'Phetpangun', 'sunsun', 'u6488061', 'Sun@gmail.com', '1998-03-07', '115 Lampang Thailand', '0987654389', 'FEMALE', '1111222233335555'),
('600000000', '1111111110006', 'Nisakorn', 'Ngaosri', 'beambeam', 'u6488226', 'Beam@gmail.com', '1997-10-03', '116 Lamphun Thailand', '0806765675', 'FEMALE', '1111222233336666'),
('700000000', '1111111110007', 'Maxim', 'Todd', 'maxmax', 'u6488777', 'Maxin@gmail.com', '1996-09-09', '117 Mae Hong Son Thailand', '0967896544', 'MALE', '1111222233337777'),
('800000000', '1111111110008', 'Lea', 'Conner', 'lealea', 'u6488888', 'Lealea@gmail.com', '1995-10-03', '118 Phayao Thailand', '0812354324', 'MALE', '1111222233338888'),
('900000000', '1111111110009', 'Bradley', 'Moyer', 'bradbrad', 'u6488999', 'Bradley@gmail.com', '1994-08-03', '119 Phrae Thailand', '0987656789', 'MALE', '1111222233339999'),
('110000000', '1111111110010', 'Kenley', 'Archer', 'henleyley', 'u6488000', 'Kenley@gmail.com', '1993-10-31', '10 Uttaradit Thailand', '0876765543', 'FEMALE', '1111222233330000');


-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `virtual_wallet` (
    `WALLET_ID` CHAR(9) PRIMARY KEY,
    `TOTAL_WALLET_BALANCE` DECIMAL(9 , 2 ) NOT NULL,
    `TOTOAL_REWARD_BALANCE` INT NOT NULL,
    `USER_ID` CHAR(9) NOT NULL,
    CONSTRAINT `FK_user_USER_ID` FOREIGN KEY (`USER_ID`)
        REFERENCES `user_account` (`USER_ID`)
);

INSERT INTO `virtual_wallet` VALUES
	('000000001', '0.00', '50','100000000'),
    ('000000002', '55652.00', '80','200000000'),
    ('000000003', '1000.00', '10','300000000'),
    ('000000004', '999990.00', '90','400000000'),
    ('000000005', '0.00', '0','500000000'),
    ('000000006', '200.00', '15','600000000'),
    ('000000007', '46853.00', '17','700000000'),
    ('000000008', '1112.00', '44','800000000'),
    ('000000009', '785.00', '99','900000000'),
    ('000000010', '996.00', '80','110000000');

-- --------------------------------------------------------


CREATE TABLE IF NOT EXISTS `promotion` (
    `PROMO_ID` CHAR(9) PRIMARY KEY,
    `PROMO_NAME` VARCHAR(40) NOT NULL,
    `START_DATE` DATETIME NOT NULL,
    `END_DATE` DATETIME NOT NULL,
    `PROMO_DISCOUNT` DECIMAL(9 , 2 ) NOT NULL
);

INSERT INTO `promotion` (`PROMO_ID`, `PROMO_NAME`, `START_DATE`, `END_DATE`, `PROMO_DISCOUNT`) VALUES
    ('PROMO001', 'Summer Sale', '2023-06-01 00:00:00', '2023-06-30 23:59:59', 20.00),
    ('PROMO002', 'Back to School', '2023-08-15 00:00:00', '2023-09-15 23:59:59', 15.50),
    ('PROMO003', 'Holiday Special', '2023-12-01 00:00:00', '2023-12-31 23:59:59', 30.25),
    ('PROMO004', "Mother's Day", '2023-08-12 00:00:00', '2023-11-26 23:59:59', 10.00),
    ('PROMO005', "Valentine's Day", '2023-02-14 00:00:00', '2023-02-14 23:59:59', 5.00),
    ("PROMO006", "Easter Special", '2023-04-04 00:00:00', '2023-04-04 23:59:59', 10.50),
    ('PROMO007', 'Christmas Sale', '2023-12-24 00:00:00', '2023-12-25 23:59:59', 25.00),
    ('PROMO008', "New Year's Eve", '2023-12-31 00:00:00', '2023-12-31 23:59:59', 15.75),
    ('PROMO009', 'Halloween Special', '2023-10-31 00:00:00', '2023-10-31 23:59:59', 10.50),
    ('PROMO010', 'Thanksgiving', '2023-11-23 00:00:00', '2023-11-23 23:59:59', 5.00);

-- --------------------------------------------------------

CREATE TABLE IF NOT EXISTS `transaction_history` (
    `TRANS_ID` CHAR(9) PRIMARY KEY,
    `PAYMENT_DATE` DATETIME NOT NULL,
    `WALLET_BALANCE` DECIMAL(9 , 2 ) NOT NULL,
    `REWARD_BALANCE` INT NOT NULL,
    `USER_ID` CHAR(9) NOT NULL,
    `TRAIN_ID` CHAR(9) NOT NULL,
    `PROMO_ID` CHAR(9) NOT NULL,
    CONSTRAINT `FK_history_USER_ID` FOREIGN KEY (`USER_ID`)
        REFERENCES `user_account` (`USER_ID`),
    CONSTRAINT `FK_train_TRAIN_ID` FOREIGN KEY (`TRAIN_ID`)
        REFERENCES `train_schedule` (`TRAIN_ID`),
    CONSTRAINT `FK_promotion_PROMO_ID` FOREIGN KEY (`PROMO_ID`)
        REFERENCES `promotion` (`PROMO_ID`)
);

INSERT INTO `transaction_history` (`TRANS_ID`, `PAYMENT_DATE`, `WALLET_BALANCE`, `REWARD_BALANCE`, `USER_ID`, `TRAIN_ID`, `PROMO_ID`) VALUES
    ('TRANS001', '2023-01-01 10:00:00', 100.00, 50, '100000000', 'TRAIN001', 'PROMO001'),
    ('TRANS002', '2023-01-02 11:15:00', 150.50, 75, '200000000', 'TRAIN002', 'PROMO002'),
    ('TRANS003', '2023-01-03 09:30:00', 200.25, 100, '300000000', 'TRAIN003', 'PROMO003'),
    ('TRANS004', '2023-01-04 12:45:00', 125.75, 25, '400000000', 'TRAIN004', 'PROMO004'),
    ('TRANS005', '2023-01-05 14:20:00', 60.20, 10, '500000000', 'TRAIN005', 'PROMO005'),
    ('TRANS006', '2023-01-06 16:10:00', 85.60, 30, '600000000', 'TRAIN006', 'PROMO006'),
    ('TRANS007', '2023-01-07 17:30:00', 250.00, 150, '700000000', 'TRAIN007', 'PROMO007'),
    ('TRANS008', '2023-01-08 19:20:00', 190.30, 60, '800000000', 'TRAIN008', 'PROMO008'),
    ('TRANS009', '2023-01-09 20:45:00', 150.50, 40, '900000000', 'TRAIN009', 'PROMO009'),
    ('TRANS010', '2023-01-10 22:00:00', 45.00, 20, '110000000', 'TRAIN010', 'PROMO010');
    
-- --------------------------------------------------------



SELECT * FROM virtual_wallet;