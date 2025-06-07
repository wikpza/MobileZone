--Добавление Прав доступа
INSERT INTO [Product].[dbo].[permissions] (
    [permission], [description], [permissionKey], [createdAt], [updatedAt]
)
VALUES
    ('Unit List', 'Allows viewing the list of measurement units.', 'unit_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Unit Work (Create, Update, Delete)', 'Allows creating, updating, and deleting measurement units.', 'unit_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Employee List', 'Allows viewing the list of employees.', 'employee_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Employee Work (Create, Update, Delete)', 'Allows creating, updating, and deleting employee records.', 'employee_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Position List', 'Allows viewing the list of employee positions.', 'position_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Position Work (Create, Update, Delete)', 'Allows creating, updating, and deleting positions.', 'position_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Permission List', 'Allows viewing the list of available permissions.', 'permission_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Permission Work (Update)', 'Allows updating permission settings.', 'permission_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Raw Material List', 'Allows viewing the list of raw materials.', 'raw_material_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Raw Material Work (Create, Update, Delete)', 'Allows creating, updating, and deleting raw materials.', 'raw_material_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Product List', 'Allows viewing the list of products.', 'product_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Product Work (Create, Update, Delete)', 'Allows creating, updating, and deleting products.', 'product_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Product Manufacturing Instruction List', 'Allows setting up manufacturing instructions for products.', 'product_manufacturing_instruction_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Product Manufacturing List', 'Allows manufacturing products based on predefined instructions.', 'product_manufacturing_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Raw Material Procurement List', 'Allows procuring raw materials.', 'raw_material_procurement_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Product Sale list', 'Allows selling manufactured products.', 'product_sale_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Budget Info can see all information includes about budget', 'Allows viewing the current balance of the company budget.', 'budget_info', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Budget Work - can change all budget''s features', 'Allows applying markups to the budget.', 'budget_work', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Salary List Report', 'Allows viewing salary reports.', 'salary_list_report', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Salary Change', 'Allows modifying employee salaries.', 'salary_change', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Salary Give', 'Allows processing salary payments.', 'salary_give', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Loan List', 'Allows viewing a list of company loans.', 'loan_list', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Loan Take', 'Allows taking a new loan.', 'loan_take', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Loan Pay', 'Allows paying back a loan.', 'loan_pay', '2025-03-29T06:19:33.5033333+00:00', '2025-03-29T06:19:33.5033333+00:00'),
    ('Product Manufacturing Instruction Set Up', 'Allows setting up manufacturing instructions for products.', 'product_manufacturing_instruction_work', '2025-03-30T16:10:14.5633333+00:00', '2025-03-30T16:10:14.5633333+00:00'),
    ('Product Manufacturing Work', 'Allows manufacturing products based on predefined instructions.', 'product_manufacturing_work', '2025-03-30T16:10:14.5633333+00:00', '2025-03-30T16:10:14.5633333+00:00'),
    ('Raw Material Procurement Work', 'Allows manufacturing products based on predefined instructions.', 'raw_material_procurement_work', '2025-03-30T16:10:14.5633333+00:00', '2025-03-30T16:10:14.5633333+00:00'),
    ('Director select', 'ss', 'director_select', '2025-03-30T00:00:00.0000000+06:00', '2025-03-30T00:00:00.0000000+06:00'),
    ('Product Sale Work', 'ss', 'product_sale_work', '2025-03-30T00:00:00.0000000+06:00', '2025-03-30T00:00:00.0000000+06:00');


INSERT INTO [Product].[dbo].[units] 
    ([name], [createdAt], [updatedAt])
VALUES
    ('pc', '2024-01-01', '2024-01-01'); -- Пример: единица измерения "шт."


-- Добавление Бюджета
INSERT INTO [Product].[dbo].[budgets] 
    ([amount], [bonus], [markUp], [createdAt], [updatedAt])
VALUES
    (10000, 1500, 5, '2024-01-01', '2024-01-01');

-- Добавление Продукта товара
INSERT INTO [Product].[dbo].[products] 
    ([name], [unitId], [quantity], [cost], [createdAt], [updatedAt])
VALUES
    ('iPhone 14', 1, 50, 999.99, '2024-01-01', '2024-01-01'),
    ('Samsung Galaxy S23', 1, 40, 899.99, '2024-01-01', '2024-01-01'),
    ('Google Pixel 7', 1, 30, 799.99, '2024-01-01', '2024-01-01'),
    ('OnePlus 11', 1, 20, 699.99, '2024-01-01', '2024-01-01'),
    ('Xiaomi 13 Pro', 1, 60, 849.99, '2024-01-01', '2024-01-01');

-- Добавление сырья
INSERT INTO [Product].[dbo].[raw_materials] 
    ([name], [unitId], [quantity], [cost], [createdAt], [updatedAt])
VALUES
    ('Screen', 1, 100, 50.00, '2024-01-01', '2024-01-01'),
    ('Battery', 1, 100, 25.00, '2024-01-01', '2024-01-01'),
    ('Processor', 1, 100, 200.00, '2024-01-01', '2024-01-01'),
    ('Camera Module', 1, 100, 30.00, '2024-01-01', '2024-01-01'),
    ('Housing', 1, 100, 40.00, '2024-01-01', '2024-01-01');


-- Добавление Позиции
INSERT INTO [Product].[dbo].[positions] 
    ([name], [createdAt], [updatedAt])
VALUES
    ('Counter', '2024-01-01', '2024-01-01'),
    ('Admin', '2024-01-01', '2024-01-01'),
    ('Big Wheel', '2024-01-01', '2024-01-01'),
    ('Employee', '2024-01-01', '2024-01-01'),
    ('Manager', '2024-01-01', '2024-01-01');


-- Добавление Сотрудников
INSERT INTO [Product].[dbo].[employees] 
    ([firstName], [lastName], [middleName], [positionId], [salary], [address], [phone], [createdAt], [updatedAt], [login], [password])
VALUES
    ('John', 'Doe', 'Smith', 1, 5000, '123 Elm Street', '123-456-7890', '2024-01-01', '2024-01-01', '1', '1'),
    ('Jane', 'Doe', 'Johnson', 2, 5500, '456 Oak Street', '234-567-8901', '2024-01-01', '2024-01-01', '2', '1'),
    ('Alice', 'Williams', 'Brown', 3, 6000, '789 Pine Street', '345-678-9012', '2024-01-01', '2024-01-01', '3', '1'),
    ('Bob', 'Jones', 'Davis', 4, 4500, '101 Maple Street', '456-789-0123', '2024-01-01', '2024-01-01', '4', '4'),
    ('Charlie', 'Miller', 'Wilson', 5, 7000, '202 Birch Street', '567-890-1234', '2024-01-01', '2024-01-01', '5', '1');



-- Для первого телефона (productId = 1)
INSERT INTO [Product].[dbo].[ingredients] 
    ([productId], [rawMaterialId], [quantity], [createdAt], [updatedAt])
VALUES
    (1, 1, 10, '2024-01-01', '2024-01-01'),  -- Screen
    (1, 2, 2, '2024-01-01', '2024-01-01'),   -- Battery
    (1, 3, 1, '2024-01-01', '2024-01-01'),   -- Processor
    (1, 4, 3, '2024-01-01', '2024-01-01'),   -- Camera Module
    (1, 5, 5, '2024-01-01', '2024-01-01');   -- Housing

-- Для второго телефона (productId = 2)
INSERT INTO [Product].[dbo].[ingredients] 
    ([productId], [rawMaterialId], [quantity], [createdAt], [updatedAt])
VALUES
    (2, 1, 10, '2024-01-01', '2024-01-01'),  -- Screen
    (2, 2, 2, '2024-01-01', '2024-01-01'),   -- Battery
    (2, 3, 1, '2024-01-01', '2024-01-01'),   -- Processor
    (2, 4, 3, '2024-01-01', '2024-01-01'),   -- Camera Module
    (2, 5, 5, '2024-01-01', '2024-01-01');   -- Housing

-- Для третьего телефона (productId = 3)
INSERT INTO [Product].[dbo].[ingredients] 
    ([productId], [rawMaterialId], [quantity], [createdAt], [updatedAt])
VALUES
    (3, 1, 10, '2024-01-01', '2024-01-01'),  -- Screen
    (3, 2, 2, '2024-01-01', '2024-01-01'),   -- Battery
    (3, 3, 1, '2024-01-01', '2024-01-01'),   -- Processor
    (3, 4, 3, '2024-01-01', '2024-01-01'),   -- Camera Module
    (3, 5, 5, '2024-01-01', '2024-01-01');   -- Housing

-- Для четвертого телефона (productId = 4)
INSERT INTO [Product].[dbo].[ingredients] 
    ([productId], [rawMaterialId], [quantity], [createdAt], [updatedAt])
VALUES
    (4, 1, 10, '2024-01-01', '2024-01-01'),  -- Screen
    (4, 2, 2, '2024-01-01', '2024-01-01'),   -- Battery
    (4, 3, 1, '2024-01-01', '2024-01-01'),   -- Processor
    (4, 4, 3, '2024-01-01', '2024-01-01'),   -- Camera Module
    (4, 5, 5, '2024-01-01', '2024-01-01');   -- Housing

-- Для пятого телефона (productId = 5)
INSERT INTO [Product].[dbo].[ingredients] 
    ([productId], [rawMaterialId], [quantity], [createdAt], [updatedAt])
VALUES
    (5, 1, 10, '2024-01-01', '2024-01-01'),  -- Screen
    (5, 2, 2, '2024-01-01', '2024-01-01'),   -- Battery
    (5, 3, 1, '2024-01-01', '2024-01-01'),   -- Processor
    (5, 4, 3, '2024-01-01', '2024-01-01'),   -- Camera Module
    (5, 5, 5, '2024-01-01', '2024-01-01');   -- Housing





-- Для первого продукта (productId = 1)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 10, 1500, 1, '2024-01-01', '2024-01-01'); -- Пример: 10 единиц, цена 1500, продано сотрудником с id 1

