alter PROCEDURE CountPayLoan
    @loanId Int,
    @giveDate Date,

    @LastPaymentDate Date output,
    @loanPart FLOAT OUTPUT,
    @loanProcent FLOAT OUTPUT,
    @penya FLOAT Output,
    @overdueDays INTEGER output
AS
BEGIN
    Declare @loan_amount FLOAT;
    declare @loan_procentStavka FLOAT;
    declare @loan_penyaStavka FLOAT;
    declare @loan_periodYear Int;
    declare @loan_takeDate Date;
    declare @loan_statusFinished Int;
    
    
    Declare @outstandingBalance FLOAT;
    
    Declare @loanLast FLOAT;
    Declare @loanSum FLOAT;
   
    



    if not EXISTS (select 1 from loans where id = @loanId)
    BEGIN
     RAISERROR('404/loanId/not found loan.', 16, 1);
        RETURN;
    end

    

    select @loan_amount = loanSum,
            @outstandingBalance = loanSum,
            @loan_procentStavka = procentStavka,
            @loan_periodYear = periodYear,
            @loan_takeDate = takeDate,
            @loan_statusFinished = statusFinished,
            @loan_penyaStavka = penyaStavka,
            @LastPaymentDate = takeDate
     from dbo.loans where id = @loanId

   

    SELECT @LastPaymentDate = MAX(giveDate)
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
            Set @LastPaymentDate = @loan_takeDate
        END


    
    Set @loanPart = @loan_amount/@loan_periodYear/12
    Set @loanProcent = @outstandingBalance/100 * @loan_procentStavka/12
    Set @loanSum = @loanPart + @loanProcent
    Set @loanLast = @outstandingBalance - @loanPart

    set @LastPaymentDate =  DATEADD(MONTH,1, @LastPaymentDate)

    Set @overdueDays = DATEDIFF(Day,@LastPaymentDate, @giveDate)
    IF (@overdueDays < 0)
    BEGIN
        Set @overdueDays = 0
    END
    set @penya = @loanSum/100*@loan_penyaStavka * @overdueDays

END
