create PROCEDURE [dbo].[UpdateRawMaterial]
   @name NVARCHAR(200),
   @id Int,
   @unitId Int
AS
BEGIN
    
    if  not Exists(select 1 
    from dbo.units
    where id = @unitId)
    BEGIN
     RAISERROR('404/unitId/not found @unit', 16, 1);
        RETURN;
    END


    if not exists(select 1 from dbo.raw_materials where id = @id)
    BEGIN
    RAISERROR('409/id/not found raw material', 16, 1);
        RETURN;
    END

    if   Exists(select 1 
    from dbo.raw_materials
    where name = @name and id != @id)
    BEGIN
     RAISERROR('409/name/raw material with such name has alredy existed', 16, 1);
        RETURN;
    ENd


    update dbo.raw_materials
    set unitId = @unitId,
    name = @name
    where id = @id

    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/name/unable to update raw material', 16, 1);
        RETURN;
    end
        

END;