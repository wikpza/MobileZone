alter PROCEDURE [dbo].[UpdatePosition]
    @name NVARCHAR(20),
    @id Int
AS
BEGIN

    if not Exists(select 1 
    from dbo.positions
    where id = id)
    BEGIN
     RAISERROR('404/id/not found position', 16, 1);
        RETURN;
    END

    if Exists(select 1 
    from dbo.positions
    where name = @name)
    BEGIN
     RAISERROR('409/name/position with such name has already existed', 16, 1);
        RETURN;
    END

    update dbo.positions
    set name = @name
    where id = @id

    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to update position', 16, 1);
        RETURN;
    end
    

END;