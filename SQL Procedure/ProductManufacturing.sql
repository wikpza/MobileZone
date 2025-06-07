ALTER PROCEDURE [dbo].[ProductManufacturing]
    @productId INT,
    @quantity float,
    @employeeId INT
AS
BEGIN
    SET NOCOUNT ON;
    
    DECLARE @TotalCost DECIMAL(18,2) = 0;
    DECLARE @RawMaterialQuantity INT, @RawMaterialCost DECIMAL(18,2);
    DECLARE @IngredientId INT, @RawMaterialId INT, @IngredientQuantity INT;

    -- Начинаем транзакцию
    BEGIN TRANSACTION;

    -- Проверяем, существует ли продукт
    IF NOT EXISTS (SELECT 1 FROM dbo.products WHERE id = @productId)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('404/productId/Продукт не найден', 16, 1);
        RETURN;
    END

    -- Проверяем, существует ли сотрудник
    IF NOT EXISTS (SELECT 1 FROM dbo.employees WHERE id = @employeeId)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('404/employeeId/Сотрудник не найден', 16, 1);
        RETURN;
    END

    -- Проверяем, есть ли ингредиенты у продукта
    IF NOT EXISTS (SELECT 1 FROM dbo.ingredients WHERE productId = @productId)
    BEGIN
        ROLLBACK TRANSACTION;
        RAISERROR('409/productId/Не добавлены ингредиенты в рецепт', 16, 1);
        RETURN;
    END

    -- Курсор для обработки ингредиентов
    DECLARE cur CURSOR FOR 
    SELECT rawMaterialId, quantity FROM ingredients WHERE productId = @productId;

    OPEN cur;
    FETCH NEXT FROM cur INTO @RawMaterialId, @IngredientQuantity;

    WHILE @@FETCH_STATUS = 0
    BEGIN
        -- Проверяем, хватает ли сырья
        SELECT @RawMaterialQuantity = quantity, @RawMaterialCost = cost 
        FROM dbo.raw_materials WHERE id = @RawMaterialId;

        IF @RawMaterialQuantity < (@quantity * @IngredientQuantity)
        BEGIN
            ROLLBACK TRANSACTION;
            CLOSE cur;
            DEALLOCATE cur;
            RAISERROR('409/productId/Недостаточно сырья', 16, 1);
            RETURN;
        END

        -- Вычисляем стоимость используемого сырья
        DECLARE @RawMaterialPrice DECIMAL(18,2);
        SET @RawMaterialPrice = ROUND((@RawMaterialCost / NULLIF(@RawMaterialQuantity,0)) * (@IngredientQuantity * @quantity), 2);
        SET @TotalCost += @RawMaterialPrice;

        -- Обновляем данные сырья
        UPDATE dbo.raw_materials
        SET cost = cost - @RawMaterialPrice,
            quantity = quantity - (@IngredientQuantity * @quantity)
        WHERE id = @RawMaterialId;

        FETCH NEXT FROM cur INTO @RawMaterialId, @IngredientQuantity;
    END;

    CLOSE cur;
    DEALLOCATE cur;

    -- Обновляем данные о продукте
    UPDATE dbo.products
    SET quantity = quantity + @quantity,
        cost = cost + @TotalCost
    WHERE id = @productId;

    -- Проверяем успешность обновления
    IF @@ROWCOUNT = 0
    BEGIN
        CLOSE cur;
        DEALLOCATE cur;
        ROLLBACK TRANSACTION;
        RAISERROR('409/productId/Не удалось обновить продукт', 16, 1);
        RETURN;
    END

    insert into dbo.product_manufacturings(productId, quantity, createdAt, updatedAt, employeeId)
    values (@productId, @quantity, getDate(), GetDate(), @employeeId)

    -- Фиксируем транзакцию
    COMMIT TRANSACTION;
END;
