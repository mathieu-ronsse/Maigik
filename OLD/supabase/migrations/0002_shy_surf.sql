/*
  # Storage Setup

  1. Create Buckets
    - `images` bucket for storing user uploads and processed images
  
  2. Security
    - Enable RLS on buckets
    - Add policies for secure access
*/

-- Create storage buckets
INSERT INTO storage.buckets (id, name, public)
VALUES ('images', 'images', true);

-- Enable RLS on the images bucket
CREATE POLICY "Authenticated users can upload images"
  ON storage.objects
  FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'images' AND
    auth.role() = 'authenticated'
  );

CREATE POLICY "Authenticated users can update own images"
  ON storage.objects
  FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'images' AND
    owner = auth.uid()
  );

CREATE POLICY "Anyone can view images"
  ON storage.objects
  FOR SELECT
  TO public
  USING (bucket_id = 'images');