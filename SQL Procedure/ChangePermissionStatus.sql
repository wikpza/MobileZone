create PROCEDURE [dbo].[ChangePermissionStatus]
   @type NVARCHAR(6),
   @permissionId Int,
   @positionId Int
AS
BEGIN
     if  not Exists(select 1 
    from dbo.positions
    where id = @positionId)
    BEGIN
     RAISERROR('404/positionId/not found position', 16, 1);
        RETURN;
    END

     if  not Exists(select 1 
    from dbo.permissions
    where id = @permissionId)
    BEGIN
     RAISERROR('404/@permissionId/not found permisssion', 16, 1);
        RETURN;
    END

    if @type = 'add'
    BEGIN
        if  Exists(select 1 
        from dbo.permission_accesses
        where permissionId = @permissionId and positionId = @positionId)
        BEGIN
        RAISERROR('409/@permissionId/position has already that permission', 16, 1);
            RETURN;
        END
        insert into dbo.permission_accesses(permissionId, positionId, createdAt, updatedAt)
        values (@permissionId, @positionId, GETDATE(), GETDATE())

         IF @@ROWCOUNT = 0
        begin
            RAISERROR('409/permissionId/unable give add permission', 16, 1);
            RETURN;
        end
    END

    ELSE
    BEGIN
        if not Exists(select 1 
        from dbo.permission_accesses
        where permissionId = @permissionId and positionId = @positionId)
        BEGIN
        RAISERROR('409/@permissionId/position has not that permission', 16, 1);
            RETURN;
        END
        
        delete dbo.permission_accesses
        where permissionId = @permissionId and positionId = @positionId

         IF @@ROWCOUNT = 0
        begin
            RAISERROR('409/permissionId/unable to delete permission', 16, 1);
            RETURN;
        end
    end


END;