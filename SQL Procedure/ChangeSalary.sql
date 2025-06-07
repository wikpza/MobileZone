
CREATE PROCEDURE [dbo].[ChangeSalary]
    @id INT,
    @newSalary DECIMAL(18,2)
AS
BEGIN
    SET NOCOUNT ON;

    
    BEGIN TRY
        BEGIN TRANSACTION;
        -- Проверка, была ли зарплата уже выдана
        DECLARE @IsGiven BIT;
        SELECT @IsGiven = IsGiven FROM employeeSalaries WHERE Id = @Id;
        
        IF @IsGiven = 1
        BEGIN
            -- Возвращаем ошибку 409 (Conflict)
            RAISERROR('409/salary/salary successfully had been given.', 16, 1);
            RETURN;
        END
        

        -- Обновление зарплаты
        UPDATE employeeSalaries
        SET 
            totalSalary = @newSalary
        WHERE Id = @Id;
        
        
        COMMIT TRANSACTION;
    END TRY
    BEGIN CATCH
        IF @@TRANCOUNT > 0
            ROLLBACK TRANSACTION;
            
        -- Возвращаем информацию об ошибке
        SELECT 
            ERROR_NUMBER() AS ErrorCode,
            ERROR_MESSAGE() AS ErrorMessage,
            ERROR_STATE() AS ErrorDetails;
    END CATCH
END;

