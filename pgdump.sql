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

DROP DATABASE IF EXISTS root;
--
-- Name: root; Type: DATABASE; Schema: -; Owner: root
--

CREATE DATABASE root WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE root OWNER TO root;

\connect root

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
-- Name: Appointment_status_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."Appointment_status_enum" AS ENUM (
    'confirmed',
    'completed'
);


ALTER TYPE public."Appointment_status_enum" OWNER TO root;

--
-- Name: AvailabilityTimes_status_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."AvailabilityTimes_status_enum" AS ENUM (
    'accepted',
    'available'
);


ALTER TYPE public."AvailabilityTimes_status_enum" OWNER TO root;

--
-- Name: Friendship_status_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."Friendship_status_enum" AS ENUM (
    'pending',
    'accepted',
    'rejected'
);


ALTER TYPE public."Friendship_status_enum" OWNER TO root;

--
-- Name: StoreWorker_role_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."StoreWorker_role_enum" AS ENUM (
    'owner',
    'worker'
);


ALTER TYPE public."StoreWorker_role_enum" OWNER TO root;

--
-- Name: User_role_enum; Type: TYPE; Schema: public; Owner: root
--

CREATE TYPE public."User_role_enum" AS ENUM (
    'client',
    'worker'
);


ALTER TYPE public."User_role_enum" OWNER TO root;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: Appointment; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Appointment" (
    "appointmentId" integer NOT NULL,
    status public."Appointment_status_enum" DEFAULT 'confirmed'::public."Appointment_status_enum" NOT NULL,
    notes character varying,
    client_id integer,
    worker_id integer,
    time_slot_id integer
);


ALTER TABLE public."Appointment" OWNER TO root;

--
-- Name: Appointment_appointmentId_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Appointment_appointmentId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Appointment_appointmentId_seq" OWNER TO root;

--
-- Name: Appointment_appointmentId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Appointment_appointmentId_seq" OWNED BY public."Appointment"."appointmentId";


--
-- Name: AvailabilityTimes; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."AvailabilityTimes" (
    "timeSlotId" integer NOT NULL,
    day character varying NOT NULL,
    "timeSlot" character varying NOT NULL,
    status public."AvailabilityTimes_status_enum" DEFAULT 'available'::public."AvailabilityTimes_status_enum" NOT NULL,
    user_id integer
);


ALTER TABLE public."AvailabilityTimes" OWNER TO root;

--
-- Name: AvailabilityTimes_timeSlotId_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."AvailabilityTimes_timeSlotId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."AvailabilityTimes_timeSlotId_seq" OWNER TO root;

--
-- Name: AvailabilityTimes_timeSlotId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."AvailabilityTimes_timeSlotId_seq" OWNED BY public."AvailabilityTimes"."timeSlotId";


--
-- Name: Friendship; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Friendship" (
    "friendshipId" integer NOT NULL,
    status public."Friendship_status_enum" DEFAULT 'pending'::public."Friendship_status_enum" NOT NULL,
    user_id integer,
    friend_id integer
);


ALTER TABLE public."Friendship" OWNER TO root;

--
-- Name: Friendship_friendshipId_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Friendship_friendshipId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Friendship_friendshipId_seq" OWNER TO root;

--
-- Name: Friendship_friendshipId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Friendship_friendshipId_seq" OWNED BY public."Friendship"."friendshipId";


--
-- Name: Store; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."Store" (
    "storeId" integer NOT NULL,
    name character varying NOT NULL,
    description character varying,
    address character varying NOT NULL,
    city character varying NOT NULL,
    "postalCode" character varying NOT NULL,
    phone character varying NOT NULL,
    email character varying NOT NULL,
    latitude double precision NOT NULL,
    longitude double precision NOT NULL,
    picture character varying
);


ALTER TABLE public."Store" OWNER TO root;

--
-- Name: StoreWorker; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."StoreWorker" (
    "storeWorkerId" integer NOT NULL,
    role public."StoreWorker_role_enum" DEFAULT 'worker'::public."StoreWorker_role_enum" NOT NULL,
    store_id integer,
    user_id integer
);


ALTER TABLE public."StoreWorker" OWNER TO root;

--
-- Name: StoreWorker_storeWorkerId_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."StoreWorker_storeWorkerId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."StoreWorker_storeWorkerId_seq" OWNER TO root;

--
-- Name: StoreWorker_storeWorkerId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."StoreWorker_storeWorkerId_seq" OWNED BY public."StoreWorker"."storeWorkerId";


--
-- Name: Store_storeId_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."Store_storeId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."Store_storeId_seq" OWNER TO root;

--
-- Name: Store_storeId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."Store_storeId_seq" OWNED BY public."Store"."storeId";


--
-- Name: User; Type: TABLE; Schema: public; Owner: root
--

CREATE TABLE public."User" (
    "userId" integer NOT NULL,
    username character varying NOT NULL,
    email character varying NOT NULL,
    password character varying NOT NULL,
    "firstName" character varying,
    "lastName" character varying,
    "profilePic" character varying,
    role public."User_role_enum" DEFAULT 'client'::public."User_role_enum" NOT NULL
);


ALTER TABLE public."User" OWNER TO root;

--
-- Name: User_userId_seq; Type: SEQUENCE; Schema: public; Owner: root
--

