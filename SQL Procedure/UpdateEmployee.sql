alter PROCEDURE [dbo].[UpdateEmployee]
    @id INT,
    @firstName NVARCHAR(50), 
    @lastName NVARCHAR(50),
    @middleName NVARCHAR(50), 
    @salary FLOAT, 
    @address NVARCHAR(300),
    @phone VARCHAR(17), 
    @positionId INT
AS
BEGIN
    DECLARE @selectedLogin NVARCHAR(50);

    -- Проверяем, существует ли указанная должность
    IF NOT EXISTS (SELECT 1 FROM dbo.positions WHERE id = @positionId)
    BEGIN
        RAISERROR('404/positionId/not found position', 16, 1);
        RETURN;
    END

     IF NOT EXISTS ( SELECT 1 FROM dbo.employees WHERE id = @id)
    BEGIN
       RAISERROR('404/id/not found employee', 16, 1);
        RETURN;
    END



    -- Обновляем сотрудника
    UPDATE dbo.employees
    SET 
        firstName = @firstName, 
        lastName = @lastName, 
        middleName = @middleName, 
        salary = @salary, 
        [address] = @address, 
        phone = @phone, 
        positionId = @positionId, 
        updatedAt = GETDATE()
    WHERE id = @id;

    -- Проверяем, было ли выполнено обновление
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('409/id/unable to update employee', 16, 1);
        RETURN;
    END
END;
