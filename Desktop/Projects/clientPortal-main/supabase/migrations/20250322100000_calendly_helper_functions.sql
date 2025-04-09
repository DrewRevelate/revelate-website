-- Helper function to check if a table exists in a particular schema
CREATE OR REPLACE FUNCTION check_table_exists(schema_name text, table_name text)
RETURNS TABLE(table_exists boolean) AS $$
BEGIN
    RETURN QUERY
    SELECT EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = schema_name
        AND table_name = table_name
    );
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to create a meeting in the app schema
CREATE OR REPLACE FUNCTION create_app_meeting(
    p_title text,
    p_description text,
    p_start_time timestamptz,
    p_end_time timestamptz,
    p_meeting_link text,
    p_client_id uuid,
    p_status text,
    p_uuid uuid,
    p_invitee_uuid uuid,
    p_reschedule_url text,
    p_cancel_url text
)
RETURNS void AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'app'
        AND table_name = 'meetings'
    ) THEN
        -- Insert into app.meetings table
        INSERT INTO app.meetings (
            title,
            description,
            start_time,
            end_time,
            meeting_link,
            client_id,
            status,
            calendly_event_uuid,
            calendly_invitee_uuid,
            reschedule_url,
            cancel_url,
            created_at,
            updated_at
        ) VALUES (
            p_title,
            p_description,
            p_start_time,
            p_end_time,
            p_meeting_link,
            p_client_id,
            p_status,
            p_uuid,
            p_invitee_uuid,
            p_reschedule_url,
            p_cancel_url,
            now(),
            now()
        );
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Helper function to cancel a meeting in the app schema
CREATE OR REPLACE FUNCTION cancel_app_meeting(
    p_invitee_uuid uuid,
    p_cancel_reason text,
    p_canceled_at timestamptz
)
RETURNS void AS $$
BEGIN
    IF EXISTS (
        SELECT 1
        FROM information_schema.tables
        WHERE table_schema = 'app'
        AND table_name = 'meetings'
    ) THEN
        -- Update app.meetings table
        UPDATE app.meetings
        SET
            status = 'canceled',
            cancel_reason = p_cancel_reason,
            canceled_at = p_canceled_at,
            updated_at = now()
        WHERE
            calendly_invitee_uuid = p_invitee_uuid;
    END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create all helper functions
CREATE OR REPLACE FUNCTION create_check_table_function()
RETURNS void AS $$
BEGIN
    -- This function is just a placeholder since we've already created the real function
    -- It's here so we can call it from our API to make sure everything is set up
    RAISE NOTICE 'check_table_exists function is ready';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Function to create app schema functions
CREATE OR REPLACE FUNCTION create_app_schema_functions()
RETURNS void AS $$
BEGIN
    -- This function is just a placeholder since we've already created the real functions
    -- It's here so we can call it from our API to make sure everything is set up
    RAISE NOTICE 'app schema functions are ready';
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
