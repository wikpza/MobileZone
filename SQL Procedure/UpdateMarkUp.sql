

alter PROCEDURE [dbo].[UpdateMarkUp]
    @markUp Int
AS
BEGIN

    BEGIN TRANSACTION;
    declare @budgetCount Int;   
    select @budgetCount = Count(*) from dbo.budgets

    if(@budgetCount = 0)
    BEGIN
        insert into dbo.budgets(amount, markUp, bonus, createdAt, updatedAt)
        VALUEs(0, @markUp, 0, GETDATE(), GETDATE())

         IF @@ROWCOUNT = 0
        BEGIN
            RAISERROR('409/unable to change markUp', 16, 1);
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

    UPDATE dbo.budgets set markUp = @markUp

    IF @@ROWCOUNT = 0
    BEGIN
        CLOSE cur;
        DEALLOCATE cur;
        ROLLBACK TRANSACTION;
        RAISERROR('409/unable to change markUp', 16, 1);
        RETURN;
    END


    COMMIT TRANSACTION;
END;