CREATE SEQUENCE public."User_userId_seq"
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public."User_userId_seq" OWNER TO root;

--
-- Name: User_userId_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: root
--

ALTER SEQUENCE public."User_userId_seq" OWNED BY public."User"."userId";


--
-- Name: Appointment appointmentId; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Appointment" ALTER COLUMN "appointmentId" SET DEFAULT nextval('public."Appointment_appointmentId_seq"'::regclass);


--
-- Name: AvailabilityTimes timeSlotId; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."AvailabilityTimes" ALTER COLUMN "timeSlotId" SET DEFAULT nextval('public."AvailabilityTimes_timeSlotId_seq"'::regclass);


--
-- Name: Friendship friendshipId; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Friendship" ALTER COLUMN "friendshipId" SET DEFAULT nextval('public."Friendship_friendshipId_seq"'::regclass);


--
-- Name: Store storeId; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Store" ALTER COLUMN "storeId" SET DEFAULT nextval('public."Store_storeId_seq"'::regclass);


--
-- Name: StoreWorker storeWorkerId; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."StoreWorker" ALTER COLUMN "storeWorkerId" SET DEFAULT nextval('public."StoreWorker_storeWorkerId_seq"'::regclass);


--
-- Name: User userId; Type: DEFAULT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."User" ALTER COLUMN "userId" SET DEFAULT nextval('public."User_userId_seq"'::regclass);


--
-- Data for Name: Appointment; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."Appointment" VALUES (1, 'confirmed', '', 9, 2, 10);
INSERT INTO public."Appointment" VALUES (2, 'confirmed', '', 10, 2, 12);
INSERT INTO public."Appointment" VALUES (3, 'confirmed', '', 11, 1, 3);


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
-- Name: AvailabilityTimes PK_2b9ef87f1eb155a94f59f41feef; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."AvailabilityTimes"
    ADD CONSTRAINT "PK_2b9ef87f1eb155a94f59f41feef" PRIMARY KEY ("timeSlotId");


--
-- Name: Store PK_3d067c8b01beffe1c136edfea9c; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Store"
    ADD CONSTRAINT "PK_3d067c8b01beffe1c136edfea9c" PRIMARY KEY ("storeId");


--
-- Name: User PK_45f0625bd8172eb9c821c948a0f; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."User"
    ADD CONSTRAINT "PK_45f0625bd8172eb9c821c948a0f" PRIMARY KEY ("userId");


--
-- Name: StoreWorker PK_7746b27983630c581d45a4f6b07; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."StoreWorker"
    ADD CONSTRAINT "PK_7746b27983630c581d45a4f6b07" PRIMARY KEY ("storeWorkerId");


--
-- Name: Friendship PK_a6c9d71ff8620a778fc441f22f2; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "PK_a6c9d71ff8620a778fc441f22f2" PRIMARY KEY ("friendshipId");


--
-- Name: Appointment PK_f61e1b0a28820f2584893977829; Type: CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "PK_f61e1b0a28820f2584893977829" PRIMARY KEY ("appointmentId");


--
-- Name: Friendship FK_01347da24ce0a275b7970ac1a0d; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "FK_01347da24ce0a275b7970ac1a0d" FOREIGN KEY (friend_id) REFERENCES public."User"("userId");


--
-- Name: AvailabilityTimes FK_314b8837ffa17ce5ec24cd87ace; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."AvailabilityTimes"
    ADD CONSTRAINT "FK_314b8837ffa17ce5ec24cd87ace" FOREIGN KEY (user_id) REFERENCES public."User"("userId") ON DELETE CASCADE;


--
-- Name: Appointment FK_8325f09d832b701002bf43de055; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "FK_8325f09d832b701002bf43de055" FOREIGN KEY (client_id) REFERENCES public."User"("userId") ON DELETE CASCADE;


--
-- Name: Appointment FK_876ea6584f4ce8976c86dfc1b24; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "FK_876ea6584f4ce8976c86dfc1b24" FOREIGN KEY (worker_id) REFERENCES public."User"("userId") ON DELETE CASCADE;


--
-- Name: StoreWorker FK_9b751cddfd78033232c9366702c; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."StoreWorker"
    ADD CONSTRAINT "FK_9b751cddfd78033232c9366702c" FOREIGN KEY (user_id) REFERENCES public."User"("userId") ON DELETE CASCADE;


--
-- Name: Friendship FK_ac0a00badff6e04155d16ba91ee; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Friendship"
    ADD CONSTRAINT "FK_ac0a00badff6e04155d16ba91ee" FOREIGN KEY (user_id) REFERENCES public."User"("userId");


--
-- Name: Appointment FK_b02384771c79582767d6ebfce29; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."Appointment"
    ADD CONSTRAINT "FK_b02384771c79582767d6ebfce29" FOREIGN KEY (time_slot_id) REFERENCES public."AvailabilityTimes"("timeSlotId") ON DELETE CASCADE;


--
-- Name: StoreWorker FK_ed4cff0f4f8bfdf720c59ef177b; Type: FK CONSTRAINT; Schema: public; Owner: root
--

ALTER TABLE ONLY public."StoreWorker"
    ADD CONSTRAINT "FK_ed4cff0f4f8bfdf720c59ef177b" FOREIGN KEY (store_id) REFERENCES public."Store"("storeId") ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--

