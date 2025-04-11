--
-- PostgreSQL database dump
--

-- Dumped from database version 17.4 (Debian 17.4-1.pgdg120+2)
-- Dumped by pg_dump version 17.4 (Homebrew)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."User" VALUES (1, 'temleitmarc', 'marcelltemleitner@gmail.com', '$2b$12$hyTlC5UXHO4dOcZ6UyZNN.ikPl9UrkdyaSYtolyIT/G/HrqFrv.c2', 'Marcell', 'Temleitner', 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/ProfilePhotos/1744280881228-1-1744280881228.png', 'worker');
INSERT INTO public."User" VALUES (2, 'beszemarcell', 'beszemarcell@gmail.com', '$2b$12$zMGsebb6s/RiVDkREnvSgeiyiS9v47bOZh2TWlVnr.qE4rmruIT6y', 'Marcell', 'Besze', 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/ProfilePhotos/1744281064275-2-1744281064275.png', 'worker');
INSERT INTO public."User" VALUES (3, 'hetenyibal', 'hetenyibalint@gmail.com', '$2b$12$DDdrvwgwExeNI0P8h.KNkOxnexSDbwL7xG5WBtGldOPPLRbWl4w0y', 'Bálint', 'Hetényi', 'https://ui-avatars.com/api/?name=h&size=128', 'worker');
INSERT INTO public."User" VALUES (4, 'lanczcsaba', 'lanczcsaba@gmail.com', '$2b$12$UjfZ3o98aMO9dWGiyYz3kuYYfZ2vS5xtB./PbzXhScqxTd5WJy5i.', 'Csaba', 'Lancz', 'https://ui-avatars.com/api/?name=l&size=128', 'worker');
INSERT INTO public."User" VALUES (5, 'kovacskevin', 'kovacskevin@gmail.com', '$2b$12$SnJtG9knC4URhurM1OzYS.7MR5Tt.9fBtvrOL9UJSTnOtkEXNcjOy', 'Kevin', 'Kovács', 'https://ui-avatars.com/api/?name=k&size=128', 'worker');
INSERT INTO public."User" VALUES (6, 'kalugyerk', 'kalugyerkevin@gmail.com', '$2b$12$2Br/yZybiZkQhRBSKIGAKO3MsqwtdkqcExXB89cs.DmEy1iRAsh8a', 'Kevin', 'Kalugyer', 'https://ui-avatars.com/api/?name=k&size=128', 'worker');
INSERT INTO public."User" VALUES (7, 'kovacsbendi', 'kovacsbenedek@gmail.com', '$2b$12$vOfVQdqjYdUcbgnNEA1TeeLjbZO4e3YElk6TGdklTtvY.HejpAKeq', 'Benedek', 'Kovács', 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/ProfilePhotos/1744303147516-7-1744303147516.png', 'worker');
INSERT INTO public."User" VALUES (8, 'weberzsombor', 'weberzsombor@gmail.com', '$2b$12$9rf7Y.C8tWLM2QcZ44wH.OzLtvp3E306l3E17Gjhi9a3.2Qn7l9F2', 'Zsombor', 'Wéber', 'https://ui-avatars.com/api/?name=w&size=128', 'worker');
INSERT INTO public."User" VALUES (9, 'Kadarcsilla', 'kadarcsilla@gmail.com', '$2b$12$4QtKQQ1.L3ybE7.5vnQonO.C1TU7IgVYElaeTWzyoqrwPNTN/V8rq', 'Csilla', 'Kádár', 'https://ui-avatars.com/api/?name=K&size=128', 'client');
INSERT INTO public."User" VALUES (10, 'kovacsjozsef', 'kovacsjozsef@gmail.com', '$2b$12$V0uiGgmEIOhjXkaPVM/bruBBRJE7tAXXFk4rJdEZefTpsznGi.d76', 'József', 'Kovács', 'https://ui-avatars.com/api/?name=k&size=128', 'client');
INSERT INTO public."User" VALUES (11, 'baranyaielod', 'baranyaielod@gmail.com', '$2b$12$bYrOdqsCxvq4D9AnLxnR2ORot0SUq8YZkrJVUq6CopJkSMkU.Ec1G', 'Előd', 'Baranyai', 'https://ui-avatars.com/api/?name=b&size=128', 'client');


--
-- Data for Name: AvailabilityTimes; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."AvailabilityTimes" VALUES (1, 'monday', '12:20', 'available', 1);
INSERT INTO public."AvailabilityTimes" VALUES (2, 'monday', '13:20', 'available', 1);
INSERT INTO public."AvailabilityTimes" VALUES (4, 'tuesday', '09:10', 'available', 1);
INSERT INTO public."AvailabilityTimes" VALUES (5, 'wednesday', '10:10', 'available', 1);
INSERT INTO public."AvailabilityTimes" VALUES (6, 'thursday', '10:40', 'available', 1);
INSERT INTO public."AvailabilityTimes" VALUES (7, 'friday', '10:50', 'available', 1);
INSERT INTO public."AvailabilityTimes" VALUES (8, 'monday', '10:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (9, 'monday', '14:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (11, 'thursday', '15:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (13, 'monday', '10:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (14, 'monday', '11:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (15, 'monday', '14:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (16, 'wednesday', '12:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (17, 'wednesday', '14:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (18, 'thursday', '18:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (19, 'friday', '16:00', 'available', 4);
INSERT INTO public."AvailabilityTimes" VALUES (20, 'monday', '12:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (21, 'monday', '12:10', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (22, 'monday', '12:20', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (23, 'tuesday', '14:30', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (24, 'tuesday', '16:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (25, 'wednesday', '12:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (26, 'wednesday', '14:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (27, 'wednesday', '16:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (28, 'thursday', '16:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (29, 'friday', '14:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (30, 'saturday', '19:00', 'available', 3);
INSERT INTO public."AvailabilityTimes" VALUES (31, 'monday', '11:40', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (32, 'tuesday', '12:20', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (33, 'tuesday', '13:20', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (34, 'wednesday', '11:00', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (35, 'thursday', '13:25', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (36, 'friday', '13:44', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (37, 'saturday', '12:00', 'available', 5);
INSERT INTO public."AvailabilityTimes" VALUES (38, 'monday', '10:00', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (39, 'tuesday', '12:00', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (40, 'tuesday', '13:25', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (41, 'thursday', '14:25', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (42, 'friday', '16:25', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (43, 'saturday', '15:25', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (44, 'sunday', '12:25', 'available', 6);
INSERT INTO public."AvailabilityTimes" VALUES (45, 'monday', '14:00', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (46, 'monday', '15:00', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (47, 'tuesday', '11:10', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (48, 'tuesday', '08:00', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (49, 'tuesday', '08:15', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (50, 'tuesday', '08:30', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (51, 'tuesday', '09:10', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (52, 'monday', '11:00', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (53, 'monday', '12:00', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (54, 'monday', '13:00', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (55, 'tuesday', '14:00', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (56, 'tuesday', '16:00', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (57, 'tuesday', '19:00', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (10, 'tuesday', '12:00', 'accepted', 2);
INSERT INTO public."AvailabilityTimes" VALUES (12, 'tuesday', '12:10', 'accepted', 2);
INSERT INTO public."AvailabilityTimes" VALUES (3, 'tuesday', '08:20', 'accepted', 1);


--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."Appointment" VALUES (1, 'confirmed', '', 9, 2, 10);
INSERT INTO public."Appointment" VALUES (2, 'confirmed', '', 10, 2, 12);
INSERT INTO public."Appointment" VALUES (3, 'confirmed', '', 11, 1, 3);


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."Friendship" VALUES (1, 'accepted', 1, 2);
INSERT INTO public."Friendship" VALUES (2, 'accepted', 3, 4);
INSERT INTO public."Friendship" VALUES (3, 'accepted', 6, 5);
INSERT INTO public."Friendship" VALUES (4, 'accepted', 8, 7);


--
-- Data for Name: Store; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."Store" VALUES (1, 'BeszeBarberhouse', NULL, 'Váci út 10', 'Budapest', '1132', '20 222 1022', 'beszebarberhouse@gmail.com', 47.5126836, 19.0569889, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1744281431740-store-image.jpg');
INSERT INTO public."Store" VALUES (2, 'LanczBarber', NULL, 'Budaörsi út 10', 'Budapest', '1118', '20 123 5555', 'lanczbarber@gmail.com', 47.4869846, 19.0251705, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1744282329248-store-image.jpg');
INSERT INTO public."Store" VALUES (3, 'K&K Barber', NULL, '4-es Főút', 'Budapest', '', '+36 30 232 2222', 'kingbarber@gmail.com', 47.497912, 19.040235, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1744302846047-store-image.jpg');
INSERT INTO public."Store" VALUES (4, 'WeberBarber', NULL, 'Teleki Blanka utca 10', 'Budapest', '1142', '30 443 2331', 'weberbarber@gmail.com', 47.524815, 19.0913009, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1744303302373-store-image.jpg');


--
-- Data for Name: StoreWorker; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."StoreWorker" VALUES (1, 'owner', 1, 1);
INSERT INTO public."StoreWorker" VALUES (2, 'worker', 1, 2);
INSERT INTO public."StoreWorker" VALUES (3, 'owner', 2, 4);
INSERT INTO public."StoreWorker" VALUES (4, 'worker', 2, 3);
INSERT INTO public."StoreWorker" VALUES (5, 'owner', 3, 5);
INSERT INTO public."StoreWorker" VALUES (6, 'worker', 3, 6);
INSERT INTO public."StoreWorker" VALUES (7, 'owner', 4, 7);
INSERT INTO public."StoreWorker" VALUES (8, 'worker', 4, 8);


--
-- Name: Appointment_appointmentId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Appointment_appointmentId_seq"', 3, true);


--
-- Name: AvailabilityTimes_timeSlotId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."AvailabilityTimes_timeSlotId_seq"', 57, true);


--
-- Name: Friendship_friendshipId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Friendship_friendshipId_seq"', 4, true);


--
-- Name: StoreWorker_storeWorkerId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."StoreWorker_storeWorkerId_seq"', 8, true);


--
-- Name: Store_storeId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Store_storeId_seq"', 4, true);


--
-- Name: User_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."User_userId_seq"', 11, true);


--
-- PostgreSQL database dump complete
--

