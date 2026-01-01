-- Update has_role function to require authentication and add security checks
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE plpgsql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Only allow authenticated users
  IF auth.uid() IS NULL THEN
    RETURN FALSE;
  END IF;
  
  -- Users can only check their own roles unless they're already admin
  IF _user_id != auth.uid() THEN
    -- Allow admins to check other users' roles
    IF NOT EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role = 'admin') THEN
      RETURN FALSE;
    END IF;
  END IF;
  
  RETURN EXISTS (
    SELECT 1 FROM user_roles
    WHERE user_id = _user_id AND role = _role
  );
END;
$$;