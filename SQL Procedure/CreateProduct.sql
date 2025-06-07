create PROCEDURE [dbo].[CreateProduct]
  @name NVARCHAR(100),
  @unitId int
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
    from dbo.products
    where name = @name)
    BEGIN
    RAISERROR('409/name/raw material with such name has alredy existed', 16, 1);
        RETURN;
    END

    insert into dbo.products(name, unitId, createdAt, updatedAt)
    values (@name, @unitId, GETDATE(), GETDATE())

        IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/name/unable to add product', 16, 1);
        RETURN;
    end

END;