-- Для второго продукта (productId = 2)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 5, 1200, 2, '2024-01-01', '2024-01-01'); -- Пример: 5 единиц, цена 1200, продано сотрудником с id 2

-- Для третьего продукта (productId = 3)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 7, 1300, 3, '2024-01-01', '2024-01-01'); -- Пример: 7 единиц, цена 1300, продано сотрудником с id 3

-- Для первого продукта (productId = 1)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 20, 1, '2024-01-01', '2024-01-01'); -- Пример: 20 единиц произведено сотрудником с id 1

-- Для второго продукта (productId = 2)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 15, 2, '2024-01-01', '2024-01-01'); -- Пример: 15 единиц произведено сотрудником с id 2

-- Для четвертого продукта (productId = 4)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (4, 8, 4, '2024-01-01', '2024-01-01'); -- Пример: 8 единиц произведено сотрудником с id 4

-- Для пятого продукта (productId = 5)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (5, 5, 5, '2024-01-01', '2024-01-01'); -- Пример: 5 единиц произведено сотрудником с id 5


-- Для первого сырья (rawMaterialId = 1)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 100, 1500, 1, '2024-01-01', '2024-01-01'); -- Пример: 100 единиц сырья 1 куплено за 1500 сотрудником с id 1

-- Для второго сырья (rawMaterialId = 2)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 50, 1000, 2, '2024-01-01', '2024-01-01'); -- Пример: 50 единиц сырья 2 куплено за 1000 сотрудником с id 2

