alter PROCEDURE [dbo].[MakeRawMaterialPurchase]
    @rawMaterialId INT,
    @quantity float,
    @cost float,
    @employerId Int
AS
BEGIN
    declare @budgetCount Int;
    declare @budgetAmount FLOAT;

    
    if not exists(select 1 from dbo.raw_materials where id = @rawMaterialId)
    BEGIN
        RAISERROR('404/rawMaterialId/not found raw material', 16, 1);
        RETURN;
    end

    if not exists(select 1 from dbo.employees where id = @employerId)
    BEGIN
        RAISERROR('404/employerId/not found employee', 16, 1);
        RETURN;
    end

    select @budgetCount = Count(*), @budgetAmount = Sum(amount) from dbo.budgets

    if(@budgetCount = 0)
    BEGIN
        insert into dbo.budgets(amount, markUp, bonus, createdAt, updatedAt)
        VALUES(0, 0, 0, GETDATE(), GetDate())
        RAISERROR('409/cost/Insufficient funds for purchase.', 16, 1);
        RETURN;
    END

    if(@budgetCount > 1)
    BEGIN
        RAISERROR('409/Unable to get Budget: error in system', 16, 1);
        RETURN;
    END

    if @budgetAmount < @cost 
    BEGIN
        RAISERROR('409/cost/Insufficient funds for purchase.', 16, 1);
        RETURN;
    END

    BEGIN TRANSACTION;

        UPDATE dbo.budgets set amount = amount - @cost
         IF @@ROWCOUNT = 0
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('409/Unable to make purchase', 16, 1);
            RETURN;
        END

        update dbo.raw_materials set quantity = quantity - @quantity where id = @rawMaterialId 
        IF @@ROWCOUNT = 0
            BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('409/Unable to make purchase', 16, 1);
            RETURN;
        END


        insert into dbo.budget_histories(amount, [type], employeeId, createdAt, updatedAt)
        VALUEs(@cost, 'expense', @employerId, GETDATE(), GETDATE())
         IF @@ROWCOUNT = 0
            BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('409/Unable to make purchase', 16, 1);
            RETURN;
        END

        insert into dbo.raw_material_purchases(rawMaterialId, quantity, cost, employeeId, createdAt, updatedAt)
        values(@rawMaterialId, @quantity, @cost, @employerId, GETDATE(), GETDATE())
    COMMIT TRANSACTION;
END;
