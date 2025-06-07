

alter PROCEDURE [dbo].[IncomeBudget]
    @id INT,
    @amount float
AS
BEGIN
    BEGIN TRANSACTION;
    -- Проверяем, существует ли продукт
    IF NOT EXISTS (SELECT 1 FROM dbo.employees WHERE id = @id)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('404/id/not found employee', 16, 1);
        RETURN;
    END

    declare @budgetCount Int;   
    select @budgetCount = Count(*) from dbo.budgets

    if(@budgetCount = 0)
    BEGIN
        insert into dbo.budgets(amount, markUp, bonus, createdAt, updatedAt)
        VALUEs(@amount, 0, 0, GETDATE(), GETDATE())

         IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('409/unable to income budget', 16, 1);
        END

        ROLLBACK TRANSACTION;
        return;
    end

    if(@budgetCount > 1)
    BEGIN
        RAISERROR('409/server is unvailable, try later', 16, 1);
        ROLLBACK TRANSACTION;
        return;
    end

    UPDATE dbo.budgets set amount = amount + @amount

    IF @@ROWCOUNT = 0
    BEGIN
        CLOSE cur;
        DEALLOCATE cur;
        ROLLBACK TRANSACTION;
        RAISERROR('409/unable to income budget', 16, 1);
        RETURN;
    END

    insert into dbo.budget_histories(amount, employeeId, createdAt, updatedAt, type)
    VALUEs(@amount, @id, GETDATE(), GETDATE(), 'income')

    IF @@ROWCOUNT = 0
    BEGIN
        CLOSE cur;
        DEALLOCATE cur;
        ROLLBACK TRANSACTION;
        RAISERROR('409/unable to income budget', 16, 1);
        RETURN;
    END
    -- Фиксируем транзакцию
    COMMIT TRANSACTION;
END;
