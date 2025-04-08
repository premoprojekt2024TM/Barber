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

INSERT INTO public."Appointment" VALUES (13, 'confirmed', '', 19, 2, 25);
INSERT INTO public."Appointment" VALUES (14, 'confirmed', '', 20, 2, 63);


--
-- Data for Name: AvailabilityTimes; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."AvailabilityTimes" VALUES (113, 'thursday', '12:20', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (114, 'thursday', '12:40', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (115, 'thursday', '13:20', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (116, 'thursday', '18:20', 'available', 8);
INSERT INTO public."AvailabilityTimes" VALUES (63, 'wednesday', '19:20', 'accepted', 2);
INSERT INTO public."AvailabilityTimes" VALUES (22, 'monday', '13:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (23, 'monday', '14:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (24, 'tuesday', '10:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (26, 'thursday', '14:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (27, 'friday', '14:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (29, 'sunday', '16:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (36, 'monday', '15:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (37, 'monday', '16:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (38, 'monday', '13:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (39, 'monday', '12:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (40, 'monday', '10:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (41, 'monday', '09:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (42, 'monday', '08:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (43, 'monday', '11:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (44, 'monday', '14:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (45, 'tuesday', '14:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (46, 'tuesday', '15:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (47, 'tuesday', '16:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (48, 'tuesday', '13:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (49, 'tuesday', '12:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (50, 'tuesday', '11:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (51, 'tuesday', '10:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (52, 'tuesday', '09:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (53, 'tuesday', '08:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (54, 'wednesday', '08:00', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (55, 'wednesday', '09:20', 'available', 19);
INSERT INTO public."AvailabilityTimes" VALUES (62, 'tuesday', '12:00', 'available', 2);
INSERT INTO public."AvailabilityTimes" VALUES (64, 'monday', '12:00', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (65, 'monday', '13:40', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (66, 'tuesday', '12:20', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (67, 'tuesday', '14:00', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (68, 'wednesday', '21:00', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (69, 'thursday', '19:00', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (70, 'friday', '16:00', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (71, 'saturday', '20:00', 'available', 14);
INSERT INTO public."AvailabilityTimes" VALUES (79, 'monday', '12:00', 'available', 13);
INSERT INTO public."AvailabilityTimes" VALUES (80, 'tuesday', '11:00', 'available', 13);
INSERT INTO public."AvailabilityTimes" VALUES (81, 'thursday', '12:20', 'available', 13);
INSERT INTO public."AvailabilityTimes" VALUES (82, 'thursday', '12:40', 'available', 13);
INSERT INTO public."AvailabilityTimes" VALUES (83, 'thursday', '13:20', 'available', 13);
INSERT INTO public."AvailabilityTimes" VALUES (84, 'thursday', '18:20', 'available', 13);
INSERT INTO public."AvailabilityTimes" VALUES (25, 'wednesday', '12:00', 'accepted', 2);
INSERT INTO public."AvailabilityTimes" VALUES (85, 'thursday', '12:20', 'available', 10);
INSERT INTO public."AvailabilityTimes" VALUES (86, 'thursday', '12:40', 'available', 10);
INSERT INTO public."AvailabilityTimes" VALUES (87, 'thursday', '13:20', 'available', 10);
INSERT INTO public."AvailabilityTimes" VALUES (88, 'thursday', '18:20', 'available', 10);
INSERT INTO public."AvailabilityTimes" VALUES (89, 'thursday', '12:20', 'available', 11);
INSERT INTO public."AvailabilityTimes" VALUES (90, 'thursday', '12:40', 'available', 11);
INSERT INTO public."AvailabilityTimes" VALUES (91, 'thursday', '13:20', 'available', 11);
INSERT INTO public."AvailabilityTimes" VALUES (92, 'thursday', '18:20', 'available', 11);
INSERT INTO public."AvailabilityTimes" VALUES (93, 'thursday', '12:20', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (94, 'thursday', '12:40', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (95, 'thursday', '13:20', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (96, 'thursday', '18:20', 'available', 7);
INSERT INTO public."AvailabilityTimes" VALUES (97, 'thursday', '12:20', 'available', 16);
INSERT INTO public."AvailabilityTimes" VALUES (98, 'thursday', '12:40', 'available', 16);
INSERT INTO public."AvailabilityTimes" VALUES (99, 'thursday', '13:20', 'available', 16);
INSERT INTO public."AvailabilityTimes" VALUES (100, 'thursday', '18:20', 'available', 16);
INSERT INTO public."AvailabilityTimes" VALUES (101, 'thursday', '12:20', 'available', 15);
INSERT INTO public."AvailabilityTimes" VALUES (102, 'thursday', '12:40', 'available', 15);
INSERT INTO public."AvailabilityTimes" VALUES (103, 'thursday', '13:20', 'available', 15);
INSERT INTO public."AvailabilityTimes" VALUES (104, 'thursday', '18:20', 'available', 15);
INSERT INTO public."AvailabilityTimes" VALUES (105, 'thursday', '12:20', 'available', 12);
INSERT INTO public."AvailabilityTimes" VALUES (106, 'thursday', '12:40', 'available', 12);
INSERT INTO public."AvailabilityTimes" VALUES (107, 'thursday', '13:20', 'available', 12);
INSERT INTO public."AvailabilityTimes" VALUES (108, 'thursday', '18:20', 'available', 12);
INSERT INTO public."AvailabilityTimes" VALUES (109, 'thursday', '12:20', 'available', 9);
INSERT INTO public."AvailabilityTimes" VALUES (110, 'thursday', '12:40', 'available', 9);
INSERT INTO public."AvailabilityTimes" VALUES (111, 'thursday', '13:20', 'available', 9);
INSERT INTO public."AvailabilityTimes" VALUES (112, 'thursday', '18:20', 'available', 9);


--
-- Data for Name: Friendship; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."Friendship" VALUES (2, 'accepted', 3, 2);
INSERT INTO public."Friendship" VALUES (3, 'pending', 3, 9);
INSERT INTO public."Friendship" VALUES (4, 'pending', 3, 8);
INSERT INTO public."Friendship" VALUES (5, 'pending', 3, 7);
INSERT INTO public."Friendship" VALUES (19, 'accepted', 2, 18);
INSERT INTO public."Friendship" VALUES (18, 'accepted', 2, 14);
INSERT INTO public."Friendship" VALUES (17, 'accepted', 2, 10);
INSERT INTO public."Friendship" VALUES (16, 'accepted', 2, 15);
INSERT INTO public."Friendship" VALUES (15, 'accepted', 3, 18);
INSERT INTO public."Friendship" VALUES (14, 'accepted', 3, 17);
INSERT INTO public."Friendship" VALUES (13, 'accepted', 3, 16);
INSERT INTO public."Friendship" VALUES (12, 'accepted', 3, 15);
INSERT INTO public."Friendship" VALUES (11, 'accepted', 3, 14);
INSERT INTO public."Friendship" VALUES (10, 'accepted', 3, 10);
INSERT INTO public."Friendship" VALUES (9, 'accepted', 3, 11);
INSERT INTO public."Friendship" VALUES (8, 'accepted', 3, 12);
INSERT INTO public."Friendship" VALUES (7, 'accepted', 3, 13);
INSERT INTO public."Friendship" VALUES (6, 'accepted', 3, 6);
INSERT INTO public."Friendship" VALUES (20, 'accepted', 13, 6);
INSERT INTO public."Friendship" VALUES (21, 'accepted', 13, 7);
INSERT INTO public."Friendship" VALUES (22, 'accepted', 13, 8);
INSERT INTO public."Friendship" VALUES (23, 'accepted', 13, 9);
INSERT INTO public."Friendship" VALUES (24, 'accepted', 13, 11);
INSERT INTO public."Friendship" VALUES (25, 'accepted', 13, 12);
INSERT INTO public."Friendship" VALUES (26, 'accepted', 13, 15);
INSERT INTO public."Friendship" VALUES (27, 'accepted', 13, 16);
INSERT INTO public."Friendship" VALUES (28, 'accepted', 17, 12);
INSERT INTO public."Friendship" VALUES (29, 'accepted', 17, 11);
INSERT INTO public."Friendship" VALUES (30, 'accepted', 17, 15);
INSERT INTO public."Friendship" VALUES (31, 'accepted', 17, 13);
INSERT INTO public."Friendship" VALUES (32, 'accepted', 17, 8);
INSERT INTO public."Friendship" VALUES (33, 'accepted', 17, 9);
INSERT INTO public."Friendship" VALUES (34, 'accepted', 17, 6);
INSERT INTO public."Friendship" VALUES (35, 'accepted', 17, 7);
INSERT INTO public."Friendship" VALUES (36, 'accepted', 15, 6);
INSERT INTO public."Friendship" VALUES (37, 'accepted', 15, 7);
INSERT INTO public."Friendship" VALUES (38, 'accepted', 15, 8);
INSERT INTO public."Friendship" VALUES (39, 'accepted', 15, 9);
INSERT INTO public."Friendship" VALUES (40, 'accepted', 15, 11);
INSERT INTO public."Friendship" VALUES (41, 'accepted', 15, 12);
INSERT INTO public."Friendship" VALUES (42, 'accepted', 15, 16);
INSERT INTO public."Friendship" VALUES (43, 'accepted', 15, 18);
INSERT INTO public."Friendship" VALUES (52, 'accepted', 2, 16);
INSERT INTO public."Friendship" VALUES (51, 'accepted', 2, 13);
INSERT INTO public."Friendship" VALUES (50, 'accepted', 2, 12);
INSERT INTO public."Friendship" VALUES (49, 'accepted', 2, 11);
INSERT INTO public."Friendship" VALUES (48, 'accepted', 2, 9);
INSERT INTO public."Friendship" VALUES (47, 'accepted', 2, 8);
INSERT INTO public."Friendship" VALUES (46, 'accepted', 2, 7);
INSERT INTO public."Friendship" VALUES (45, 'accepted', 2, 6);
INSERT INTO public."Friendship" VALUES (44, 'accepted', 2, 17);
INSERT INTO public."Friendship" VALUES (53, 'accepted', 22, 21);


--
-- Data for Name: Store; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."Store" VALUES (21, 'Barber3', NULL, 'Keszthelyi utca 11', 'Tata', '2890', '+36 30 444 4444', 'barber3@gmail.com', 47.6508367, 18.3120768, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1744130179186-store-image.jpg');
INSERT INTO public."Store" VALUES (5, 'Urban Barber', NULL, 'Váci út 10', 'Budapest', '1062', '30 123 4556', 'urbanbarber@gmail.com', 47.51345070000001, 19.0592306, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1743964095550-store-image.jpg');
INSERT INTO public."Store" VALUES (17, 'blahabarber123', NULL, 'Blaha Lujza 5', 'Budapest', '1085', '31 012 3232', 'blahabarber123@gmail.com', 47.4963207, 19.0696131, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1744046380528-store-image.jpg');
INSERT INTO public."Store" VALUES (4, 'Keszthely1', NULL, 'Deák Ferenc tér 10', 'Budapest', '1052', '30 444 4444', 'keszthely@gmail.com', 47.4974101, 19.0547245, 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/Store/1743764461625-store-image.jpg');


--
-- Data for Name: StoreWorker; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."StoreWorker" VALUES (63, 'owner', 17, 15);
INSERT INTO public."StoreWorker" VALUES (64, 'worker', 17, 16);
INSERT INTO public."StoreWorker" VALUES (65, 'worker', 17, 7);
INSERT INTO public."StoreWorker" VALUES (66, 'worker', 17, 11);
INSERT INTO public."StoreWorker" VALUES (7, 'owner', 4, 2);
INSERT INTO public."StoreWorker" VALUES (70, 'worker', 4, 10);
INSERT INTO public."StoreWorker" VALUES (77, 'owner', 21, 22);
INSERT INTO public."StoreWorker" VALUES (78, 'worker', 21, 21);
INSERT INTO public."StoreWorker" VALUES (35, 'worker', 4, 18);
INSERT INTO public."StoreWorker" VALUES (36, 'worker', 4, 14);
INSERT INTO public."StoreWorker" VALUES (37, 'worker', 4, 3);
INSERT INTO public."StoreWorker" VALUES (38, 'owner', 5, 13);
INSERT INTO public."StoreWorker" VALUES (39, 'worker', 5, 8);
INSERT INTO public."StoreWorker" VALUES (40, 'worker', 5, 9);
INSERT INTO public."StoreWorker" VALUES (41, 'worker', 5, 12);


--
-- Data for Name: User; Type: TABLE DATA; Schema: public; Owner: root
--

INSERT INTO public."User" VALUES (3, 'beszemarcell', 'beszemarcell@gmail.com', '$2b$12$oyNxr4MBjfkQKZcFm9kG..1S0qQZ/jtY/BFfH0uuQNEIJvVpv0OyC', 'Marcell', 'Besze', 'https://ui-avatars.com/api/?name=b&size=128', 'worker');
INSERT INTO public."User" VALUES (4, 'kovacsjozsef', 'kovacsjozsef@gmail.com', '$2b$12$pDmTP4zOQatL.jm8/44KluvTJhEMRsI6Q3mglBRL1FbULkH14s2Yq', 'József', 'Kovács', 'https://ui-avatars.com/api/?name=k&size=128', 'client');
INSERT INTO public."User" VALUES (5, 'HeBal', 'hetenyibalint06@gmail.com', '$2b$12$ugggwSrjdP5BvQOjIf6ZX..mfn9ty1WulOaMGCdZfNHq5bzJxNiL.', 'Bálint', 'Hetényi', 'https://ui-avatars.com/api/?name=H&size=128', 'client');
INSERT INTO public."User" VALUES (6, 'kovacs.peter', 'kovacs.peter90@gmail.hu', '$2b$12$HnpB/I2Qy.BapwVFlMUfD.8.aWuzswt7H3j0FEY2zMRkVOofyxKCO', 'Péter', 'Kovács', 'https://ui-avatars.com/api/?name=k&size=128', 'worker');
INSERT INTO public."User" VALUES (7, 'baloghmarton', 'baloghmarton@gmail.hu', '$2b$12$2qLDKNSiVCzmHIEVLrssR.4UfnH5ZzJpOpfcHApveSrlV1DY/0Pnu', 'Márton', 'Balogh', 'https://ui-avatars.com/api/?name=b&size=128', 'worker');
INSERT INTO public."User" VALUES (8, 'takacsferenc', 'takacs.ferenc@gmail.com', '$2b$12$j8Xop2hjiyFpynMK7YQIAeuju.1X5Ya8VjaDws447SfUFtd17n5WS', 'Ferenc', 'Takács', 'https://ui-avatars.com/api/?name=t&size=128', 'worker');
INSERT INTO public."User" VALUES (9, 'szabozoltan', 'szabozoltan@gmail.com', '$2b$12$ZbENZYcRDgZLXGH9kA0W7OOklmCIhGmyFac9jPSeN2X5/X5O9Arxq', 'Zoltán', 'Szabó', 'https://ui-avatars.com/api/?name=s&size=128', 'worker');
INSERT INTO public."User" VALUES (11, 'farkasandras', 'farkas.andras@gmail.com', '$2b$12$H.SVkcsx9oYEJgB9fR1Yo.ZpvYABDzNttMK6z4JpYapEIw8Iy.2s6', 'András', 'Farkas', 'https://ui-avatars.com/api/?name=f&size=128', 'worker');
INSERT INTO public."User" VALUES (12, 'sarkozilaszl', 'sarkozilaszlo@gmail.com', '$2b$12$wAqDeBExQK7A.CK/biXNIOb6vNhl.Mbb4YXj3VvgIGXQ0/zUi2Yg.', 'László', 'Sárközi', 'https://ui-avatars.com/api/?name=s&size=128', 'worker');
INSERT INTO public."User" VALUES (13, 'barna.gergo', 'barna.gergo@gmail.com', '$2b$12$acVubMgQw3rsj9kJ0yXILee0IdwQZveEJDXwps55GKCjfyX3s5eVa', 'Gergő', 'Barna', 'https://ui-avatars.com/api/?name=b&size=128', 'worker');
INSERT INTO public."User" VALUES (15, 'feketeabris', 'fekete.abris@gmail.com', '$2b$12$lImMtlmyXJeQ5dDqjp0aiOUSk2mVcf.tyNcKMd5R2zEaebiYN3Rgm', 'Ábris', 'Fekete', 'https://ui-avatars.com/api/?name=f&size=128', 'worker');
INSERT INTO public."User" VALUES (16, 'varga.robert', 'varga.robert@gmail.com', '$2b$12$dl5Rvl.A5a1jHf.G0Ww4oOosQgjlyrqG1ZxogqG2tUM.KIz/QA8b6', 'Róbert', 'Varga', 'https://ui-avatars.com/api/?name=v&size=128', 'worker');
INSERT INTO public."User" VALUES (17, 'siposlevente', 'sipos.levente@gmail.com', '$2b$12$fMGWE05eympM3dT0NYceO.fNypTH7p.GC1bEsKim9KvuvZbOboDHG', 'Levente', 'Sipos', 'https://ui-avatars.com/api/?name=s&size=128', 'worker');
INSERT INTO public."User" VALUES (18, 'dombi.zoltan', 'dombi.zoltan@gmail.com', '$2b$12$RPP6iy5QCGveKaot7vWLP.VOmXSgRo57gGoOLojSMabCNom74gBGC', 'Zoltán', 'Dombi', 'https://ui-avatars.com/api/?name=d&size=128', 'worker');
INSERT INTO public."User" VALUES (2, 'marcell1337', 'marcelltemleitner1@gmail.com', '$2b$12$RxCKWR9m5Gq99Bldv8zGjOEpd3WdyHg0krtW3j3IrG3DEEHqezpyK', 'Marcell', 'Temleitner', 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/ProfilePhotos/1743428921965-2-1743428921961.png', 'worker');
INSERT INTO public."User" VALUES (19, 'kadarcsilla', 'kadarcsilla@gmail.com', '$2b$12$ZrR1hISQxc5FKe3Wp67iKuBJm8YBt1QVxlgqR//XddHq50YLsqpc2', 'Csilla', 'Kádár', 'https://ui-avatars.com/api/?name=k&size=128', 'client');
INSERT INTO public."User" VALUES (14, 'bodnarviktor', 'bodnarviktor@gmail.com', '$2b$12$ic9/4N/8jl.OgL/xIp4ZEe8Q1KMTDJWTmPWxU/MoY/Oy6Qku9sHIi', 'Viktor', 'Bodnár', 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/ProfilePhotos/1743873833488-14-1743873833483.png', 'worker');
INSERT INTO public."User" VALUES (10, 'kiralybarber', 'kiraly.marton@gmail.com', '$2b$12$vS1DpjKOfo.TR6HXBlFLaeGgoXpvNQSGs./OxQoY2ONLcf.jxuTLW', 'Márton', 'Király', 'https://pub-f0fa5b4b544643998cb832c3f9d449bc.r2.dev/Uploads/ProfilePhotos/1743963887909-10-1743963887907.png', 'worker');
INSERT INTO public."User" VALUES (20, 'papistvan', 'papistvan@gmail.com', '$2b$12$qqHBH7ZMuYcb47UkCa0mYuh7A0B2RVVt/9VNixLcB5cG062mlNTI2', 'István', 'Pap', 'https://ui-avatars.com/api/?name=p&size=128', 'client');
INSERT INTO public."User" VALUES (21, 'tesztabel', 'tesztabel@gmail.com', '$2b$12$fVLtL2IqSSGlYucXP3A42utHGANlZm3MAotWWEygYKbtR25AJBaHm', 'Ábel', 'Teszt', 'https://ui-avatars.com/api/?name=t&size=128', 'worker');
INSERT INTO public."User" VALUES (22, 'tesztbalazs', 'tesztbalazs@gmail.com', '$2b$12$fiX3bOLTJOEmDVotI0L8.OxdhwOlbbflibdkutmejr6Q9QWuYulWa', 'Balázs', 'Teszt', 'https://ui-avatars.com/api/?name=t&size=128', 'worker');


--
-- Name: Appointment_appointmentId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Appointment_appointmentId_seq"', 14, true);


--
-- Name: AvailabilityTimes_timeSlotId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."AvailabilityTimes_timeSlotId_seq"', 84, true);


--
-- Name: Friendship_friendshipId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Friendship_friendshipId_seq"', 53, true);


--
-- Name: StoreWorker_storeWorkerId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."StoreWorker_storeWorkerId_seq"', 78, true);


--
-- Name: Store_storeId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."Store_storeId_seq"', 21, true);


--
-- Name: User_userId_seq; Type: SEQUENCE SET; Schema: public; Owner: root
--

SELECT pg_catalog.setval('public."User_userId_seq"', 22, true);


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

