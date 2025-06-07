create PROCEDURE GenerateSalaryList
    @month INT,
    @year INT
AS
BEGIN
    DECLARE @current_month INT;
    DECLARE @current_year INT;

    DECLARE @sales_count INT;
    DECLARE @produce_count INT;
    DECLARE @buy_material_count INT;

    Declare @budget_count INT;
    Declare @employee_count INT;

    Declare @budget_bonus INT;
    DECLARE @emp_id INT;  -- Объявление переменной для ID сотрудника
    Declare @emp_salary Decimal;
    Declare @emp_bonus Decimal;
    Declare @has_change Int = 0;
    DECLARE @salary_date DATE;

    declare @emp_salary_sales_count INT
    declare @emp_salary_product_count INT
    declare @emp_salary_buy_material_count INT

    declare @emp_salary_id INT

    declare @emp_salary_bonus DECIMAL
    declare @emp_salary_salary DECIMAL
    declare @empa_salary_total_salary Decimal

    
    SELECT @current_month = MONTH(GETDATE()), @current_year = YEAR(GETDATE());

    select @employee_count = Count(*)
    from employees
    WHERE YEAR(createdAt) < @year OR (YEAR(createdAt) = @year AND MONTH(createdAt) <= @month);

    if(@employee_count = 0)
    BEGIN
         RAISERROR('409/month/not found employees, which work in this month.', 18, 1);
        RETURN;
    END
    
    DECLARE emp_cursor CURSOR FOR
    SELECT id, salary
    FROM employees
    WHERE YEAR(createdAt) < @year OR (YEAR(createdAt) = @year AND MONTH(createdAt) <= @month);
    -- Budget check
    select @budget_count = Count(*)
    IF @budget_count > 1
    BEGIN
        RAISERROR('500/SQL Error: Budget more than one budget record exists.', 16, 1);
        RETURN;
    END

    -- Если записей нет, создаём новую запись с нулями
    IF @budget_count = 0
    BEGIN
        INSERT INTO budgets (amount, bonus, markUp, createdAt, updatedAt) 
        VALUES (0, 0, 0, GETDATE(), GETDATE()); 
        Set @budget_bonus = 0
    END

    -- Если одна запись, извлекаем информацию о бюджете
    IF @budget_count = 1
    BEGIN
        SELECT @budget_bonus = bonus
        FROM budgets;
    END
    SET @salary_date = CAST(CAST(@year AS VARCHAR) + '-' + RIGHT('0' + CAST(@month AS VARCHAR), 2) + '-01' AS DATE);
    --- Employee cursor
    OPEN emp_cursor;
    FETCH NEXT FROM emp_cursor INTO @emp_id, @emp_salary;  -- Извлекаем первый ID сотрудника

    -- Для каждого сотрудника проверяем продажи
    WHILE @@FETCH_STATUS = 0
    BEGIN

        If EXISTS(
            SELECT 1 FROM employeeSalaries
             WHERE employeeId = @emp_id 
        AND YEAR(salaryDate) = @year 
        AND MONTH(salaryDate) = @month
        and isGiven = 1
        )
        begin 
         FETCH NEXT FROM emp_cursor INTO @emp_id,  @emp_salary;  -- Извлекаем следующий ID сотрудника
         CONTINUE;
        END
      

        IF not EXISTS (
            SELECT 1 FROM employeeSalaries
             WHERE employeeId = @emp_id 
        AND YEAR(salaryDate) = @year 
        AND MONTH(salaryDate) = @month
        )
        BEGIN
        

            SELECT @sales_count = COUNT(*) 
            FROM product_sales
            WHERE employeeId = @emp_id AND YEAR(createdAt) = @year AND MONTH(createdAt) = @month;

            select @produce_count = Count(*)
            from product_manufacturings
            WHERE employeeId = @emp_id AND YEAR(createdAt) = @year AND MONTH(createdAt) = @month;

            select @buy_material_count = Count(*)
            from raw_material_purchases
            WHERE employeeId = @emp_id AND YEAR(createdAt) = @year AND MONTH(createdAt) = @month;


            Set @emp_bonus = (@sales_count + @produce_count+ @buy_material_count) * @budget_bonus
            -- Выводим результат для каждого сотрудника
        
        
        
            -- Вставляем в таблицу employeeSalaries
                INSERT INTO employeeSalaries (employeeId, numSoledProduct, numCreatedProduct,
                numBuyMaterial, bonus, salary, totalSalary, salaryDate, createdAt, updatedAt, totalAction)
                VALUES (@emp_id, @sales_count, @produce_count, @buy_material_count, 
                @emp_bonus, @emp_salary, (@emp_bonus + @emp_salary), @salary_date, GETDATE(), GETDATE(),(@sales_count + @produce_count+ @buy_material_count) );

             FETCH NEXT FROM emp_cursor INTO @emp_id,  @emp_salary;  -- Извлекаем следующий ID сотрудника
            CONTINUE;
        END


        SELECT 
            @emp_salary_sales_count = numSoledProduct, 
            @emp_salary_product_count = numCreatedProduct, 
            @emp_salary_buy_material_count = numBuyMaterial,
            @emp_salary_id = ID,
            @emp_salary_salary = salary,
            @emp_salary_bonus = bonus,
            @empa_salary_total_salary = totalSalary
        FROM employeeSalaries
        WHERE employeeId = @emp_id 
            AND YEAR(salaryDate) = @year 
            AND MONTH(salaryDate) = @month;

        SELECT @sales_count = COUNT(*) 
            FROM product_sales
            WHERE employeeId = @emp_id AND YEAR(createdAt) = @year AND MONTH(createdAt) = @month;

            select @produce_count = Count(*)
            from product_manufacturings
            WHERE employeeId = @emp_id AND YEAR(createdAt) = @year AND MONTH(createdAt) = @month;

            select @buy_material_count = Count(*)
            from raw_material_purchases
            WHERE employeeId = @emp_id AND YEAR(createdAt) = @year AND MONTH(createdAt) = @month;


        if @emp_salary_buy_material_count = @buy_material_count 
        and @emp_salary_product_count = @produce_count 
        and @emp_salary_sales_count = @sales_count
        and @emp_salary_bonus = (@emp_salary_buy_material_count + @emp_salary_product_count + @emp_salary_sales_count) * @budget_bonus
        and @emp_salary_salary = @emp_salary
        -- and @empa_salary_total_salary = ((@emp_salary_buy_material_count + @emp_salary_product_count + @emp_salary_sales_count) * @budget_bonus) + @emp_salary
        BEGIN
            FETCH NEXT FROM emp_cursor INTO @emp_id,  @emp_salary;  -- Извлекаем следующий ID сотрудника
            CONTINUE;
        end

        update dbo.employeeSalaries
        set numSoledProduct = @sales_count, 
        numCreatedProduct = @produce_count,
        numBuyMaterial = @buy_material_count,
        totalAction = @sales_count + @produce_count + @buy_material_count,
        bonus = (@sales_count + @produce_count + @buy_material_count) * @budget_bonus,
        salary = @emp_salary,
        totalSalary = (@sales_count + @produce_count + @buy_material_count) * @budget_bonus + @emp_salary
        where ID = @emp_salary_id

        
        FETCH NEXT FROM emp_cursor INTO @emp_id,  @emp_salary;  -- Извлекаем следующий ID сотрудника
    END

    -- Закрываем и освобождаем курсор
    CLOSE emp_cursor;
    DEALLOCATE emp_cursor;

   SELECT 
    es.id AS employeeSalariesId, 
    es.employeeId, 
    es.numSoledProduct, 
    es.numCreatedProduct, 
    es.numBuyMaterial, 
    es.totalAction, 
    es.bonus, 
    es.salary, 
    es.totalSalary, 
    es.isGiven, 
    es.salaryDate, 
    es.createdAt, 
    es.updatedAt, 
    e.firstName, 
    e.lastName, 
    e.middleName, 
    e.positionId, 
    e.address, 
    e.phone
FROM dbo.employeeSalaries es
JOIN dbo.employees e ON es.employeeId = e.id
WHERE YEAR(es.salaryDate) = @year AND MONTH(es.salaryDate) = @month;

END
