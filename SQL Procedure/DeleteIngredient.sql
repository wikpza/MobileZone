create PROCEDURE [dbo].[DeleteIngredient]
    @id Int
AS
BEGIN
    
    if  not Exists(select 1 
    from dbo.ingredients
    where id = @id)
    BEGIN
     RAISERROR('404/id/not found ingredient', 16, 1);
        RETURN;
    END

   
    delete dbo.ingredients
    where id = @id

    IF @@ROWCOUNT = 0
    begin
        RAISERROR('409/id/unable to delete ingredient', 16, 1);
        RETURN;
    end
        

END;