-- Для третьего сырья (rawMaterialId = 3)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 200, 2500, 3, '2024-01-01', '2024-01-01'); -- Пример: 200 единиц сырья 3 куплено за 2500 сотрудником с id 3

-- Для четвертого сырья (rawMaterialId = 4)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (4, 150, 2000, 4, '2024-01-01', '2024-01-01'); -- Пример: 150 единиц сырья 4 куплено за 2000 сотрудником с id 4

-- Для пятого сырья (rawMaterialId = 5)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (5, 300, 3500, 5, '2024-01-01', '2024-01-01'); -- Пример: 300 единиц сырья 5 куплено за 3500 сотрудником с id 5


-- Для первого продукта (productId = 1)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 12, 1500, 1, '2024-02-01', '2024-02-01'); -- Пример: 12 единиц, цена 1500, продано сотрудником с id 1

-- Для второго продукта (productId = 2)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 8, 1200, 2, '2024-02-01', '2024-02-01'); -- Пример: 8 единиц, цена 1200, продано сотрудником с id 2

-- Для третьего продукта (productId = 3)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 10, 1300, 3, '2024-02-01', '2024-02-01'); -- Пример: 10 единиц, цена 1300, продано сотрудником с id 3

-- Для первого продукта (productId = 1)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 25, 1, '2024-02-01', '2024-02-01'); -- Пример: 25 единиц произведено сотрудником с id 1

