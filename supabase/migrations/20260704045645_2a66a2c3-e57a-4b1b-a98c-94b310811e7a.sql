
-- Fix search_path on set_updated_at (missing SET search_path)
CREATE OR REPLACE FUNCTION public.set_updated_at()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$;

-- Revoke public execute on SECURITY DEFINER functions (only triggers / RLS should call them)
REVOKE EXECUTE ON FUNCTION public.handle_new_user() FROM PUBLIC, anon, authenticated;
REVOKE EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) FROM PUBLIC, anon;
-- has_role is called by RLS policies as `authenticated`, keep that grant
GRANT EXECUTE ON FUNCTION public.has_role(uuid, public.app_role) TO authenticated;
