create PROCEDURE [dbo].[DeleteProduct]
  @id int
AS
BEGIN

     if not exists(select 1 from dbo.products where id = @id)
    BEGIN
    RAISERROR('404/id/not found product', 16, 1);
        RETURN;
    END

    if  exists(select 1 from dbo.product_sales where productId = @id)
    BEGIN
    RAISERROR('409/id/can not delete, because it references in product sale', 16, 1);
        RETURN;
    END

     if  exists(select 1 from dbo.ingredients where productId = @id)
    BEGIN
    RAISERROR('409/id/can not delete, because it references in ingredient', 16, 1);
        RETURN;
    END

     if  exists(select 1 from dbo.product_manufacturings where productId = @id)
    BEGIN
    RAISERROR('409/id/can not delete, because it references in product manufacturing', 16, 1);
        RETURN;
    END


    delete  dbo.products
    where id = @id

        IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/name/unable to add product', 16, 1);
        RETURN;
    end

END;