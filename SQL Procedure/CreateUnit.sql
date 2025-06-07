Create PROCEDURE [dbo].[CreateUnit]
    @name NVARCHAR(20)
AS
BEGIN
    if Exists(select 1 
    from dbo.units
    where name = @name)
    BEGIN
     RAISERROR('409/name/unit with such name has already existed', 16, 1);
        RETURN;
    END

    insert into dbo.units (name, createdAt, updatedAt)
    values (@name, GetDate(), GETDATE())
END;