-- Для второго продукта (productId = 2)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 18, 2, '2024-02-01', '2024-02-01'); -- Пример: 18 единиц произведено сотрудником с id 2

-- Для третьего продукта (productId = 3)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 12, 3, '2024-02-01', '2024-02-01'); -- Пример: 12 единиц произведено сотрудником с id 3

-- Для первого сырья (rawMaterialId = 1)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 120, 1500, 1, '2024-02-01', '2024-02-01'); -- Пример: 120 единиц сырья 1 куплено за 1500 сотрудником с id 1

-- Для второго сырья (rawMaterialId = 2)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 60, 1000, 2, '2024-02-01', '2024-02-01'); -- Пример: 60 единиц сырья 2 куплено за 1000 сотрудником с id 2

-- Для третьего сырья (rawMaterialId = 3)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 250, 2500, 3, '2024-02-01', '2024-02-01'); -- Пример: 250 единиц сырья 3 куплено за 2500 сотрудником с id 3

-- Для четвертого сырья (rawMaterialId = 4)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (4, 180, 2000, 4, '2024-02-01', '2024-02-01'); -- Пример: 180 единиц сырья 4 куплено за 2000 сотрудником с id 4

-- Для пятого сырья (rawMaterialId = 5)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (5, 320, 3500, 5, '2024-02-01', '2024-02-01'); -- Пример: 320 единиц сырья 5 куплено за 3500 сотрудником с id 5
-- Для первого продукта (productId = 1)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 15, 1500, 1, '2024-03-01', '2024-03-01'); -- Пример: 15 единиц, цена 1500, продано сотрудником с id 1

-- Для второго продукта (productId = 2)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 10, 1200, 2, '2024-03-01', '2024-03-01'); -- Пример: 10 единиц, цена 1200, продано сотрудником с id 2

-- Для третьего продукта (productId = 3)
INSERT INTO [Product].[dbo].[product_sales] 
    ([productId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 9, 1300, 3, '2024-03-01', '2024-03-01'); -- Пример: 9 единиц, цена 1300, продано сотрудником с id 3

-- Для первого продукта (productId = 1)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 30, 1, '2024-03-01', '2024-03-01'); -- Пример: 30 единиц произведено сотрудником с id 1

-- Для второго продукта (productId = 2)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 20, 2, '2024-03-01', '2024-03-01'); -- Пример: 20 единиц произведено сотрудником с id 2

-- Для третьего продукта (productId = 3)
INSERT INTO [Product].[dbo].[product_manufacturings] 
    ([productId], [quantity], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 15, 3, '2024-03-01', '2024-03-01'); -- Пример: 15 единиц произведено сотрудником с id 3

-- Для первого сырья (rawMaterialId = 1)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (1, 130, 1500, 1, '2024-03-01', '2024-03-01'); -- Пример: 130 единиц сырья 1 куплено за 1500 сотрудником с id 1

-- Для второго сырья (rawMaterialId = 2)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (2, 70, 1000, 2, '2024-03-01', '2024-03-01'); -- Пример: 70 единиц сырья 2 куплено за 1000 сотрудником с id 2

-- Для третьего сырья (rawMaterialId = 3)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (3, 280, 2500, 3, '2024-03-01', '2024-03-01'); -- Пример: 280 единиц сырья 3 куплено за 2500 сотрудником с id 3

-- Для четвертого сырья (rawMaterialId = 4)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (4, 200, 2000, 4, '2024-03-01', '2024-03-01'); -- Пример: 200 единиц сырья 4 куплено за 2000 сотрудником с id 4

-- Для пятого сырья (rawMaterialId = 5)
INSERT INTO [Product].[dbo].[raw_material_purchases] 
    ([rawMaterialId], [quantity], [cost], [employeeId], [createdAt], [updatedAt])
VALUES
    (5, 350, 3500, 5, '2024-03-01', '2024-03-01'); -- Пример: 350 единиц сырья 5 куплено за 3500 сотрудником с id 5


