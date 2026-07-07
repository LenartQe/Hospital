-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Jul 07, 2026 at 03:49 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.0.30

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `hospital_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `appointments`
--

CREATE TABLE `appointments` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `message` varchar(2000) DEFAULT NULL,
  `patient_name` varchar(200) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `preferred_date` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `doctor_id` bigint(20) DEFAULT NULL,
  `patient_profile_id` bigint(20) DEFAULT NULL,
  `patient_record_id` bigint(20) DEFAULT NULL,
  `patient_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `appointments`
--

INSERT INTO `appointments` (`id`, `created_at`, `email`, `message`, `patient_name`, `phone`, `preferred_date`, `status`, `doctor_id`, `patient_profile_id`, `patient_record_id`, `patient_id`) VALUES
(1, '2026-05-06 14:58:05.000000', 'test@mnail.com', 'test', 'test', 'test', '2026-05-07', 'PENDING', 2, NULL, NULL, NULL),
(2, '2026-06-03 14:48:13.000000', 'LenartQ@gmail.com', 'Probleme me humbje te memoriese', 'Lenart Qollaku', '+38344673421', '2026-06-01', 'CONFIRMED', 1, NULL, NULL, NULL),
(3, '2026-07-06 21:42:49.000000', 'patient@hospital.local', 'Test', 'Test Pacient', '044111222', '2026-07-10', 'PENDING', 5, 1, NULL, 1),
(4, '2026-07-06 21:55:55.000000', 'Blerdonq@gmail.com', 'Problem me zemer', 'Blerdon Qollopeku', '+38345678234', '2026-07-14', 'CONFIRMED', 4, 6, NULL, 8),
(6, '2026-07-06 22:13:25.000000', 'front@test.com', 'From front page', 'Test Patient Front', '044999888', '2026-07-15', 'PENDING', 4, NULL, NULL, 9),
(7, '2026-07-06 23:55:48.000000', 'roniqollaku@gmail.com', 'Pershendetje i nderuari Dr.Blerdon\n\nKam dhimbje koke', 'Roni Qolllaku', '+38343462570', '2026-07-16', 'CONFIRMED', 6, 16, NULL, 19);

-- --------------------------------------------------------

--
-- Table structure for table `app_users`
--

CREATE TABLE `app_users` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `full_name` varchar(200) NOT NULL,
  `password_hash` varchar(255) NOT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `role` enum('ADMIN','DOCTOR','PATIENT') NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `app_users`
--

