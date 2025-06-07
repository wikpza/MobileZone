 alter PROCEDURE GiveSalary
    @month INT,
    @year INT,
    @employeeId INT
AS
BEGIN
    DECLARE @current_month INT;
    DECLARE @current_year INT;
    DECLARE @budget_amount DECIMAL(18,2); -- Бюджет компании
    DECLARE @total_salary DECIMAL(18,2); -- Общая сумма зарплат
    DECLARE @has_change INT = 0; -- Флаг изменений
    DECLARE @emp_id INT;  
    DECLARE @emp_salary DECIMAL(18,2);
    DECLARE @salary_date DATE;

    BEGIN TRANSACTION;

    -- Получаем текущий месяц и год
    SELECT @current_month = MONTH(GETDATE()), @current_year = YEAR(GETDATE());

    -- Проверка, что указанный месяц и год завершены
    IF (@year = @current_year AND @month >= @current_month) OR (@year > @current_year)
    BEGIN
      ROLLBACK TRANSACTION;
        RAISERROR('409/month/The specified month and year are not completed yet.', 16, 1);
        RETURN;
    END

    -- Получаем сумму всех невыплаченных зарплат за указанный месяц и год
    SELECT @total_salary = SUM(totalSalary)
    FROM employeeSalaries
    WHERE YEAR(salaryDate) = @year AND MONTH(salaryDate) = @month AND isGiven = 0;

    -- Проверяем, есть ли невыплаченные зарплаты
    IF @total_salary IS NULL OR @total_salary = 0
    BEGIN
      ROLLBACK TRANSACTION;
        RAISERROR('409/month/No pending salaries found for this month.', 16, 1);
        RETURN;
    END

    -- Получаем текущий бюджет
    SELECT @budget_amount = amount FROM budgets;

    -- Проверка, хватает ли бюджета
    IF @budget_amount < @total_salary
    BEGIN
      ROLLBACK TRANSACTION;
        RAISERROR('402/budget/Not enough budget to pay salaries.', 16, 1);
        RETURN;
    END

    -- Вычитаем зарплаты из бюджета
    UPDATE budgets
    SET amount = amount - @total_salary,
        updatedAt = GETDATE();


    -- Обновляем статус зарплат на "paid"
    UPDATE employeeSalaries
    SET isGiven = 1,
        updatedAt = GETDATE()
    WHERE YEAR(salaryDate) = @year AND MONTH(salaryDate) = @month AND isGiven = 0;

 -- Добавляем запись в budget_history
        INSERT INTO dbo.budget_histories (employeeId, amount, [type], createdAt, updatedAt )
        VALUES (@employeeId, @total_salary, 'expense', GETDATE(), GETDATE());

    IF @@ROWCOUNT = 0
        BEGIN
            ROLLBACK TRANSACTION;
            RAISERROR('409/unable to give salary', 16, 1);
            RETURN;
        END
     COMMIT TRANSACTION;
END;
