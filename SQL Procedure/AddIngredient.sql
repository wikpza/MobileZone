alter PROCEDURE [dbo].[AddIngredient]
    @productId Int,
    @rawMaterialId Int,
    @quantity Float
AS
BEGIN
    
    if  not Exists(select 1 
    from dbo.products
    where id = @productId)
    BEGIN
     RAISERROR('404/productId/not found product', 16, 1);
        RETURN;
    END


    if  not Exists(select 1 
    from dbo.raw_materials
    where id = @rawMaterialId)
    BEGIN
     RAISERROR('404/rawMaterialId/not found rawMaterialId', 16, 1);
        RETURN;
    END


    if  exists(select 1 from dbo.ingredients 
    where productId = @productId and rawMaterialId = @rawMaterialId)
    BEGIN
    RAISERROR('409/productId/can not add, because it has already been added', 16, 1);
        RETURN;
    END

   
    insert into dbo.ingredients(productId, rawMaterialId, quantity, createdAt, updatedAt)
    values(@productId, @rawMaterialId, @quantity, GETDATE(), GETDATE())

    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/productId/unable to add ingredient', 16, 1);
        RETURN;
    end
        

END;