CREATE OR REPLACE FUNCTION update_contract_status_trigger()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW."prematureTo" IS NOT NULL AND NEW."prematureTo" < CURRENT_DATE THEN
        NEW."status" := 'Terminated';
    ELSIF NEW."prematureTo" IS NOT NULL AND NEW."prematureTo" - CURRENT_DATE BETWEEN 0 AND 90 THEN
        NEW."status" := 'SoonToBeTerminated';
    ELSIF NEW."to" < CURRENT_DATE THEN
        NEW."status" := 'Ended';
    ELSIF NEW."to" - CURRENT_DATE BETWEEN 0 AND 90 THEN
        NEW."status" := 'SoonToBeEnded';
    ELSE
        NEW."status" := 'Active';
    END IF;

    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_contract_status
BEFORE INSERT OR UPDATE ON contract
FOR EACH ROW
EXECUTE FUNCTION update_contract_status_trigger();
