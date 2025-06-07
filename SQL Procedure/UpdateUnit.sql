alter PROCEDURE [dbo].[UpdateUnit]
    @id INt,
    @name NVARCHAR(20)
AS
BEGIN
    if not Exists(select 1 
    from dbo.units
    where id = @id)
    BEGIN
        RAISERROR('404/id/not found unit', 16, 1);
        RETURN;
    END

     if Exists(select 1 
    from dbo.units
    where name = @name)
    BEGIN
     RAISERROR('409/name/unit with such name has already existed', 16, 1);
        RETURN;
    END

    update dbo.units
    set name = @name
    where id = @id
    
    -- Проверяем, была ли удалена хотя бы одна строка
    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to update unit', 16, 1);
        RETURN;
    end
    

END;