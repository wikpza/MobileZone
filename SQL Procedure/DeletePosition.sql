alter PROCEDURE [dbo].[DeletePosition]
    @id Int
AS
BEGIN

    if not Exists(select 1 
    from dbo.positions
    where id = @id)
    BEGIN
     RAISERROR('404/id/not found position', 16, 1);
        RETURN;
    END

    if Exists(select 1 
    from dbo.employees
    where positionId = @id)
    BEGIN
     RAISERROR('409/id/can not delete, because it references in employee', 16, 1);
        RETURN;
    END

    if Exists(select 1 
    from dbo.permission_accesses
    where positionId = @id)
    BEGIN
     RAISERROR('409/id/can not delete, because it references in permission', 16, 1);
        RETURN;
    END

    delete dbo.positions
    where id = @id

     IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to delete position', 16, 1);
        RETURN;
    end
    

END;