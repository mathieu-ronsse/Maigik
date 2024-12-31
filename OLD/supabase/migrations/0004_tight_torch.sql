/*
  # Add input_image_timestamp column to service_usage table

  1. Changes
    - Add input_image_timestamp column to service_usage table
    - Set default value to CURRENT_TIMESTAMP
    - Make column NOT NULL
    - Backfill existing rows with current timestamp
*/

DO $$ 
BEGIN
  -- Add column if it doesn't exist
  IF NOT EXISTS (
    SELECT 1 
    FROM information_schema.columns 
    WHERE table_name = 'service_usage' 
    AND column_name = 'input_image_timestamp'
  ) THEN
    -- Add the column
    ALTER TABLE public.service_usage 
    ADD COLUMN input_image_timestamp TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

    -- Update existing rows to use their created_at timestamp
    UPDATE public.service_usage 
    SET input_image_timestamp = created_at 
    WHERE input_image_timestamp IS NULL;
  END IF;
END $$;