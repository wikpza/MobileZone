Create PROCEDURE [dbo].[CreatePosition]
    @name NVARCHAR(20)
AS
BEGIN
    if Exists(select 1 
    from dbo.positions
    where name = @name)
    BEGIN
     RAISERROR('409/name/position with such name has already existed', 16, 1);
        RETURN;
    END

    insert into dbo.positions (name, createdAt, updatedAt)
    values (@name, GetDate(), GETDATE())
END;