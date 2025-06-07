alter PROCEDURE [dbo].[UpdateEmployeeData]
    @id INT,
    @login NVARCHAR(50),
    @password NVARCHAR(50)
AS
BEGIN
    DECLARE @selectedLogin NVARCHAR(50);

    -- Проверяем, существует ли сотрудник с таким ID
    SELECT @selectedLogin = login FROM dbo.employees WHERE id = @id;

    IF @selectedLogin IS NULL
    BEGIN
        RAISERROR('404/id/not found employee', 16, 1);
        RETURN;
    END

    -- Проверяем, не занят ли новый логин другим сотрудником
    IF @selectedLogin != @login AND EXISTS (SELECT 1 FROM dbo.employees WHERE login = @login)
    BEGIN
        RAISERROR('409/login/employee with such login already exists', 16, 1);
        RETURN;
    END

    -- Обновляем сотрудника
    UPDATE dbo.employees
    SET 
        login = @login, 
        password = @password,  -- Замените на HASHBYTES('SHA2_256', @password) если хешируете
        updatedAt = GETDATE()
    WHERE id = @id;

    -- Проверяем, было ли выполнено обновление
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('409/id/unable to update employee', 16, 1);
        RETURN;
    END
END;
