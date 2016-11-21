--
-- PostgreSQL database dump
--

-- Dumped from database version 9.5.5
-- Dumped by pg_dump version 9.5.5

SET statement_timeout = 0;
SET lock_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SET check_function_bodies = false;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: plpgsql; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS plpgsql WITH SCHEMA pg_catalog;


--
-- Name: EXTENSION plpgsql; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION plpgsql IS 'PL/pgSQL procedural language';


--
-- Name: cube; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS cube WITH SCHEMA public;


--
-- Name: EXTENSION cube; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION cube IS 'data type for multidimensional cubes';


--
-- Name: earthdistance; Type: EXTENSION; Schema: -; Owner: 
--

CREATE EXTENSION IF NOT EXISTS earthdistance WITH SCHEMA public;


--
-- Name: EXTENSION earthdistance; Type: COMMENT; Schema: -; Owner: 
--

COMMENT ON EXTENSION earthdistance IS 'calculate great-circle distances on the surface of the Earth';


SET search_path = public, pg_catalog;

--
-- Name: weather_type; Type: TYPE; Schema: public; Owner: umbrelapp
--

CREATE TYPE weather_type AS ENUM (
    'RAINY',
    'CLOUDY',
    'PARTIAL_CLOUDY',
    'SUNNY',
    'SNOWNY'
);


ALTER TYPE weather_type OWNER TO umbrelapp;

SET default_tablespace = '';

SET default_with_oids = false;

--
-- Name: user; Type: TABLE; Schema: public; Owner: umbrelapp
--

CREATE TABLE "user" (
    id integer NOT NULL,
    username character varying(45) NOT NULL,
    password character varying(120) NOT NULL
);


ALTER TABLE "user" OWNER TO umbrelapp;

--
-- Name: TABLE "user"; Type: COMMENT; Schema: public; Owner: umbrelapp
--

COMMENT ON TABLE "user" IS 'Database for user storage.';


--
-- Name: USER_id_seq; Type: SEQUENCE; Schema: public; Owner: umbrelapp
--

CREATE SEQUENCE "USER_id_seq"
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE "USER_id_seq" OWNER TO umbrelapp;

--
-- Name: USER_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: umbrelapp
--

ALTER SEQUENCE "USER_id_seq" OWNED BY "user".id;


--
-- Name: city; Type: TABLE; Schema: public; Owner: umbrelapp
--

CREATE TABLE city (
    id integer NOT NULL,
    name character varying(40),
    country character varying(40),
    coordinates point
);


ALTER TABLE city OWNER TO umbrelapp;

--
-- Name: TABLE city; Type: COMMENT; Schema: public; Owner: umbrelapp
--

COMMENT ON TABLE city IS 'Information regarding the city';


--
-- Name: COLUMN city.coordinates; Type: COMMENT; Schema: public; Owner: umbrelapp
--

COMMENT ON COLUMN city.coordinates IS 'The GPS Coordinates of a City';


--
-- Name: city_id_seq; Type: SEQUENCE; Schema: public; Owner: umbrelapp
--

CREATE SEQUENCE city_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE city_id_seq OWNER TO umbrelapp;

--
-- Name: city_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: umbrelapp
--

ALTER SEQUENCE city_id_seq OWNED BY city.id;


--
-- Name: user_favourite_city; Type: TABLE; Schema: public; Owner: umbrelapp
--

CREATE TABLE user_favourite_city (
    user_id integer NOT NULL,
    city_id integer NOT NULL
);


ALTER TABLE user_favourite_city OWNER TO umbrelapp;

--
-- Name: TABLE user_favourite_city; Type: COMMENT; Schema: public; Owner: umbrelapp
--

COMMENT ON TABLE user_favourite_city IS 'store users favourite cities';


--
-- Name: weather; Type: TABLE; Schema: public; Owner: umbrelapp
--

CREATE TABLE weather (
    id integer NOT NULL,
    city_id integer NOT NULL,
    type weather_type DEFAULT 'SUNNY'::weather_type NOT NULL,
    date date DEFAULT ('now'::text)::date NOT NULL,
    temperature_max integer,
    temperature_min integer
);


ALTER TABLE weather OWNER TO umbrelapp;

--
-- Name: TABLE weather; Type: COMMENT; Schema: public; Owner: umbrelapp
--

COMMENT ON TABLE weather IS 'stores the weather condition';


--
-- Name: weather_id_seq; Type: SEQUENCE; Schema: public; Owner: umbrelapp
--

CREATE SEQUENCE weather_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE weather_id_seq OWNER TO umbrelapp;

--
-- Name: weather_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: umbrelapp
--

ALTER SEQUENCE weather_id_seq OWNED BY weather.id;


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY city ALTER COLUMN id SET DEFAULT nextval('city_id_seq'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY "user" ALTER COLUMN id SET DEFAULT nextval('"USER_id_seq"'::regclass);


--
-- Name: id; Type: DEFAULT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY weather ALTER COLUMN id SET DEFAULT nextval('weather_id_seq'::regclass);


--
-- Name: USER_pkey; Type: CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT "USER_pkey" PRIMARY KEY (id);


--
-- Name: Unique User; Type: CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY "user"
    ADD CONSTRAINT "Unique User" UNIQUE (username);


--
-- Name: city_pkey; Type: CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY city
    ADD CONSTRAINT city_pkey PRIMARY KEY (id);


--
-- Name: user_favourite_city_pkey; Type: CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY user_favourite_city
    ADD CONSTRAINT user_favourite_city_pkey PRIMARY KEY (user_id, city_id);


--
-- Name: weather_pkey; Type: CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY weather
    ADD CONSTRAINT weather_pkey PRIMARY KEY (id);


--
-- Name: city_constraint; Type: FK CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY user_favourite_city
    ADD CONSTRAINT city_constraint FOREIGN KEY (city_id) REFERENCES city(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: user_id_fk; Type: FK CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY user_favourite_city
    ADD CONSTRAINT user_id_fk FOREIGN KEY (user_id) REFERENCES "user"(id) ON UPDATE CASCADE ON DELETE CASCADE;


--
-- Name: weather_city_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: umbrelapp
--

ALTER TABLE ONLY weather
    ADD CONSTRAINT weather_city_id_fkey FOREIGN KEY (city_id) REFERENCES city(id) ON UPDATE RESTRICT ON DELETE RESTRICT;


--
-- Name: public; Type: ACL; Schema: -; Owner: postgres
--

REVOKE ALL ON SCHEMA public FROM PUBLIC;
REVOKE ALL ON SCHEMA public FROM postgres;
GRANT ALL ON SCHEMA public TO postgres;
GRANT ALL ON SCHEMA public TO PUBLIC;


--
-- PostgreSQL database dump complete
--

