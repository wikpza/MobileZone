

alter PROCEDURE [dbo].[TakeLoan]
   @employeeId Int,
    @loanSum float, 
    @procentStavka float, 
    @periodYear Int, 
    @penyaStavka float
AS
BEGIN



    

    if not exists(select 1 from dbo.employees where id = @employeeId)
    BEGIN
        RAISERROR('404/employeeId/not found employee', 16, 1);
        return;
    END
    declare @budgetCount Int;   
    select @budgetCount = Count(*) from dbo.budgets

    BEGIN TRANSACTION;

    if(@budgetCount = 0)
    BEGIN
        insert into dbo.budgets(amount, markUp, bonus, createdAt, updatedAt)
        VALUEs(0, 0, 0, GETDATE(), GETDATE())

         IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('409/unable to take loan', 16, 1);
             ROLLBACK TRANSACTION;
            return;
        END
    end

    if(@budgetCount > 1)
    BEGIN
        RAISERROR('409/server is unvailable, try later', 16, 1);
        ROLLBACK TRANSACTION;
        return;
    end

    UPDATE dbo.budgets set amount = amount + @loanSum

    IF @@ROWCOUNT = 0
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('409/unable to take loan', 16, 1);
        RETURN;
    END

    insert into dbo.budget_histories(amount, employeeId, [type], createdAt, updatedAt)
    values(@loanSum, @employeeId, 'income', GETDATE(), GETDATE())
    IF @@ROWCOUNT = 0
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('409/unable to take loan', 16, 1);
            RETURN;
        END


    insert into dbo.loans(loanSum, procentStavka, periodYear, takeDate, statusFinished, createdAt, updatedAt, penyaStavka)
    values(@loanSum, @procentStavka, @periodYear, GETDATE(), 0, GETDATE(), GETDATE(), @penyaStavka)
    IF @@ROWCOUNT = 0
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('409/unable to take loan', 16, 1);
            RETURN;
        END
    COMMIT TRANSACTION;
END;
