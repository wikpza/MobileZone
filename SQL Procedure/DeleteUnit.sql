alter PROCEDURE [dbo].[DeleteUnit]
    @id INt
AS
BEGIN
    if not Exists(select 1 
    from dbo.units
    where id = @id)
    BEGIN
        RAISERROR('404/id/not found unit', 16, 1);
        RETURN;
    END

    if exists(select 1 
    from dbo.raw_materials
    where unitId = @id)
    BEGIN
        RAISERROR('409/id/unable to delete unitId, because it references in raw material', 16, 1);
        RETURN;
    END

    if exists(select 1 
    from dbo.products
    where unitId = @id)
    BEGIN
        RAISERROR('409/id/unable to delete unitId, because it references in product', 16, 1);
        RETURN;
    END

    DELETE FROM dbo.units
    WHERE id = @id;
    
    -- Проверяем, была ли удалена хотя бы одна строка
    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to delete unit', 16, 1);
        RETURN;
    end
    

END;