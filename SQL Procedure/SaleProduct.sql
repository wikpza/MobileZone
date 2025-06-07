alter PROCEDURE [dbo].[saleProduct]
    @p_employeeId INT,
    @p_productId INT,
    @p_quantity FLOAT
AS
BEGIN
    SET NOCOUNT ON;
    DECLARE @AvailableQuantity FLOAT;
    DECLARE @CostPricePerUnit FLOAT;
    DECLARE @MarkupPercentage FLOAT;
    DECLARE @SalePricePerUnit FLOAT;
    DECLARE @TotalSaleAmount FLOAT;
    DECLARE @BudgetID INT;
    DECLARE @CurrentBudgetAmount FLOAT;
    DECLARE @SaleDate DATETIME = GETDATE(); -- Добавляем текущую дату как дату продажи

    BEGIN TRY
        BEGIN TRANSACTION;

        -- Получаем количество товара на складе и себестоимость
        SELECT @AvailableQuantity = quantity, 
               @CostPricePerUnit = (cost / NULLIF(quantity, 0))
        FROM products
        WHERE id = @p_productId;

        if not Exists(select 1 from employees where id=@p_employeeId)
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('404/employeeId/not found employee', 16, 1);
            RETURN;
        end
        -- Проверяем, есть ли товар
        IF @AvailableQuantity IS NULL
        BEGIN
              ROLLBACK TRANSACTION;
            RAISERROR('404/productId/not found product', 16, 1);
            RETURN;
        END

        IF @p_quantity <= 0
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('404/quantity/quantity must be more than 0', 16, 1);
            RETURN;
        END

        IF @AvailableQuantity < @p_quantity
        BEGIN
              ROLLBACK TRANSACTION;
            RAISERROR('404/productId/ not enough product', 16, 1);
            RETURN;
        END

        -- Получаем наценку из бюджета (если нет, используем 20%)
        SELECT TOP 1 @MarkupPercentage = markUp 
        FROM budgets 
        ORDER BY id DESC;

        IF @MarkupPercentage IS NULL
        BEGIN
            SET @MarkupPercentage = 20;
        END

        -- Рассчитываем сумму продажи
        SET @SalePricePerUnit = @CostPricePerUnit * (1 + @MarkupPercentage / 100);
        SET @TotalSaleAmount = @SalePricePerUnit * @p_quantity;

        -- Создаём запись о продаже
        INSERT INTO product_sales (productId, quantity, cost, createdAt, employeeId, updatedAt)
        VALUES (@p_productId, @p_quantity, @TotalSaleAmount, @SaleDate, @p_employeeId, GETDATE());

        -- Обновляем количество товара
        UPDATE products 
        SET quantity = quantity - @p_quantity
        WHERE id = @p_productId;

        -- Обновляем бюджет
        SELECT TOP 1 @BudgetID = id, @CurrentBudgetAmount = amount 
        FROM budgets 
        ORDER BY id DESC;

        IF @BudgetID IS NOT NULL
        BEGIN
            UPDATE budgets 
            SET amount = amount + @TotalSaleAmount
            WHERE id = @BudgetID;
        END
      
        INSERT into budget_histories(employeeId, amount, [type], createdAt, updatedAt)
        VALUES(@p_employeeId,@TotalSaleAmount, 'income', GETDATE(), GETDATE() )
        COMMIT TRANSACTION;
        
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        DECLARE @ErrorMessage NVARCHAR(4000) = ERROR_MESSAGE();
        DECLARE @ErrorSeverity INT = ERROR_SEVERITY();
        DECLARE @ErrorState INT = ERROR_STATE();
        
        -- Возвращаем информацию об ошибке
        SELECT 
            'Error' AS Status,
            @ErrorMessage AS Message,
            @ErrorSeverity AS Severity,
            @ErrorState AS State;
    END CATCH
END;