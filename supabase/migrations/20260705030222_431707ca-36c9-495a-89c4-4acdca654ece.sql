
CREATE TYPE public.sleep_schedule AS ENUM ('early_bird', 'night_owl', 'flexible');
CREATE TYPE public.cleanliness_level AS ENUM ('very_clean', 'clean', 'moderate', 'relaxed');
CREATE TYPE public.noise_tolerance AS ENUM ('silent', 'quiet', 'moderate', 'lively');
CREATE TYPE public.smoking_pref AS ENUM ('no', 'outside_only', 'yes');
CREATE TYPE public.alcohol_pref AS ENUM ('no', 'sometimes', 'yes');
CREATE TYPE public.guests_pref AS ENUM ('never', 'rarely', 'sometimes', 'often');
CREATE TYPE public.gender_pref AS ENUM ('male', 'female', 'any');
CREATE TYPE public.visibility_status AS ENUM ('public', 'private');

CREATE TABLE public.roommate_profiles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Basic
  gender public.gender_pref NOT NULL,
  birth_year int NOT NULL CHECK (birth_year BETWEEN 1950 AND 2015),
  university text NOT NULL,
  study_year int CHECK (study_year BETWEEN 1 AND 8),
  major text,

  -- Housing preferences
  budget_min int NOT NULL CHECK (budget_min >= 0),
  budget_max int NOT NULL CHECK (budget_max >= 0),
  move_in_date date,
  city text NOT NULL DEFAULT 'Toshkent',
  districts text[] NOT NULL DEFAULT '{}',
  preferred_gender public.gender_pref NOT NULL DEFAULT 'any',

  -- Lifestyle
  sleep_schedule public.sleep_schedule NOT NULL,
  wake_time time,
  sleep_time time,
  cleanliness public.cleanliness_level NOT NULL,
  noise_tolerance public.noise_tolerance NOT NULL,
  smoking public.smoking_pref NOT NULL DEFAULT 'no',
  alcohol public.alcohol_pref NOT NULL DEFAULT 'no',
  pets_ok boolean NOT NULL DEFAULT false,
  has_pets boolean NOT NULL DEFAULT false,
  guests public.guests_pref NOT NULL DEFAULT 'rarely',
  overnight_guests_ok boolean NOT NULL DEFAULT false,

  -- Kitchen & food
  cooks_often boolean NOT NULL DEFAULT true,
  shares_food boolean NOT NULL DEFAULT false,
  dietary_restrictions text[] NOT NULL DEFAULT '{}', -- halal, vegetarian, vegan, allergies
  halal_only boolean NOT NULL DEFAULT true,

  -- Religion & culture
  religion text,
  prays boolean NOT NULL DEFAULT false,
  fasts_ramadan boolean NOT NULL DEFAULT false,
  religious_practices_at_home boolean NOT NULL DEFAULT false,

  -- Personality
  languages text[] NOT NULL DEFAULT '{}', -- uz, ru, en, ...
  personality_type text, -- introvert / extrovert / ambivert
  hobbies text[] NOT NULL DEFAULT '{}',
  interests text,

  -- Schedule
  work_or_study_schedule text, -- morning / evening / mixed
  usually_home_days text[] NOT NULL DEFAULT '{}',

  -- Experience & conflict
  had_roommate_before boolean NOT NULL DEFAULT false,
  previous_experience text,
  conflict_style text, -- talk / avoid / mediator

  -- Expectations from roommate
  expected_qualities text[] NOT NULL DEFAULT '{}',
  deal_breakers text[] NOT NULL DEFAULT '{}', -- red lines
  chores_split text, -- equal / rotation / whoever_dirtier
  bills_split text, -- equal / by_usage / negotiable

  -- Contact
  preferred_contact text NOT NULL DEFAULT 'chat', -- chat / phone / telegram
  additional_notes text,

  -- Meta
  visibility public.visibility_status NOT NULL DEFAULT 'public',
  completion_percent int NOT NULL DEFAULT 0 CHECK (completion_percent BETWEEN 0 AND 100),

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),

  CHECK (budget_max >= budget_min)
);

GRANT SELECT, INSERT, UPDATE, DELETE ON public.roommate_profiles TO authenticated;
GRANT ALL ON public.roommate_profiles TO service_role;

ALTER TABLE public.roommate_profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users manage their own roommate profile"
  ON public.roommate_profiles FOR ALL
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Authenticated users can view public roommate profiles"
  ON public.roommate_profiles FOR SELECT
  TO authenticated
  USING (visibility = 'public');

CREATE TRIGGER set_roommate_profiles_updated_at
  BEFORE UPDATE ON public.roommate_profiles
  FOR EACH ROW EXECUTE FUNCTION public.set_updated_at();

CREATE INDEX idx_roommate_profiles_visibility ON public.roommate_profiles(visibility);
CREATE INDEX idx_roommate_profiles_university ON public.roommate_profiles(university);
