CREATE OR REPLACE FUNCTION update_offer_status()
RETURNS VOID
AS
$$
BEGIN
    -- Update offers to "NoContract" status when the partner's contract has ended
    UPDATE offer
    SET status = 'NoContract'
    FROM partner
    WHERE offer."partnerId" IS NOT NULL
    AND offer."partnerId" = partner.id
    AND (SELECT status FROM contract WHERE id = partner."contractId") IN ('Ended', 'Terminated');
END;
$$
LANGUAGE plpgsql;
