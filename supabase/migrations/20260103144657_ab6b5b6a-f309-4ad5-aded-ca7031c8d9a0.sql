-- Allow admins to view all documents
CREATE POLICY "Admins can view all documents"
ON public.documents
FOR SELECT
USING (has_role(auth.uid(), 'admin'::app_role));