INSERT INTO `app_users` (`id`, `created_at`, `email`, `full_name`, `password_hash`, `phone`, `role`) VALUES
(1, '2026-05-20 15:39:55.000000', 'admin@hospital.local', 'Administrator', '$2a$10$CveTR6TK7Mdl00FXUpdxq.viyi7Cg94wqN0ookALoksyqZtugKS3S', '+383 44 000 001', 'ADMIN'),
(2, '2026-05-20 15:39:56.000000', 'patient@hospital.local', 'Arben Krasniqi', '$2a$10$XP3V.aemW0zLIh8P2OpbkuJFeQrFSGg9/iNrVHRykQRRuF0Le3j6a', '+383 44 100 200', 'PATIENT'),
(3, '2026-05-20 15:39:56.000000', 's.kryeziu@gmail.com', 'Dr. Sara Kryeziu', '$2a$10$h1UQzbnDwYOSVf.bjypx0OiIN6rF2wbpqCv8vqCrwBSGoUXd7qug6', '+383 49 876 902', 'DOCTOR'),
(4, '2026-05-20 15:40:35.000000', 'jonitubehd@gmail.com', 'jonitubehd', '$2a$10$/mlAx3GcJ8Pq5VxWNgwSCuwjvvJ4SxY.iUyx.NzDetrc8SOc.8y3W', NULL, 'PATIENT'),
(6, '2026-05-20 15:41:01.000000', 'blerdon@gmail.com', 'blerdon', '$2a$10$/STOoCji9xsZqrmyfnuB8uTGDpL6JK8eHOZO9WfS6KD.8Og2Rluw6', NULL, 'DOCTOR'),
(8, '2026-06-02 22:58:07.000000', 'blerdonsopaj@gmail.com', 'blerdonsopaj', '$2a$10$dtI/InAX3jxN1JJEgJI26.QWsoW6ObDMAb/ti8xE3VjlqoeOT7nme', NULL, 'PATIENT'),
(9, '2026-06-02 23:10:05.000000', 'kadrimustafa@gmail.com', 'kadrimustafa', '$2a$10$LCeNVSRaxO4eYMQL1SD8Ee/a3zsqkHQ12xuz2BrcuqQtGEP31oIFO', NULL, 'DOCTOR'),
(11, '2026-06-03 14:36:28.000000', 'blerdon1@gmail.com', 'blerdon1', '$2a$10$vhTO9K03HlUDXDwxpxI2vuBsYPwryfyBwOEUmnYTbOLmmHtAwSDPO', NULL, 'PATIENT'),
(13, '2026-07-02 20:09:14.000000', 'punishfear47@gmail.com', 'punishfear47', '$2a$10$XaKExnldYfeIPI7zTokar.iekZvrCBjyqw092vNpXslb3ve.jI0q.', NULL, 'DOCTOR'),
(14, '2026-07-02 20:10:31.000000', 'majkbajrati@gmail.com', 'majkbajrati', '$2a$10$Nry9Zmnm1pzFmhUOY9evtujFh2Yywf3ngnP1tE6aL1O1VfD/hUwzq', NULL, 'PATIENT'),
(15, '2026-07-02 20:10:51.000000', 'lejlek23@gmail.com', 'lejlek23', '$2a$10$YfEEQIixa4iPBPykDSlfAOrjvDsFECQYB9meHljL7GH2EL0i5uysi', NULL, 'DOCTOR'),
(18, '2026-07-06 20:58:30.000000', 'lenartqollaku@gmail.com', 'Dr.Lenart Qollaku', '$2a$10$9RpB7Ek3zdpm7WvJdv54Uu9.Hg/8buhLouxQWH6Jrpfi83E0uXTIS', '+38346806484', 'DOCTOR'),
(19, '2026-07-06 21:27:32.000000', 'lenart@hospital.local', 'lenart', '$2a$10$HUWc.KIiEDwyK1JuPt/arOimfhYYECtfHYq8D5IptUbEM9L24jMSC', NULL, 'DOCTOR'),
(20, '2026-07-06 21:40:49.000000', 'mimoza.kusari@spitaliprizrenit.com', 'Dr. Mimoza Kusari', '$2a$10$iYVlczfyBzxfm64XYeIVKefA8MvsHnQISSEs4Y3HLbS9s8P9qg5Ge', '+383 44 200 002', 'DOCTOR'),
(21, '2026-07-06 21:40:49.000000', 'sara.kryeziu@spitaliprizrenit.com', 'Dr. Sara Kryeziu', '$2a$10$RfhvlI0TUowLkbcFOo956uxzpeBLDChae2e8avBswMwf.4U/71xJi', '+383 49 876 902', 'DOCTOR'),
(23, '2026-07-06 21:54:18.000000', 'blerdonq@gmail.com', 'Dr. Blerdon Sopaj', '$2a$10$u/dq9JenvhldX/R1O8bRW.mXh7iCAMOy7pOG6f7a3KHvAPrm2UlL6', '+38345678321', 'DOCTOR'),
(24, '2026-07-06 21:54:50.000000', 'e.zoga@gmail.com', 'Dr. Emir Zoga', '$2a$10$Tao12rnnW.PUyDwmEZYE4O8X4Sil3K.NvZyXOoprRNTNOUDM9ggYi', '+383 49875432', 'DOCTOR'),
(29, '2026-07-06 22:46:17.000000', 'lq72878@ubt-uni.net', 'lq72878', '$2a$10$t6krqja55uqdjShcrxxtqeQT0wFHos6Imyx6sSUMe/iHdN2ojIPoO', NULL, 'DOCTOR'),
(31, '2026-07-06 22:47:47.000000', 'testpatient@example.com', 'testpatient', '$2a$10$APHJ7ABCJK8l/KIDh27S2.U5gsM3ORI2H09gyY3d1zXb0u0AdpPOu', NULL, 'PATIENT'),
(33, '2026-07-06 23:00:56.000000', 'otherpatient@test.com', 'otherpatient', '$2a$10$C.yWQkp920I/xWDm2kAOa.bwh7K3187y2US62ewm4Nno0lRBamIB.', NULL, 'PATIENT'),
(37, '2026-07-06 23:40:24.000000', 'kadri.mustafa@hotmail.com', 'Dr. Kadri Mustafa', '$2a$10$0KapZOjhpnUxh0//lwjLeOxV4OIiMxI1CjPqYcGLuqa2T3cV441Hu', '+383 45 769 109', 'DOCTOR'),
(50, '2026-07-06 23:48:01.000000', 'test@test.com', 'test', '$2a$10$UzY1lj306EN1gQQcLzm8fuSfNogaARjgPuSCA7bB2aFf/iRMZ/PnC', NULL, 'PATIENT'),
(51, '2026-07-06 23:48:01.000000', 'guest@hospital.local', 'guest', '$2a$10$icPFRp7fBD6up0OcjWm.fO7E91ketm/y45Bp1LFKJznla9V2hcEja', NULL, 'PATIENT'),
(52, '2026-07-06 23:48:01.000000', 'newpatient@test.com', 'Test User', '$2a$10$DuG6uZeET35xZmWHKEtWs.4u.rA4Bc/g4URUVJLcHR60qXMv9bxUm', '123', 'PATIENT'),
(53, '2026-07-06 23:48:16.000000', 'guest-patient@hospital.local', 'guest patient', '$2a$10$mYs43s.Hp07U/GDx1zYW.OhS.gz2iud58EGDl5oOslcOGPrrbZSnS', NULL, 'PATIENT'),
(55, '2026-07-06 23:48:16.000000', 'brandnew99@test.com', 'Brand New', '$2a$10$YbvHxaK0a47p4RR9RCkSReM4GTUNJDwgNegfusLEP5L1uuMbFfulS', '+383', 'PATIENT'),
(56, '2026-07-06 23:48:51.000000', 'john@hospital.local', 'john', '$2a$10$p6Yvfw0SjCAma/LTFLmcKOVHau1jk9tJ0IfJmGv4tYy2L9onZPjTe', NULL, 'PATIENT'),
(57, '2026-07-06 23:52:06.000000', 'fixpatient@test.com', 'Fix Patient', '$2a$10$ASabAsTur197TiCuYii74uN2tcak/Hk1TSOBF2dedSefbxqX3zOEm', '123', 'PATIENT'),
(58, '2026-07-06 23:54:00.000000', 'roniqollaku@gmail.com', 'roniqollaku', '$2a$10$gERbP1Mwk52/tMpAQJdRbeU5k6ijQbqBS1wp9.mNndfnTk0N7bAkO', NULL, 'PATIENT');

