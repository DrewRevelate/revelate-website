-- Combined migration for Calendly integration
-- This handles both app and public schemas with error handling

-- Create app schema if it doesn't exist
DO $$
BEGIN
    CREATE SCHEMA IF NOT EXISTS app;
EXCEPTION WHEN OTHERS THEN
    RAISE NOTICE 'Schema app already exists or error creating it';
END
$$;

-- Add Calendly fields to meetings and appointments in both schemas
DO $$
BEGIN
    -- Add to public.meetings if it exists
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'meetings') THEN
        BEGIN
            ALTER TABLE public.meetings
            ADD COLUMN IF NOT EXISTS calendly_event_uuid UUID,
            ADD COLUMN IF NOT EXISTS calendly_invitee_uuid UUID,
            ADD COLUMN IF NOT EXISTS reschedule_url TEXT,
            ADD COLUMN IF NOT EXISTS cancel_url TEXT,
            ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
            ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
            ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT;
            
            -- Status field (needed for indexes)
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'public' 
                         AND table_name = 'meetings' 
                         AND column_name = 'status') THEN
                ALTER TABLE public.meetings ADD COLUMN status TEXT;
            END IF;
            
            -- Meeting date field (needed for indexes)
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'public' 
                         AND table_name = 'meetings' 
                         AND column_name = 'meeting_date') THEN
                ALTER TABLE public.meetings ADD COLUMN meeting_date TIMESTAMPTZ;
            END IF;
            
            -- Company ID reference
            IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                         WHERE table_schema = 'public' 
                         AND table_name = 'meetings' 
                         AND column_name = 'company_id') THEN
                ALTER TABLE public.meetings ADD COLUMN company_id UUID;
            END IF;
            
            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_meetings_calendly_event_uuid ON public.meetings(calendly_event_uuid);
            CREATE INDEX IF NOT EXISTS idx_meetings_calendly_invitee_uuid ON public.meetings(calendly_invitee_uuid);
            CREATE INDEX IF NOT EXISTS idx_meetings_status ON public.meetings(status);
            CREATE INDEX IF NOT EXISTS idx_meetings_meeting_date ON public.meetings(meeting_date);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error modifying public.meetings: %', SQLERRM;
        END;
    END IF;

    -- Add to app.meetings if it exists
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'app' AND tablename = 'meetings') THEN
        BEGIN
            ALTER TABLE app.meetings
            ADD COLUMN IF NOT EXISTS calendly_event_uuid UUID,
            ADD COLUMN IF NOT EXISTS calendly_invitee_uuid UUID,
            ADD COLUMN IF NOT EXISTS reschedule_url TEXT,
            ADD COLUMN IF NOT EXISTS cancel_url TEXT,
            ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
            ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
            ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT;
            
            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_app_meetings_calendly_event_uuid ON app.meetings(calendly_event_uuid);
            CREATE INDEX IF NOT EXISTS idx_app_meetings_calendly_invitee_uuid ON app.meetings(calendly_invitee_uuid);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error modifying app.meetings: %', SQLERRM;
        END;
    END IF;

    -- Create tables if they don't exist
    
    -- Create public.appointments if it doesn't exist
    IF NOT EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'appointments') THEN
        BEGIN
            CREATE TABLE public.appointments (
                id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
                client_id UUID,
                title TEXT,
                description TEXT,
                start_time TIMESTAMPTZ,
                end_time TIMESTAMPTZ,
                duration INTEGER,
                is_video_meeting BOOLEAN DEFAULT FALSE,
                meeting_link TEXT,
                status TEXT,
                calendly_event_uuid UUID,
                calendly_invitee_uuid UUID,
                reschedule_url TEXT,
                cancel_url TEXT,
                canceled_at TIMESTAMPTZ,
                cancel_reason TEXT,
                calendly_event_uri TEXT,
                calendly_invitee_uri TEXT,
                created_at TIMESTAMPTZ DEFAULT now(),
                updated_at TIMESTAMPTZ DEFAULT now()
            );
            
            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_appointments_calendly_event_uuid ON public.appointments(calendly_event_uuid);
            CREATE INDEX IF NOT EXISTS idx_appointments_calendly_invitee_uuid ON public.appointments(calendly_invitee_uuid);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error creating public.appointments: %', SQLERRM;
        END;
    -- If it exists, add needed columns
    ELSE
        BEGIN
            ALTER TABLE public.appointments
            ADD COLUMN IF NOT EXISTS calendly_event_uuid UUID,
            ADD COLUMN IF NOT EXISTS calendly_invitee_uuid UUID,
            ADD COLUMN IF NOT EXISTS reschedule_url TEXT,
            ADD COLUMN IF NOT EXISTS cancel_url TEXT,
            ADD COLUMN IF NOT EXISTS canceled_at TIMESTAMPTZ,
            ADD COLUMN IF NOT EXISTS cancel_reason TEXT,
            ADD COLUMN IF NOT EXISTS calendly_event_uri TEXT,
            ADD COLUMN IF NOT EXISTS calendly_invitee_uri TEXT,
            ADD COLUMN IF NOT EXISTS status TEXT;
            
            -- Create indexes
            CREATE INDEX IF NOT EXISTS idx_appointments_calendly_event_uuid ON public.appointments(calendly_event_uuid);
            CREATE INDEX IF NOT EXISTS idx_appointments_calendly_invitee_uuid ON public.appointments(calendly_invitee_uuid);
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error modifying public.appointments: %', SQLERRM;
        END;
    END IF;

    -- Handle contacts table (for company_name)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'public' AND tablename = 'contacts') THEN
        BEGIN
            ALTER TABLE public.contacts
            ADD COLUMN IF NOT EXISTS company_name TEXT;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error modifying public.contacts: %', SQLERRM;
        END;
    END IF;
    
    -- Handle profiles table (for company_name)
    IF EXISTS (SELECT 1 FROM pg_tables WHERE schemaname = 'app' AND tablename = 'profiles') THEN
        BEGIN
            ALTER TABLE app.profiles
            ADD COLUMN IF NOT EXISTS company_name TEXT;
        EXCEPTION WHEN OTHERS THEN
            RAISE NOTICE 'Error modifying app.profiles: %', SQLERRM;
        END;
    END IF;
END
$$;
