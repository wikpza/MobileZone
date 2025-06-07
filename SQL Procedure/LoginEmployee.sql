alter PROCEDURE LoginEmployee
        @login NVARCHAR(20),
        @password NVARCHAR(20),

        @id Int OUTPUT,
        @firstName NVARCHAR(50) OUTPUT,
        @lastName NVARCHAR(50) OUTPUT,
        @middleName NVARCHAR(50) OUTPUT,
        @phone NVARCHAR(50) OUTPUT
AS
BEGIN
    if not EXists(select 1 from dbo.employees where login = @login)
    BEGIN
        RAISERROR('404/login/not found employee', 16, 1);
        RETURN;
    END

    if not EXists(select 1 from dbo.employees where login = @login and [password] = @password)
    BEGIN
        RAISERROR('409/password/uncorrect password', 16, 1);
        RETURN;
    END

    select @id = id, @firstName = firstName, @lastName = lastName, @middleName = middleName, @phone = phone
    from dbo.employees
    where login = @login and [password] = @password

End;