-- --------------------------------------------------------

--
-- Table structure for table `departments`
--

CREATE TABLE `departments` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `head_doctor_name` varchar(200) DEFAULT NULL,
  `location` varchar(255) DEFAULT NULL,
  `name` varchar(200) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `departments`
--

INSERT INTO `departments` (`id`, `created_at`, `description`, `head_doctor_name`, `location`, `name`) VALUES
(1, '2026-03-28 00:28:40.000000', 'Zemer dhe kujdes vaskular', 'Dr.Lenart Qollaku', 'Ndertesa U, Kati 5', 'Kardiologji'),
(2, '2026-03-28 00:28:40.000000', 'Kujdesi per te lindur, femije dhe adoleshent.', 'Dr. Kadri Mustafa', 'Ndertesa B, Kati 1', 'Pediatri'),
(3, '2026-03-28 00:28:40.000000', 'Truri, Kurrizi dhe sistemi nervor', 'Dr. Sara Kryeziu', 'Ndertesa A, Kati 3', 'Neurologji'),
(4, '2026-05-06 14:46:54.000000', '', 'Dr. Emir Zoga', 'Ndertesa A, Kati 4', 'Onkologji'),
(5, '2026-05-26 19:49:08.000000', 'Shendeti psiqik dhe Terapi per sjellje', 'Dr. Mimoza Kusari', 'Ndertesa N, Kati 5', 'Psikiatri');

-- --------------------------------------------------------

--
-- Table structure for table `diagnoses`
--

