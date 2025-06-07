alter PROCEDURE PayLoan
    @loanId Int,
    @giveDate Date,
    @employeeId Int

AS
BEGIN
    Declare @budget_id Int;
    Declare @budget_amount FLOAT;
    Declare @budget_count Int;


    Declare @loan_amount FLOAT;
    declare @loan_procentStavka FLOAT;
    declare @loan_penyaStavka FLOAT;
    declare @loan_periodYear Int;
    declare @loan_takeDate Date;
    declare @loan_statusFinished Int;
    

    Declare @LastPaymentDate Date;
    Declare @paymentCount Int;
    
    Declare @outstandingBalance FLOAT;
    Declare @loanPart FLOAT;
    Declare @loanProcent FLOAT;
    Declare @loanSum FLOAT;
    Declare @loanLast FLOAT;
    Declare @overdueDays INTEGER;
    Declare @penya FLOAT;
    Declare @totalLoan FLOAT;
    


    if not EXISTS (select 1 from loans where id = @loanId)
    BEGIN
     RAISERROR('404/loanId/not found loan.', 16, 1);
        RETURN;
    end

     if not EXISTS (select 1 from employees where id = @employeeId)
    BEGIN
     RAISERROR('404/employeeId/not found employee.', 16, 1);
        RETURN;
    end

    select @budget_count = Count(*) from budgets
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
    END

    -- Если одна запись, извлекаем информацию о бюджете
    IF @budget_count = 1
    BEGIN
        SELECT @budget_amount = amount
        FROM budgets;
    END

    select @loan_amount = loanSum,
            @outstandingBalance = loanSum,
            @loan_procentStavka = procentStavka,
            @loan_periodYear = periodYear,
            @loan_takeDate = takeDate,
            @loan_statusFinished = statusFinished,
            @loan_penyaStavka = penyaStavka,
            @LastPaymentDate = takeDate
     from dbo.loans where id = @loanId

    if (@LastPaymentDate > @giveDate)
    BEGIN
        RAISERROR('409/giveDate/you can not pay for loan that day before you take loan', 16, 1);
        RETURN;
    end

    if (@loan_statusFinished = 1)
    BEGIN
        RAISERROR('409/loanId/Loan had been successfully closed before.', 16, 1);
        RETURN;
    end


    SELECT @LastPaymentDate = MAX(giveDate), @paymentCount = COUNT(*)
        FROM loan_payments 
        WHERE loanId = @LoanID


    IF (@LastPaymentDate IS not NULL )
        BEGIN
            select @outstandingBalance = OstatokDolga
            from loan_payments
            where loanId = @LoanID and giveDate = @LastPaymentDate
        END
    else 
        BEGIN
            Set @LastPaymentDate = @loan_takeDate;
        END

    if (@LastPaymentDate > @giveDate and @LastPaymentDate IS not NULL)
        BEGIN
            RAISERROR('409/giveDate/you can not pay for loan that day before your last loan payement', 16, 1);
            RETURN;
        end
    -- check if before payment last
    
    Set @loanPart = @loan_amount/@loan_periodYear/12
    Set @loanProcent = @outstandingBalance/100 * @loan_procentStavka/12
    Set @loanSum = @loanPart + @loanProcent
    Set @loanLast = @outstandingBalance - @loanPart

    set @LastPaymentDate =  DATEADD(MONTH,@paymentCount + 1, @loan_takeDate)
    Set @overdueDays = DATEDIFF(Day,@LastPaymentDate, @giveDate)
    IF (@overdueDays < 0)
    BEGIN
        Set @overdueDays = 0
    END
    set @penya = @loanSum/100*@loan_penyaStavka * @overdueDays
    set @totalLoan = @loanSum + @penya


    
    if ( @budget_amount < @totalLoan )
        BEGIN
            RAISERROR('409/do not have enought money to pay for loan', 16, 1);
            RETURN;
        end

    -- Добавляем запись о пени
    PRINT @giveDate;
    
    INSERT INTO loan_payments (loanId, giveDate, mainLoan, procentSumma, penyaSumma, OstatokDolga, createdAt, updatedAt, overdueDay)
    VALUES (@LoanID, @giveDate, @loanPart, @loanProcent, @penya, @loanLast , GETDATE(), GETDATE(), @overdueDays);

    update budgets
    set amount = @budget_amount - @totalLoan

    Insert into budget_histories (amount, type, employeeId, createdAt, updatedAt)
    values (@budget_amount - @totalLoan, 'expense', @employeeId, GETDATE(), GEtDate())

    if(0.0001 >= @loanLast )
    BEGIN
        update loans
        set statusFinished = 1
        where id = @loanId
    END

END