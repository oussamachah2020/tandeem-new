CREATE OR REPLACE FUNCTION update_contract_status()
RETURNS TABLE(soon_to_be_ended_count INT, ended_count INT, soon_to_be_terminated_count INT, terminated_count INT)
AS
$$
BEGIN
    -- Initialize variables to store the count of records updated for each status
    soon_to_be_ended_count := 0;
    ended_count := 0;
    soon_to_be_terminated_count := 0;
    terminated_count := 0;

    -- Update contracts to "SoonToBeEnded" status when the current date is close to the end date
    WITH result AS (
        UPDATE contract
            SET status = 'SoonToBeEnded'
            WHERE "to" - CURRENT_DATE BETWEEN 0 AND 90
            RETURNING 1
    )
    SELECT count(*)
    INTO soon_to_be_ended_count
    FROM result;

    -- Update contracts to "Ended" status when the current date exceeds the end date
    WITH result AS (
        UPDATE contract
            SET status = 'Ended'
            WHERE "to" < CURRENT_DATE
            RETURNING 1
    )
    SELECT count(*)
    INTO ended_count
    FROM result;

    -- Update contracts to "SoonToBeTerminated" status when the current date is close to the premature termination date
    WITH result AS (
        UPDATE contract
            SET status = 'SoonToBeTerminated'
            WHERE "prematureTo" IS NOT NULL
                AND "prematureTo" - CURRENT_DATE BETWEEN 0 AND 90
            RETURNING 1
    )
    SELECT count(*)
    INTO soon_to_be_terminated_count
    FROM result;

    -- Update contracts to "Terminated" status when the current date exceeds the premature termination date
    WITH result AS (
        UPDATE contract
            SET status = 'Terminated'
            WHERE "prematureTo" IS NOT NULL
                AND "prematureTo" < CURRENT_DATE
            RETURNING 1
    )
    SELECT count(*)
    INTO terminated_count
    FROM result;
END;
$$
LANGUAGE plpgsql;