CREATE TABLE `diagnoses` (
  `id` bigint(20) NOT NULL,
  `description` varchar(4000) DEFAULT NULL,
  `diagnosed_at` datetime(6) DEFAULT NULL,
  `severity` varchar(50) DEFAULT NULL,
  `title` varchar(300) DEFAULT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL,
  `diagnosis_name` varchar(300) NOT NULL,
  `prescribed_medication` varchar(2000) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `diagnoses`
--

INSERT INTO `diagnoses` (`id`, `description`, `diagnosed_at`, `severity`, `title`, `doctor_id`, `patient_id`, `diagnosis_name`, `prescribed_medication`) VALUES
(1, 'Presion i lartë gjaku — monitorim dhe ndryshim stili jetese.', '2026-05-20 15:39:56.000000', 'MODERATE', 'Hipertension i lehtë', 1, 1, 'Hipertension i lehtë', NULL),
(3, 'Problem me rrahje te madhe te zemres', '2026-07-06 22:49:37.000000', 'MODERATE', 'Problem ne Zemer', 4, 14, 'Problem ne Zemer', NULL),
(4, 'Problem me memorie, Problem me te folurit', '2026-07-06 23:56:52.000000', 'MODERATE', 'Problem me Trure te vogel', 6, 19, 'Problem me Trure te vogel', NULL);

-- --------------------------------------------------------

--
-- Table structure for table `doctors`
--

CREATE TABLE `doctors` (
  `id` bigint(20) NOT NULL,
  `bio` varchar(4000) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `email` varchar(255) DEFAULT NULL,
  `full_name` varchar(200) NOT NULL,
  `image_url` varchar(500) DEFAULT NULL,
  `phone` varchar(50) DEFAULT NULL,
  `specialty` varchar(200) DEFAULT NULL,
  `department_id` bigint(20) DEFAULT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `treatment_type` varchar(300) DEFAULT NULL,
  `featured` bit(1) NOT NULL,
  `login_password` varchar(64) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctors`
--

INSERT INTO `doctors` (`id`, `bio`, `created_at`, `email`, `full_name`, `image_url`, `phone`, `specialty`, `department_id`, `user_id`, `treatment_type`, `featured`, `login_password`) VALUES
(1, 'Fokusohet ne te lindur, femije dhe adoleshent', '2026-03-28 00:28:40.000000', 'sara.kryeziu@spitaliprizrenit.com', 'Dr. Sara Kryeziu', 'https://images.unsplash.com/photo-1594824476967-48c8b964273f?w=400&h=400&fit=crop&crop=face', '+383 49 876 902', 'Pediatre', 2, 21, NULL, b'1', 'DrKryeziu#3547'),
(2, 'Specializuar qe 20 vjet ne fushen e psikologjise', '2026-03-28 00:28:40.000000', 'Kadri.Mustafa@hotmail.com', 'Dr. Kadri Mustafa', '/images/hospital/kadri-mustafa.png', '+383 45 769 109', 'Fokusimi ne shendetin Psiqik', 5, 37, NULL, b'1', 'DrMustafa#4339'),
(3, 'Specialist ne fushen barnatike te Kancerit dhe trajtimit te saj', '2026-03-28 00:28:40.000000', 'e.zoga@gmail.com', 'Dr. Emir Zoga', 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=400&h=400&fit=crop&crop=face', '+383 49875432', 'Trajtimin e kancerit', 4, 24, NULL, b'1', 'DrZoga#8368'),
(4, 'Lenart Qollaku - 31 vjet - Prizren', '2026-03-28 00:31:19.000000', 'lenartqollaku@gmail.com', 'Dr.Lenart Qollaku', 'https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?w=400&h=400&fit=crop&crop=face', '+38346806484', 'Arreste kardiake', 1, 18, NULL, b'1', 'DrQollaku#7844'),
(5, 'Prizren, 35 vjet', '2026-05-26 19:50:30.000000', 'mimoza.kusari@spitaliprizrenit.com', 'Dr. Mimoza Kusari', 'https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=400&h=400&fit=crop&crop=face', '+383 44 200 002', 'Kardiologe', 1, 20, NULL, b'1', 'DrKusari#3855'),
(6, '', '2026-06-03 14:45:43.000000', 'Blerdonq@gmail.com', 'Dr. Blerdon Sopaj', 'https://images.unsplash.com/photo-1584982751601-97dcc096659c?w=400&h=400&fit=crop&crop=face', '+38345678321', 'Truri dhe Sistemi Nervor', 3, 23, NULL, b'1', 'DrSopaj#8260');

-- --------------------------------------------------------

--
-- Table structure for table `doctor_hidden_patients`
--

CREATE TABLE `doctor_hidden_patients` (
  `id` bigint(20) NOT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `hidden_at` datetime(6) DEFAULT NULL,
  `patient_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `doctor_hidden_patients`
--

INSERT INTO `doctor_hidden_patients` (`id`, `doctor_id`, `hidden_at`, `patient_id`) VALUES
(1, 4, '2026-07-06 22:39:48.000000', 9);

-- --------------------------------------------------------

--
-- Table structure for table `medicines`
--

CREATE TABLE `medicines` (
  `id` bigint(20) NOT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `description` varchar(2000) DEFAULT NULL,
  `expiry_batch_note` varchar(500) DEFAULT NULL,
  `manufacturer` varchar(200) DEFAULT NULL,
  `name` varchar(200) NOT NULL,
  `price` decimal(12,2) DEFAULT NULL,
  `stock_quantity` int(11) NOT NULL,
  `unit` varchar(50) DEFAULT NULL,
  `specialty_key` varchar(50) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `medicines`
--

INSERT INTO `medicines` (`id`, `created_at`, `description`, `expiry_batch_note`, `manufacturer`, `name`, `price`, `stock_quantity`, `unit`, `specialty_key`) VALUES
(1, '2026-03-28 00:28:40.000000', 'Analgjetik dhe antipiretik.', 'Batch 2026-A', 'PharmaCo', 'Paracetamol 500mg', 0.05, 5000, 'tableta', 'GENERAL'),
(2, '2026-03-28 00:28:40.000000', 'IV fluid replenishment.', 'Sterile room storage', 'MedSupply', 'Saline Solution 0.9%', 2.50, 800, '500ml bags', NULL),
(3, '2026-07-06 22:01:01.000000', 'Anti-inflamator jo-streoidal.', NULL, 'Spitali i Prizrenit', 'Ibuprofen 400mg', 1.00, 3200, 'tableta', 'GENERAL'),
(4, '2026-07-06 22:01:01.000000', 'Antibiotik me spektër të gjerë.', NULL, 'Spitali i Prizrenit', 'Amoxicillin 500mg', 1.00, 1800, 'kapsula', 'GENERAL'),
(5, '2026-07-06 22:01:01.000000', 'Për ulçerë dhe refluks.', NULL, 'Spitali i Prizrenit', 'Omeprazol 20mg', 1.00, 2400, 'kapsula', 'GENERAL'),
(6, '2026-07-06 22:01:01.000000', 'Suplement për kocka dhe imunitet.', NULL, 'Spitali i Prizrenit', 'Vitaminë D3 1000 IU', 1.00, 1500, 'tableta', 'GENERAL'),
(7, '2026-07-06 22:01:01.000000', 'Antiagregues për profilaksi kardiake.', NULL, 'Spitali i Prizrenit', 'Aspirin 100mg', 1.00, 4000, 'tableta', 'CARDIOLOGY'),
(8, '2026-07-06 22:01:01.000000', 'Statina për kolesterolin.', NULL, 'Spitali i Prizrenit', 'Atorvastatin 20mg', 1.00, 2200, 'tableta', 'CARDIOLOGY'),
(9, '2026-07-06 22:01:01.000000', 'Beta-bllokues për presion dhe aritmi.', NULL, 'Spitali i Prizrenit', 'Metoprolol 50mg', 1.00, 1900, 'tableta', 'CARDIOLOGY'),
(10, '2026-07-06 22:01:01.000000', 'ACE inhibitor për hipertension.', NULL, 'Spitali i Prizrenit', 'Lisinopril 10mg', 1.00, 2100, 'tableta', 'CARDIOLOGY'),
(11, '2026-07-06 22:01:01.000000', 'Antiagregues pas stentit.', NULL, 'Spitali i Prizrenit', 'Clopidogrel 75mg', 1.00, 1600, 'tableta', 'CARDIOLOGY'),
(12, '2026-07-06 22:01:01.000000', 'Antipiretik për fëmijë.', NULL, 'Spitali i Prizrenit', 'Paracetamol Shurup 120mg/5ml', 1.00, 900, 'shishe', 'PEDIATRICS'),
(13, '2026-07-06 22:01:01.000000', 'Anti-inflamator për fëmijë.', NULL, 'Spitali i Prizrenit', 'Ibuprofen Shurup 100mg/5ml', 1.00, 850, 'shishe', 'PEDIATRICS'),
(14, '2026-07-06 22:01:01.000000', 'Antibiotik pediatrik.', NULL, 'Spitali i Prizrenit', 'Amoxicillin Shurup 250mg/5ml', 1.00, 700, 'shishe', 'PEDIATRICS'),
(15, '2026-07-06 22:01:01.000000', 'Bronkodilatator për astmë te fëmijët.', NULL, 'Spitali i Prizrenit', 'Salbutamol Inhaler', 1.00, 400, 'inhalator', 'PEDIATRICS'),
(16, '2026-07-06 22:01:01.000000', 'Suplement për foshnjat.', NULL, 'Spitali i Prizrenit', 'Vitamin Drops A+D', 1.00, 600, 'shishe', 'PEDIATRICS'),
(17, '2026-07-06 22:13:15.000000', 'Për neuropati dhe dhimbje nervore.', NULL, 'Spitali i Prizrenit', 'Gabapentin 300mg', 1.00, 1200, 'kapsula', 'NEUROLOGY'),
(18, '2026-07-06 22:13:15.000000', 'Për migrenë akute.', NULL, 'Spitali i Prizrenit', 'Sumatriptan 50mg', 1.00, 800, 'tableta', 'NEUROLOGY'),
(19, '2026-07-06 22:13:15.000000', 'Antiepileptik.', NULL, 'Spitali i Prizrenit', 'Levetiracetam 500mg', 1.00, 950, 'tableta', 'NEUROLOGY'),
(20, '2026-07-06 22:13:15.000000', 'Relaksues i muskulit për spasticitet.', NULL, 'Spitali i Prizrenit', 'Baclofen 10mg', 1.00, 700, 'tableta', 'NEUROLOGY'),
(21, '2026-07-06 22:13:15.000000', 'Terapi hormonale onkologjike.', NULL, 'Spitali i Prizrenit', 'Tamoxifen 20mg', 1.00, 500, 'tableta', 'ONCOLOGY'),
(22, '2026-07-06 22:13:15.000000', 'Antiemetik gjatë kemoterapisë.', NULL, 'Spitali i Prizrenit', 'Ondansetron 8mg', 1.00, 600, 'tableta', 'ONCOLOGY'),
(23, '2026-07-06 22:13:15.000000', 'Analgjetik për dhimbje onkologjike.', NULL, 'Spitali i Prizrenit', 'Morphine Sulfate 10mg', 1.00, 300, 'ampula', 'ONCOLOGY'),
(24, '2026-07-06 22:13:15.000000', 'Suplement gjatë trajtimit onkologjik.', NULL, 'Spitali i Prizrenit', 'Folic Acid 5mg', 1.00, 900, 'tableta', 'ONCOLOGY');

-- --------------------------------------------------------

--
-- Table structure for table `patients`
--

CREATE TABLE `patients` (
  `id` bigint(20) NOT NULL,
  `allergies` varchar(2000) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `email` varchar(255) NOT NULL,
  `phone_number` varchar(50) DEFAULT NULL,
  `status` varchar(20) NOT NULL,
  `user_id` bigint(20) DEFAULT NULL,
  `username` varchar(120) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patients`
--

INSERT INTO `patients` (`id`, `allergies`, `blood_type`, `email`, `phone_number`, `status`, `user_id`, `username`) VALUES
(1, 'Penicillin', 'A+', 'patient@hospital.local', '044111222', 'ACTIVE', 2, 'testpacient'),
(2, NULL, NULL, 'jonitubehd@gmail.com', NULL, 'ACTIVE', 4, 'jonitubehd'),
(3, NULL, NULL, 'blerdonsopaj@gmail.com', NULL, 'ACTIVE', 8, 'blerdonsopaj'),
(4, NULL, NULL, 'blerdon1@gmail.com', NULL, 'ACTIVE', 11, 'blerdon1'),
(5, NULL, NULL, 'majkbajrati@gmail.com', NULL, 'ACTIVE', 14, 'majkbajrati'),
(8, NULL, NULL, 'blerdonq@gmail.com', '+38345678234', 'ACTIVE', 23, 'blerdonq'),
(9, NULL, NULL, 'front@test.com', '044999888', 'ACTIVE', NULL, 'front'),
(10, NULL, NULL, 'testpatient@example.com', NULL, 'ACTIVE', 31, 'testpatient'),
(11, NULL, NULL, 'otherpatient@test.com', NULL, 'ACTIVE', 33, 'otherpatient'),
(12, NULL, NULL, 'test@test.com', NULL, 'ACTIVE', 50, 'test'),
(13, NULL, NULL, 'guest@hospital.local', NULL, 'ACTIVE', 51, 'guest'),
(14, NULL, NULL, 'newpatient@test.com', '123', 'ACTIVE', 52, 'newpatient'),
(15, NULL, NULL, 'guest-patient@hospital.local', NULL, 'ACTIVE', 53, 'guest-patient'),
(16, NULL, NULL, 'brandnew99@test.com', '+383', 'ACTIVE', 55, 'brandnew99'),
(17, NULL, NULL, 'john@hospital.local', NULL, 'ACTIVE', 56, 'john'),
(18, NULL, NULL, 'fixpatient@test.com', '123', 'ACTIVE', 57, 'fixpatient'),
(19, NULL, NULL, 'roniqollaku@gmail.com', '+38343462570', 'ACTIVE', 58, 'roniqolllaku');

-- --------------------------------------------------------

--
-- Table structure for table `patient_profiles`
--

CREATE TABLE `patient_profiles` (
  `id` bigint(20) NOT NULL,
  `allergies` varchar(2000) DEFAULT NULL,
  `blood_type` varchar(10) DEFAULT NULL,
  `created_at` datetime(6) DEFAULT NULL,
  `date_of_birth` date DEFAULT NULL,
  `notes` varchar(2000) DEFAULT NULL,
  `user_id` bigint(20) NOT NULL,
  `patient_record_id` bigint(20) DEFAULT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `patient_profiles`
--

INSERT INTO `patient_profiles` (`id`, `allergies`, `blood_type`, `created_at`, `date_of_birth`, `notes`, `user_id`, `patient_record_id`) VALUES
(1, 'Penicillin', 'A+', '2026-05-20 15:39:56.000000', '1990-05-12', 'Pacient demo për portalin.', 2, 1),
(2, NULL, NULL, '2026-05-20 15:40:35.000000', NULL, NULL, 4, 2),
(3, NULL, NULL, '2026-06-02 22:58:07.000000', NULL, NULL, 8, 3),
(4, NULL, NULL, '2026-06-03 14:36:28.000000', NULL, NULL, 11, 4),
(5, NULL, NULL, '2026-07-02 20:10:32.000000', NULL, NULL, 14, 5),
(6, NULL, NULL, '2026-07-06 21:54:18.000000', NULL, NULL, 23, 8),
(7, NULL, NULL, '2026-07-06 22:47:47.000000', NULL, NULL, 31, 10),
(8, NULL, NULL, '2026-07-06 23:00:56.000000', NULL, NULL, 33, 11),
(9, NULL, NULL, '2026-07-06 23:48:01.000000', NULL, NULL, 50, 12),
(10, NULL, NULL, '2026-07-06 23:48:01.000000', NULL, NULL, 51, 13),
(11, NULL, NULL, '2026-07-06 23:48:01.000000', NULL, NULL, 52, 14),
(12, NULL, NULL, '2026-07-06 23:48:16.000000', NULL, NULL, 53, 15),
(13, NULL, NULL, '2026-07-06 23:48:17.000000', NULL, NULL, 55, 16),
(14, NULL, NULL, '2026-07-06 23:48:51.000000', NULL, NULL, 56, 17),
(15, NULL, NULL, '2026-07-06 23:52:06.000000', NULL, NULL, 57, 18),
(16, NULL, NULL, '2026-07-06 23:54:00.000000', NULL, NULL, 58, 19);

-- --------------------------------------------------------

--
-- Table structure for table `prescriptions`
--

CREATE TABLE `prescriptions` (
  `id` bigint(20) NOT NULL,
  `dosage` varchar(200) DEFAULT NULL,
  `frequency` varchar(200) DEFAULT NULL,
  `instructions` varchar(2000) DEFAULT NULL,
  `prescribed_at` datetime(6) DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  `doctor_id` bigint(20) NOT NULL,
  `medicine_id` bigint(20) NOT NULL,
  `patient_id` bigint(20) NOT NULL
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `prescriptions`
--

INSERT INTO `prescriptions` (`id`, `dosage`, `frequency`, `instructions`, `prescribed_at`, `status`, `doctor_id`, `medicine_id`, `patient_id`) VALUES
(1, '500mg', '2 herë në ditë', 'Pas vaktit; mos tejkaloni dozën e rekomanduar.', '2026-05-20 15:39:56.000000', 'ACTIVE', 1, 1, 1),
(2, '100mg', '2 here ne dite', '', '2026-07-06 22:15:39.000000', 'ACTIVE', 5, 7, 1),
(3, '500mg', '2x', '', '2026-07-06 22:58:40.000000', 'ACTIVE', 4, 7, 14),
(4, '1 tab', 'daily', '', '2026-07-06 23:00:56.000000', 'ACTIVE', 4, 7, 14),
(5, '100 mg', '3 here ne dite', '', '2026-07-06 23:57:17.000000', 'ACTIVE', 6, 20, 19);

--
-- Indexes for dumped tables
--

--
-- Indexes for table `appointments`
--
ALTER TABLE `appointments`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKmujeo4tymoo98cmf7uj3vsv76` (`doctor_id`),
  ADD KEY `FKis8t1txvj32vsk5gtma8beobc` (`patient_record_id`);

--
-- Indexes for table `app_users`
--
ALTER TABLE `app_users`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_4vj92ux8a2eehds1mdvmks473` (`email`);

--
-- Indexes for table `departments`
--
ALTER TABLE `departments`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `diagnoses`
--
ALTER TABLE `diagnoses`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FKg5fdalts581rlq4nd8hv7hct2` (`doctor_id`),
  ADD KEY `FKedbv46efy8fnpia4t5a96qas8` (`patient_id`);

--
-- Indexes for table `doctors`
--
ALTER TABLE `doctors`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_t1f6cueqyjwx5ghew9ar1exe3` (`user_id`),
  ADD KEY `FKl2mro81neln9topymd898urh1` (`department_id`);

--
-- Indexes for table `doctor_hidden_patients`
--
ALTER TABLE `doctor_hidden_patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UKjo55kgp66v2evvd5woyux8qo4` (`doctor_id`,`patient_id`);

--
-- Indexes for table `medicines`
--
ALTER TABLE `medicines`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `patients`
--
ALTER TABLE `patients`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_a370hmxgv0l5c9panryr1ji7d` (`email`),
  ADD UNIQUE KEY `UK_myobm1tnc2tqmyk2fxl8ujpfj` (`username`),
  ADD UNIQUE KEY `UK_9tbsl3fmey0eofbm2xj69v4qs` (`user_id`);

--
-- Indexes for table `patient_profiles`
--
ALTER TABLE `patient_profiles`
  ADD PRIMARY KEY (`id`),
  ADD UNIQUE KEY `UK_m1vq601k5agscsnei45j7bcv1` (`user_id`),
  ADD KEY `FK5s27yyous6y4ucd4l09ph7x02` (`patient_record_id`);

--
-- Indexes for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD PRIMARY KEY (`id`),
  ADD KEY `FK24chc88e4so7cd6melh11rv6` (`doctor_id`),
  ADD KEY `FK2ee3ttqhbkr86e3xkgmnmnoqf` (`medicine_id`),
  ADD KEY `FKmb7dpu4sc1i967oxc8molt4ri` (`patient_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `appointments`
--
ALTER TABLE `appointments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `app_users`
--
ALTER TABLE `app_users`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=59;

--
-- AUTO_INCREMENT for table `departments`
--
ALTER TABLE `departments`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=8;

--
-- AUTO_INCREMENT for table `diagnoses`
--
ALTER TABLE `diagnoses`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=5;

--
-- AUTO_INCREMENT for table `doctors`
--
ALTER TABLE `doctors`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `doctor_hidden_patients`
--
ALTER TABLE `doctor_hidden_patients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=2;

--
-- AUTO_INCREMENT for table `medicines`
--
ALTER TABLE `medicines`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=25;

--
-- AUTO_INCREMENT for table `patients`
--
ALTER TABLE `patients`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=20;

--
-- AUTO_INCREMENT for table `patient_profiles`
--
ALTER TABLE `patient_profiles`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=17;

--
-- AUTO_INCREMENT for table `prescriptions`
--
ALTER TABLE `prescriptions`
  MODIFY `id` bigint(20) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=6;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `appointments`
--
ALTER TABLE `appointments`
  ADD CONSTRAINT `FKis8t1txvj32vsk5gtma8beobc` FOREIGN KEY (`patient_record_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `FKmujeo4tymoo98cmf7uj3vsv76` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`);

--
-- Constraints for table `diagnoses`
--
ALTER TABLE `diagnoses`
  ADD CONSTRAINT `FKg5fdalts581rlq4nd8hv7hct2` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`);

--
-- Constraints for table `doctors`
--
ALTER TABLE `doctors`
  ADD CONSTRAINT `FKl2mro81neln9topymd898urh1` FOREIGN KEY (`department_id`) REFERENCES `departments` (`id`);

--
-- Constraints for table `patient_profiles`
--
ALTER TABLE `patient_profiles`
  ADD CONSTRAINT `FK5s27yyous6y4ucd4l09ph7x02` FOREIGN KEY (`patient_record_id`) REFERENCES `patients` (`id`),
  ADD CONSTRAINT `FKkoyvac81olwkbdwg52f447trv` FOREIGN KEY (`user_id`) REFERENCES `app_users` (`id`);

--
-- Constraints for table `prescriptions`
--
ALTER TABLE `prescriptions`
  ADD CONSTRAINT `FK24chc88e4so7cd6melh11rv6` FOREIGN KEY (`doctor_id`) REFERENCES `doctors` (`id`),
  ADD CONSTRAINT `FK2ee3ttqhbkr86e3xkgmnmnoqf` FOREIGN KEY (`medicine_id`) REFERENCES `medicines` (`id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
