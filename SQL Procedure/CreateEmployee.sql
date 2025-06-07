create PROCEDURE [dbo].[CreateEmployee]
    @firstName NVARCHAR(50), 
    @lastName NVARCHAR(50),
     @middleName NVARCHAR(50), 
     @salary Float, 
     @address NVARCHAR(300),
      @phone VARCHAR(17), 
      @positionId Int, 
      @login NVARCHAR(50),
       @password NVARCHAR(50)
AS
BEGIN
     if  not Exists(select 1 
    from dbo.positions
    where id = @positionId)
    BEGIN
     RAISERROR('404/positionId/not found position', 16, 1);
        RETURN;
    END

    if  Exists(select 1 
    from dbo.employees
    where login = @login)
    BEGIN
     RAISERROR('404/login/employee with such login has already existed', 16, 1);
        RETURN;
    END

    
   INSERT into dbo.employees(firstName, middleName, lastName, salary, address, phone,
   positionId, [login], [password], createdAt, updatedAt)
   values(@firstName, @middleName, @lastName, @salary, @address, @phone,
   @positionId, @login, @password, GETDATE(), GETDATE())

    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to add employee', 16, 1);
        RETURN;
    end
    

END;