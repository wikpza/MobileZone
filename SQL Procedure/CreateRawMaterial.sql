alter PROCEDURE [dbo].[CreateRawMaterial]
   @name NVARCHAR(200),
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

     if  Exists(select 1 
    from dbo.raw_materials
    where name = @name)
    BEGIN
    RAISERROR('409/name/raw material with such name has alredy existed', 16, 1);
        RETURN;
    END

    insert into dbo.raw_materials(name, unitId, createdAt, updatedAt)
    values (@name, @unitId, GETDATE(), GETDATE())

        IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/name/unable to add raw material', 16, 1);
        RETURN;
    end

END;