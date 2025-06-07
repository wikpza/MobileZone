CREATE PROCEDURE [dbo].[DeleteEmployee]
    @id INT
AS
BEGIN


    IF not Exists(select 1 from dbo.employees where id = @id)
    BEGIN
        RAISERROR('404/id/not found employee', 16, 1);
        RETURN;
    END



    IF  Exists(select 1 from dbo.employeeSalaries where employeeId = @id)
    BEGIN
        RAISERROR('409/id/can not delete, because in references in salary', 16, 1);
        RETURN;
    END

    IF  Exists(select 1 from dbo.raw_material_purchases where employeeId = @id)
    BEGIN
        RAISERROR('409/id/can not delete, because in references in raw material purchase', 16, 1);
        RETURN;
    END

     IF  Exists(select 1 from dbo.product_sales where employeeId = @id)
    BEGIN
        RAISERROR('409/id/can not delete, because in references in raw material product sales', 16, 1);
        RETURN;
    END

     IF  Exists(select 1 from dbo.product_manufacturings where employeeId = @id)
    BEGIN
        RAISERROR('409/id/can not delete, because in references in raw material product manufacturing', 16, 1);
        RETURN;
    END

      IF  Exists(select 1 from dbo.budget_histories where employeeId = @id)
    BEGIN
        RAISERROR('409/id/can not delete, because in references in raw material budgte history', 16, 1);
        RETURN;
    END
    -- Обновляем сотрудника

    delete dbo.employees
    where id = @id

    -- Проверяем, было ли выполнено обновление
    IF @@ROWCOUNT = 0
    BEGIN
        RAISERROR('409/id/unable to update employee', 16, 1);
        RETURN;
    END
END;
