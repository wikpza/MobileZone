create PROCEDURE [dbo].[DeleteRawMaterial]
  @id Int
AS
BEGIN
    if  not Exists(select 1 
        from dbo.raw_materials
        where id = @id)
    BEGIN
     RAISERROR('404/id/not found raw material', 16, 1);
        RETURN;
    END

   
    if  Exists(select 1 
        from dbo.ingredients
        where rawMaterialId = @id)
    BEGIN
     RAISERROR('409/id/can not delete, because it references in Manufacturing Instructions', 16, 1);
        RETURN;
    END


    if  Exists(select 1 
        from dbo.ingredients
        where rawMaterialId = @id)
    BEGIN
     RAISERROR('409/id/can not delete, because it references in Manufacturing Instructions', 16, 1);
        RETURN;
    END

    if  Exists(select 1 
        from dbo.raw_material_purchases
        where rawMaterialId = @id)
    BEGIN
     RAISERROR('409/id/can not delete, because it references in raw material purchases', 16, 1);
        RETURN;
    END

    delete raw_materials
    where id = @id

    IF @@ROWCOUNT = 0
        begin
            RAISERROR('409/id/unable to delete raw material', 16, 1);
            RETURN;
        end


END;