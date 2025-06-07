alter PROCEDURE [dbo].[UpdateIngredient]
    @id Int,
    @quantity Float
AS
BEGIN
    
    if  not Exists(select 1 
    from dbo.ingredients
    where id = @id)
    BEGIN
     RAISERROR('404/id/not found ingredient', 16, 1);
        RETURN;
    END

   
    update  dbo.ingredients
    set quantity = @quantity
    where id = @id

    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to update ingredient', 16, 1);
        RETURN;
    end
        

END;