CREATE OR REPLACE FUNCTION update_offer_category_on_customer_update()
RETURNS TRIGGER AS
$$
BEGIN
    IF NEW.category <> OLD.category THEN
        UPDATE offer
        SET category = 'NA'
        WHERE "customerId" = NEW.id;
    END IF;
    RETURN NEW;
END;
$$
LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_offer_category_customer
AFTER UPDATE OF category ON customer
FOR EACH ROW
EXECUTE FUNCTION update_offer_category_on_customer_update();