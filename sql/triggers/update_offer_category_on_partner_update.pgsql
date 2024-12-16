CREATE OR REPLACE FUNCTION update_offer_category_on_partner_update()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.category <> OLD.category THEN
        UPDATE offer
        SET category = 'NA'
        WHERE "partnerId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_offer_category_partner
AFTER UPDATE OF category ON partner
FOR EACH ROW
EXECUTE FUNCTION update_offer_category_on_partner_update();